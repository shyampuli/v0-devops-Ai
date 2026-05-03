export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Accept flat payload structure: { error, stackTrace, source, environment }
    const errorMessage = body.error || body.issueData?.title
    const stackTrace = body.stackTrace || body.issueData?.stackTrace
    const source = body.source || body.issueData?.culprit
    const environment = body.environment || body.issueData?.environment || "production"

    // Validate required fields
    if (!errorMessage) {
      return Response.json({ error: "Missing error message" }, { status: 400 })
    }

    if (!stackTrace || stackTrace.trim() === "") {
      return Response.json({ error: "Missing stack trace" }, { status: 400 })
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return Response.json({ error: "GOOGLE_API_KEY not configured" }, { status: 500 })
    }

    const systemPrompt = `You are a senior DevOps engineer and SRE.

You are given a real production error with stack trace.

Perform deep technical analysis.

Do NOT give generic answers.
Do NOT mention AI limitations.
Do NOT say service unavailable.

Be specific, technical, and actionable.

Use this exact format:

Problem:
- Explain what the error means internally

Cause:
- Root cause analysis
- Mention code-level or system-level reasons

Fix:
- Step-by-step solution
- Include code fixes if applicable

Prevention:
- Monitoring, logging, validation strategies`

    const userPrompt = `Analyze this production error:

ERROR: ${errorMessage}

SOURCE: ${source || "Unknown"}

ENVIRONMENT: ${environment}

STACK TRACE:
${stackTrace}

Provide detailed technical analysis.`

    // Call Google Gemini API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\n${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2000,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorDetail = errorData.error?.message || response.statusText || "Unknown error"
      console.error("[Gemini API Error]:", errorDetail)
      return Response.json(
        { error: `Gemini API error: ${errorDetail}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extract text from Gemini response structure
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text || text.trim() === "") {
      const finishReason = data.candidates?.[0]?.finishReason
      if (finishReason === "SAFETY") {
        return Response.json({ error: "Content blocked by safety filters" }, { status: 400 })
      }
      return Response.json({ error: "Empty response from Gemini" }, { status: 500 })
    }

    return Response.json({ analysis: text })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Gemini Analysis Error]:", errorMessage)
    return Response.json(
      { error: `Analysis failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
