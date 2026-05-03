import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_API_KEY not configured" }, { status: 500 })
    }

    const { error, stackTrace } = await req.json()

    if (!error) {
      return NextResponse.json({ error: "No error data provided" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model: "gemini-pro", // ✅ stable model
    })

    const prompt = `
You are a senior DevOps engineer.

Analyze this production error deeply.

Error:
${error}

Stack Trace:
${stackTrace || "Not available"}

Provide detailed structured output:

Problem:
- Explain what the error means internally

Cause:
- Root cause analysis (code/system level)

Fix:
- Step-by-step solution (include code/config if needed)

Prevention:
- Monitoring, alerts, and best practices
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ result: text })

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 }
    )
  }
}