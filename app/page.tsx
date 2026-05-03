"use client"

import { useState, useEffect, useCallback } from "react"
import {
  SentryIssuesList,
  type SentryIssue,
} from "@/components/dashboard/sentry-issues-list"
import { LogsViewer, type IssueDetails } from "@/components/dashboard/logs-viewer"
import { AIAssistantPanel } from "@/components/dashboard/ai-assistant-panel"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

// Sentry organization config
const SENTRY_ORG = "tcs-goh"

export default function DashboardPage() {
  const [issues, setIssues] = useState<SentryIssue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<SentryIssue | null>(null)
  const [issueDetails, setIssueDetails] = useState<IssueDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [aiContent, setAiContent] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchIssues = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch(`/api/sentry/issues?org=${SENTRY_ORG}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch issues: ${response.status}`)
      }

      const data = await response.json()
      setIssues(data.issues || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch issues")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  const handleSelectIssue = async (issue: SentryIssue) => {
    setSelectedIssue(issue)
    setAiContent(null)
    setIsLoadingDetails(true)

    try {
      // Fetch detailed issue data
      const response = await fetch(
        `/api/sentry/issue-details?org=${SENTRY_ORG}&issueId=${issue.shortId}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch issue details")
      }

      const data = await response.json()
      setIssueDetails(data.details)
    } catch (err) {
      // Fallback to basic issue data if details fetch fails
      setIssueDetails({
        title: issue.title,
        shortId: issue.shortId,
        culprit: issue.culprit,
        level: issue.level,
        platform: "unknown",
        environment: "production",
        firstSeen: issue.firstSeen,
        lastSeen: issue.lastSeen,
        count: issue.count,
        userCount: issue.userCount,
        stackTrace: "",
        tags: {},
        context: {},
        permalink: issue.permalink,
      })
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleFixWithAI = async () => {
    if (!issueDetails) return

    setIsAiLoading(true)
    setAiContent(null)

    try {
      const response = await fetch("/api/analyze-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueData: {
            title: issueDetails.title,
            culprit: issueDetails.culprit,
            level: issueDetails.level,
            platform: issueDetails.platform,
            environment: issueDetails.environment,
            stackTrace: issueDetails.stackTrace,
            tags: Object.entries(issueDetails.tags)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n"),
            context: JSON.stringify(issueDetails.context, null, 2),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("AI analysis failed")
      }

      const data = await response.json()
      setAiContent(data.analysis)
    } catch (err) {
      setAiContent(
        "Error:\nFailed to analyze the error.\n\nCause:\nThe AI service may be temporarily unavailable.\n\nFix:\n1. Check your network connection\n2. Try again in a few moments\n\nPrevention:\nEnsure stable connectivity to AI services."
      )
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground">
            <span className="text-sm font-bold text-background">D</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            DevOps Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {SENTRY_ORG}
          </span>
          <button
            onClick={() => fetchIssues(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
            Refresh
          </button>
        </div>
      </header>

      {/* Main Content - 3 Panel Layout */}
      <div className="grid flex-1 grid-cols-[280px_1fr_320px] overflow-hidden">
        {/* Left Panel - Sentry Issues List */}
        <div className="border-r border-border">
          <SentryIssuesList
            issues={issues}
            selectedId={selectedIssue?.id ?? null}
            onSelect={handleSelectIssue}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Center Panel - Issue Details */}
        <div className="border-r border-border">
          <LogsViewer
            issueDetails={issueDetails}
            isLoading={isLoadingDetails}
            onFixWithAI={handleFixWithAI}
            isAnalyzing={isAiLoading}
          />
        </div>

        {/* Right Panel - AI Assistant */}
        <div>
          <AIAssistantPanel content={aiContent} isLoading={isAiLoading} />
        </div>
      </div>
    </div>
  )
}
