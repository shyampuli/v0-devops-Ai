import { GoogleGenAI } from "@google/genai"

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

    // Initialize with new @google/genai SDK
    const ai = new GoogleGenAI({ apiKey })

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

    // Call generateContent with gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\n${userPrompt}`,
    })

    const text = response.text

    if (!text || text.trim() === "") {
      return Response.json({ error: "Empty response from Gemini" }, { status: 500 })
    }

    return Response.json({ analysis: text })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    console.error("[Gemini Analysis Error]:", errorMsg)
    return Response.json(
      { error: `Analysis failed: ${errorMsg}` },
      { status: 500 }
    )
  }
}
