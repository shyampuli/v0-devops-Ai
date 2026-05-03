"use client"

import { useState, useEffect, useCallback } from "react"
import {
  SentryIssuesList,
  type SentryIssue,
} from "@/components/dashboard/sentry-issues-list"
import { IssueDetailsPanel, type IssueDetails } from "@/components/dashboard/issue-details-panel"
import { AIAnalysisModal } from "@/components/dashboard/ai-analysis-modal"
import { Navbar } from "@/components/dashboard/navbar"
import { LandingView } from "@/components/dashboard/landing-view"
import { LoginPage } from "@/components/auth/login-page"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const SENTRY_ORG = "tcs-goh"

interface User {
  email: string
  name: string
  provider?: string
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing")
  const [issues, setIssues] = useState<SentryIssue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<SentryIssue | null>(null)
  const [issueDetails, setIssueDetails] = useState<IssueDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [aiContent, setAiContent] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("devops-auth")
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        if (authData.isAuthenticated && authData.user) {
          setIsAuthenticated(true)
          setUser(authData.user)
        }
      } catch {
        localStorage.removeItem("devops-auth")
      }
    }
    setIsCheckingAuth(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("devops-auth", JSON.stringify({
      isAuthenticated: true,
      user: userData
    }))
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setUser(null)
    setCurrentView("landing")
    setSelectedIssue(null)
    setIssueDetails(null)
    setAiContent(null)
    setIssues([])
    localStorage.removeItem("devops-auth")
  }

  const handleNavigateHome = () => {
    setCurrentView("landing")
    setSelectedIssue(null)
    setIssueDetails(null)
    setAiContent(null)
  }

  const handleViewErrors = () => {
    setCurrentView("dashboard")
    if (issues.length === 0) {
      fetchIssues()
    }
  }

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

    setIsModalOpen(true)
    setIsAiLoading(true)
    setAiContent(null)

    const extractSource = (): string => {
      if (issueDetails.stackTrace) {
        const functionMatch = issueDetails.stackTrace.match(/(?:at\s+)?(\w+)(?:\s+\(|@)/)
        if (functionMatch && functionMatch[1] && functionMatch[1] !== "Object" && functionMatch[1] !== "Module") {
          return functionMatch[1]
        }
        const fileMatch = issueDetails.stackTrace.match(/([a-zA-Z0-9_-]+\.[jt]sx?):?\d*/)
        if (fileMatch && fileMatch[1]) {
          return fileMatch[1]
        }
      }
      if (issueDetails.culprit) {
        const cleanCulprit = issueDetails.culprit.replace(/\?\(index\)/g, "").trim()
        if (cleanCulprit && cleanCulprit !== "?") {
          return cleanCulprit
        }
      }
      return "Unknown Source"
    }

    const errorMessage = issueDetails.title || "Unknown error"
    const stackTrace = issueDetails.stackTrace?.trim() || errorMessage
    const source = extractSource()
    const environment = issueDetails.environment || "production"

    const payload = {
      error: errorMessage,
      stackTrace: stackTrace,
      source: source,
      environment: environment,
    }

    const callAI = async (): Promise<{ success: boolean; data?: string; error?: string }> => {
      try {
        const response = await fetch("/api/ai", {
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

    let result = await callAI()

    if (!result.success) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      result = await callAI()
    }

    if (result.success && result.data) {
      setAiContent(result.data)
    } else {
      const actualError = result.error || "Unknown error"
      setAiContent(`Error: ${actualError}`)
    }

    setIsAiLoading(false)
  }

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Authenticated - show main app
  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      {currentView === "landing" ? (
        <LandingView onViewErrors={handleViewErrors} />
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          {/* Dashboard Header */}
          <header className="flex shrink-0 items-center justify-between border-b border-border bg-card px-8 py-5">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-base font-semibold tracking-tight text-foreground">
                  Error Dashboard
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

          {/* 2 Column Layout */}
          <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr] divide-x divide-border">
            <div className="flex h-full flex-col overflow-hidden bg-card">
              <SentryIssuesList
                issues={issues}
                selectedId={selectedIssue?.id ?? null}
                onSelect={handleSelectIssue}
                isLoading={isLoading}
                error={error}
              />
            </div>

            <div className="flex h-full flex-col overflow-hidden bg-card">
              <IssueDetailsPanel
                issueDetails={issueDetails}
                isLoading={isLoadingDetails}
                onFixWithAI={handleFixWithAI}
                isAnalyzing={isAiLoading}
              />
            </div>
          </div>
        </div>
      )}

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
