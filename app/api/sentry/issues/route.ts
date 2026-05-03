import { NextResponse } from "next/server"

// This endpoint returns Sentry issues data
// The data below is fetched via Sentry MCP during development
// In production, you would use the Sentry SDK or API directly

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
    // Real Sentry data from MCP query (tcs-goh organization)
    // Fetched using Sentry_search_issues with limit=25 and query=is:unresolved
    const issues = [
      {
        id: "6416667283",
        shortId: "DEVOPS-AI-DEMO-6",
        title: "Error: Memory usage exceeded safe limit",
        culprit: "?(index)",
        level: "error" as const,
        status: "unresolved",
        firstSeen: "2026-05-03T06:22:00.000Z",
        lastSeen: "2026-05-03T06:22:00.000Z",
        count: 1,
        userCount: 0,
        permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-6",
      },
      {
        id: "6416667282",
        shortId: "DEVOPS-AI-DEMO-5",
        title: "Error: API request timeout after 5000ms",
        culprit: "?(index)",
        level: "error" as const,
        status: "unresolved",
        firstSeen: "2026-05-03T06:22:00.000Z",
        lastSeen: "2026-05-03T06:22:00.000Z",
        count: 1,
        userCount: 0,
        permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-5",
      },
      {
        id: "6416667281",
        shortId: "DEVOPS-AI-DEMO-4",
        title: "TypeError: Cannot read properties of undefined (reading 'name')",
        culprit: "?(index)",
        level: "error" as const,
        status: "unresolved",
        firstSeen: "2026-05-03T06:22:00.000Z",
        lastSeen: "2026-05-03T06:22:00.000Z",
        count: 1,
        userCount: 0,
        permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-4",
      },
      {
        id: "6416667280",
        shortId: "DEVOPS-AI-DEMO-3",
        title: "Error: Payment gateway service unavailable",
        culprit: "?(index)",
        level: "error" as const,
        status: "unresolved",
        firstSeen: "2026-05-03T06:22:00.000Z",
        lastSeen: "2026-05-03T06:22:00.000Z",
        count: 1,
        userCount: 0,
        permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-3",
      },
      {
        id: "6416667279",
        shortId: "DEVOPS-AI-DEMO-2",
        title: "Error: Database connection failed",
        culprit: "?(index)",
        level: "error" as const,
        status: "unresolved",
        firstSeen: "2026-05-03T06:22:00.000Z",
        lastSeen: "2026-05-03T06:22:00.000Z",
        count: 1,
        userCount: 0,
        permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-2",
      },
      {
        id: "6416653583",
        shortId: "DEVOPS-AI-DEMO-1",
        title: "Error: Database connection failed",
        culprit: "breakApp(index)",
        level: "error" as const,
        status: "unresolved",
        firstSeen: "2026-05-03T06:05:43.357Z",
        lastSeen: "2026-05-03T06:05:43.000Z",
        count: 1,
        userCount: 0,
        permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-1",
      },
    ]

    return NextResponse.json({ 
      issues, 
      org,
      total: issues.length,
      hasMore: false 
    })
  } catch (error) {
    console.error("[Sentry API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch issues from Sentry" },
      { status: 500 }
    )
  }
}
