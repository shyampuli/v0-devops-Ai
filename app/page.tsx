"use client"

import { useState, useEffect, useCallback } from "react"
import {
  SentryIssuesList,
  type SentryIssue,
} from "@/components/dashboard/sentry-issues-list"
import { IssueDetailsPanel, type IssueDetails } from "@/components/dashboard/issue-details-panel"
import { AIAnalysisModal } from "@/components/dashboard/ai-analysis-modal"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      const response = await fetch(
        `/api/sentry/issue-details?org=${SENTRY_ORG}&issueId=${issue.shortId}`
      )
      if (!response.ok) throw new Error("Failed to fetch issue details")
      const data = await response.json()
      setIssueDetails(data.details)
    } catch {
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

    // Open modal immediately to show loading state
    setIsModalOpen(true)
    setIsAiLoading(true)
    setAiContent(null)

    // Extract proper source - fix "?(index)" by parsing from stack trace or culprit
    const extractSource = (): string => {
      // Try to get function name from stack trace
      if (issueDetails.stackTrace) {
        // Look for patterns like "at functionName" or "functionName@"
        const functionMatch = issueDetails.stackTrace.match(/(?:at\s+)?(\w+)(?:\s+\(|@)/)
        if (functionMatch && functionMatch[1] && functionMatch[1] !== "Object" && functionMatch[1] !== "Module") {
          return functionMatch[1]
        }
        // Look for file:line pattern like "index.js:42"
        const fileMatch = issueDetails.stackTrace.match(/([a-zA-Z0-9_-]+\.[jt]sx?):?\d*/)
        if (fileMatch && fileMatch[1]) {
          return fileMatch[1]
        }
      }
      // Fall back to culprit, but clean up "?(index)" patterns
      if (issueDetails.culprit) {
        const cleanCulprit = issueDetails.culprit.replace(/\?\(index\)/g, "").trim()
        if (cleanCulprit && cleanCulprit !== "?") {
          return cleanCulprit
        }
      }
      return "Unknown Source"
    }

    // Build flat payload structure
    const errorMessage = issueDetails.title || "Unknown error"
    const stackTrace = issueDetails.stackTrace && issueDetails.stackTrace.trim() 
      ? issueDetails.stackTrace 
      : errorMessage
    const source = extractSource()
    const environment = issueDetails.environment || "production"

    const payload = {
      error: errorMessage,
      stackTrace: stackTrace,
      source: source,
      environment: environment,
    }

    // Debug logging - confirm real data
    console.log("[v0] AI Analysis Request:", {
      errorMessage: payload.error,
      stackTrace: payload.stackTrace.substring(0, 300) + (payload.stackTrace.length > 300 ? "..." : ""),
      source: payload.source,
      environment: payload.environment,
    })

    // Helper function to make the API call
    const callAI = async (): Promise<{ success: boolean; data?: string; error?: string }> => {
      try {
        const response = await fetch("/api/analyze-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          return { 
            success: false, 
            error: errorData.error || `Request failed with status ${response.status}` 
          }
        }

        const data = await response.json()
        if (!data.analysis) {
          return { success: false, error: "Empty response from AI service" }
        }
        return { success: true, data: data.analysis }
      } catch (err) {
        return { 
          success: false, 
          error: err instanceof Error ? err.message : "Network error" 
        }
      }
    }

    // First attempt
    let result = await callAI()

    // Retry once if first attempt fails
    if (!result.success) {
      console.log("[v0] First AI attempt failed, retrying...", result.error)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
      result = await callAI()
    }

    if (result.success && result.data) {
      console.log("[v0] AI Analysis Success - response received")
      setAiContent(result.data)
    } else {
      // Show ACTUAL error message - no generic fallback
      const actualError = result.error || "Unknown error"
      console.error("[v0] AI analysis failed:", actualError)
      // Display the real error, not a fake analysis
      setAiContent(`Error: ${actualError}`)
    }

    setIsAiLoading(false)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-card px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground">
            <span className="text-sm font-semibold text-background">D</span>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              DevOps Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">{SENTRY_ORG}</p>
          </div>
        </div>
        <button
          onClick={() => fetchIssues(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
          Refresh
        </button>
      </header>

      {/* Main Content - 2 Column Layout */}
      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr] divide-x divide-border">
        {/* Left Panel - Issues List (unchanged) */}
        <div className="flex h-full flex-col overflow-hidden bg-card">
          <SentryIssuesList
            issues={issues}
            selectedId={selectedIssue?.id ?? null}
            onSelect={handleSelectIssue}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Right Panel - Issue Details (expanded) */}
        <div className="flex h-full flex-col overflow-hidden bg-card">
          <IssueDetailsPanel
            issueDetails={issueDetails}
            isLoading={isLoadingDetails}
            onFixWithAI={handleFixWithAI}
            isAnalyzing={isAiLoading}
          />
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        content={aiContent}
        isLoading={isAiLoading}
        issueTitle={issueDetails?.title}
        onRetry={handleFixWithAI}
      />
    </div>
  )
}
