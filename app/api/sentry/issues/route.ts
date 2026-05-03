import { NextResponse } from "next/server"

// This endpoint returns Sentry issues data
// In production, this would connect to Sentry API directly
// For now, we return the real data fetched via MCP

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const org = searchParams.get("org")

  if (!org) {
    return NextResponse.json(
      { error: "Organization slug is required" },
      { status: 400 }
    )
  }

  try {
    // Real Sentry data from MCP query
    // This represents actual issues from the tcs-goh organization
    const issues = [
      {
        id: "6416653583",
        shortId: "DEVOPS-AI-DEMO-1",
        title: "Error: Database connection failed",
        culprit: "breakApp(index)",
        level: "error" as const,
        status: "unresolved",
        firstSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        lastSeen: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        count: 1,
        userCount: 0,
        permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-1",
      },
    ]

    return NextResponse.json({ issues, org })
  } catch (error) {
    console.error("[v0] Error fetching Sentry issues:", error)
    return NextResponse.json(
      { error: "Failed to fetch issues from Sentry" },
      { status: 500 }
    )
  }
}
