import { generateText } from "ai"

export async function POST(req: Request) {
  const { issueData } = await req.json()

  if (!issueData) {
    return Response.json({ error: "No issue data provided" }, { status: 400 })
  }

  const prompt = `You are a senior DevOps engineer analyzing a production error from Sentry. 
Analyze the following error and provide a structured response.

ERROR DETAILS:
Title: ${issueData.title}
Culprit: ${issueData.culprit}
Level: ${issueData.level}
Platform: ${issueData.platform || "unknown"}
Environment: ${issueData.environment || "production"}

STACK TRACE:
${issueData.stackTrace || "No stack trace available"}

CONTEXT:
${issueData.context || "No additional context"}

TAGS:
${issueData.tags || "No tags"}

Provide your analysis in EXACTLY this format (use these exact headers):

Problem:
[One sentence describing what the error is]

Cause:
[One to two sentences explaining the root cause]

Fix:
[Numbered steps to fix the issue - be specific and actionable]

Prevention:
[One to two sentences on how to prevent this in the future]

Be concise and engineering-focused.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxOutputTokens: 1000,
      temperature: 0.3,
    })

    return Response.json({ analysis: text })
  } catch (error) {
    console.error("[v0] AI analysis error:", error)
    return Response.json(
      { error: "Failed to analyze error" },
      { status: 500 }
    )
  }
}
