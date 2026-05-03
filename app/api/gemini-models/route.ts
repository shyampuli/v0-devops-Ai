import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_API_KEY not configured" }, { status: 500 })
    }

    // Initialize with new @google/genai SDK
    const ai = new GoogleGenAI({ apiKey })

    // List all available models
    const pager = await ai.models.list()
    const models: Array<{
      name: string
      displayName: string
      supportedMethods: string[]
      supportsGenerateContent: boolean
    }> = []

    for await (const model of pager) {
      const supportedMethods = model.supportedActions || []
      models.push({
        name: model.name || "unknown",
        displayName: model.displayName || model.name || "unknown",
        supportedMethods,
        supportsGenerateContent: supportedMethods.includes("generateContent"),
      })
    }

    // Sort: models with generateContent first
    models.sort((a, b) => {
      if (a.supportsGenerateContent && !b.supportsGenerateContent) return -1
      if (!a.supportsGenerateContent && b.supportsGenerateContent) return 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      total: models.length,
      generateContentModels: models.filter((m) => m.supportsGenerateContent).length,
      models,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list models" },
      { status: 500 }
    )
  }
}
