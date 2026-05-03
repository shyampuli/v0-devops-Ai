import { generateText } from "ai"

export async function POST(req: Request) {
  const { issueData } = await req.json()

  if (!issueData) {
    return Response.json({ error: "No issue data provided" }, { status: 400 })
  }

  const prompt = `You are a senior DevOps engineer with 15+ years of experience debugging production systems. You're analyzing a critical error from Sentry that needs immediate attention.

CONTEXT: This is a production environment. Your analysis must be precise, actionable, and based on real engineering experience.

=== ERROR DETAILS ===
Title: ${issueData.title}
Culprit: ${issueData.culprit}
Severity: ${issueData.level}
Platform: ${issueData.platform || "unknown"}
Environment: ${issueData.environment || "production"}

=== STACK TRACE ===
${issueData.stackTrace || "No stack trace available"}

=== ADDITIONAL CONTEXT ===
${issueData.context || "No additional context"}

=== TAGS ===
${issueData.tags || "No tags"}

=== YOUR ANALYSIS ===
Provide a DETAILED, production-grade analysis. Think like you're explaining this to another senior engineer who needs to fix this NOW.

Use EXACTLY this format:

Problem:
Clearly explain what is happening in technical terms. Reference the specific error type, the component/function involved, and the observable symptoms. Do NOT be vague - name the actual error and what it means.

Cause:
Perform root cause analysis. Consider:
- What conditions trigger this error?
- Is this a code bug, configuration issue, or infrastructure problem?
- Are there race conditions, null pointer issues, or dependency failures?
- What is the most likely scenario based on the stack trace?
Be specific. If the stack trace points to a specific file/line, mention it.

Fix:
Provide step-by-step actionable solution:
1. Immediate mitigation (if applicable)
2. Code-level fix with specific guidance
3. How to verify the fix worked
4. Any rollback considerations
Include code snippets or configuration changes if relevant.

Prevention:
Recommend engineering best practices:
- What monitoring/alerting should be added?
- What tests would catch this in CI?
- Are there architectural improvements to prevent this class of error?
- What safeguards or validation should be implemented?

Remember: No vague advice. No generic responses. Be the senior engineer this team needs.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxOutputTokens: 2000,
      temperature: 0.2,
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
