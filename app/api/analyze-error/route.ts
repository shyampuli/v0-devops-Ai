import { generateText } from "ai"

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

    // Log what we're sending to AI
    console.log("[v0] AI Request:", {
      error: errorMessage,
      source: source,
      stackTraceLength: stackTrace.length,
    })

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

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: userPrompt,
      maxOutputTokens: 2000,
      temperature: 0.2,
    })

    if (!text || text.trim() === "") {
      return Response.json({ error: "Empty response from AI" }, { status: 500 })
    }

    console.log("[v0] AI Response received, length:", text.length)

    return Response.json({ analysis: text })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] AI analysis error:", errorMessage)
    return Response.json(
      { error: `AI service error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
