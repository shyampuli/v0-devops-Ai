import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_API_KEY not configured" }, { status: 500 })
  }

  try {
    // Fetch models list directly from the API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.error?.message || "API error" }, { status: response.status })
    }

    const data = await response.json()
    
    // Filter and format models that support generateContent
    const models = data.models?.map((model: {
      name: string
      displayName: string
      supportedGenerationMethods: string[]
      description?: string
    }) => ({
      name: model.name,
      displayName: model.displayName,
      supportedMethods: model.supportedGenerationMethods,
      supportsGenerateContent: model.supportedGenerationMethods?.includes("generateContent"),
    })) || []

    // Sort by whether they support generateContent
    const generateContentModels = models.filter((m: { supportsGenerateContent: boolean }) => m.supportsGenerateContent)
    const otherModels = models.filter((m: { supportsGenerateContent: boolean }) => !m.supportsGenerateContent)

    return NextResponse.json({
      total: models.length,
      generateContentModels: generateContentModels.length,
      models: [...generateContentModels, ...otherModels],
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch models" },
      { status: 500 }
    )
  }
}
