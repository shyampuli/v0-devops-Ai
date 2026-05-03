"use client"

import { useState, useEffect, useCallback } from "react"
import {
  SentryIssuesList,
  type SentryIssue,
} from "@/components/dashboard/sentry-issues-list"
import { LogsViewer } from "@/components/dashboard/logs-viewer"
import { AIAssistantPanel } from "@/components/dashboard/ai-assistant-panel"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

// Sentry organization config
const SENTRY_ORG = "tcs-goh"

// Simulated AI responses for different error types
function generateAIResponse(issue: SentryIssue): string {
  const title = issue.title.toLowerCase()
  
  if (title.includes("database") || title.includes("connection")) {
    return `## Issue Detected

**Database Connection Failure**

The error "${issue.title}" indicates a database connectivity issue in \`${issue.culprit}\`.

## Suggested Fix

1. **Check Database Credentials**
   - Verify DATABASE_URL environment variable is set correctly
   - Ensure credentials have not expired or been rotated

2. **Network Configuration**
   - Confirm the database server is accessible from the deployment environment
   - Check if IP allowlisting is required
   - Verify SSL/TLS settings match server requirements

3. **Connection Pool Settings**
   \`\`\`javascript
   // Increase timeout and add retry logic
   const pool = new Pool({
     connectionTimeoutMillis: 60000,
     max: 10,
     idleTimeoutMillis: 30000
   })
   \`\`\`

## Additional Notes
- Check database server status in your cloud provider dashboard
- Consider implementing connection retry logic with exponential backoff
- First seen: ${new Date(issue.firstSeen).toLocaleString()}
- Events: ${issue.count}`
  }

  if (title.includes("module") || title.includes("import") || title.includes("cannot find")) {
    return `## Issue Detected

**Missing Module or Import Error**

The error "${issue.title}" suggests a missing dependency or incorrect import path.

## Suggested Fix

1. **Check package.json**
   - Verify the required package is listed in dependencies
   - Run \`npm install\` or \`yarn install\` to ensure all packages are installed

2. **Update Import Path**
   \`\`\`javascript
   // Check if the module path is correct
   // Common issues: typos, case sensitivity, missing file extensions
   \`\`\`

3. **Clear Cache**
   \`\`\`bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   \`\`\`

## Additional Notes
- Location: \`${issue.culprit}\`
- Events: ${issue.count}
- First seen: ${new Date(issue.firstSeen).toLocaleString()}`
  }

  return `## Issue Analysis

**${issue.title}**

This error was detected in \`${issue.culprit}\`.

## Details

- **Severity**: ${issue.level}
- **Status**: ${issue.status}
- **Events**: ${issue.count}
- **Users Affected**: ${issue.userCount}
- **First Seen**: ${new Date(issue.firstSeen).toLocaleString()}
- **Last Seen**: ${new Date(issue.lastSeen).toLocaleString()}

## Suggested Investigation

1. **Review the stack trace** in Sentry for the exact line causing the error
2. **Check recent deployments** that may have introduced this issue
3. **Review the affected code path** in \`${issue.culprit}\`
4. **Add error handling** to gracefully handle edge cases

## View in Sentry

[Open in Sentry](${issue.permalink})`
}

export default function DashboardPage() {
  const [issues, setIssues] = useState<SentryIssue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<SentryIssue | null>(null)
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
      console.error("[v0] Failed to fetch Sentry issues:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch issues")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  const handleSelectIssue = (issue: SentryIssue) => {
    setSelectedIssue(issue)
    setAiContent(null)
  }

  const handleFixWithAI = async () => {
    if (!selectedIssue) return

    setIsAiLoading(true)
    setAiContent(null)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = generateAIResponse(selectedIssue)
    setAiContent(response)
    setIsAiLoading(false)
  }

  // Generate logs from issue data
  const generateLogsFromIssue = (issue: SentryIssue | null): string[] => {
    if (!issue) return []
    
    return [
      `[${issue.level.toUpperCase()}] ${issue.title}`,
      `Culprit: ${issue.culprit}`,
      `Issue ID: ${issue.shortId}`,
      `Status: ${issue.status}`,
      ``,
      `First seen: ${new Date(issue.firstSeen).toLocaleString()}`,
      `Last seen: ${new Date(issue.lastSeen).toLocaleString()}`,
      `Total events: ${issue.count}`,
      `Users affected: ${issue.userCount}`,
      ``,
      `View in Sentry: ${issue.permalink}`,
    ]
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

        {/* Center Panel - Issue Details / Logs Viewer */}
        <div className="border-r border-border">
          <LogsViewer
            logs={generateLogsFromIssue(selectedIssue)}
            deploymentName={selectedIssue?.shortId ?? null}
            onFixWithAI={handleFixWithAI}
            isLoading={isAiLoading}
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
