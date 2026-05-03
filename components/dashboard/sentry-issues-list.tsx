"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, AlertTriangle, Bug, Loader2 } from "lucide-react"

export interface SentryIssue {
  id: string
  shortId: string
  title: string
  culprit: string
  level: "fatal" | "error" | "warning" | "info"
  status: string
  firstSeen: string
  lastSeen: string
  count: number
  userCount: number
  permalink: string
}

interface SentryIssuesListProps {
  issues: SentryIssue[]
  selectedId: string | null
  onSelect: (issue: SentryIssue) => void
  isLoading: boolean
  error: string | null
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

function RelativeTime({ dateString }: { dateString: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    setTime(getRelativeTime(dateString))
    const interval = setInterval(() => {
      setTime(getRelativeTime(dateString))
    }, 60000)
    return () => clearInterval(interval)
  }, [dateString])

  if (time === null) {
    return <span className="invisible">loading</span>
  }

  return <>{time}</>
}

function SeverityBadge({ level }: { level: SentryIssue["level"] }) {
  const config = {
    fatal: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      label: "Fatal",
    },
    error: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      label: "Error",
    },
    warning: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      label: "Warning",
    },
    info: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      label: "Info",
    },
  }

  const { bg, text, label } = config[level] || config.error

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase",
        bg,
        text
      )}
    >
      {label}
    </span>
  )
}

function SeverityIcon({ level }: { level: SentryIssue["level"] }) {
  switch (level) {
    case "fatal":
      return <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
    case "error":
      return <Bug className="mt-0.5 size-4 shrink-0 text-destructive" />
    case "warning":
      return (
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
      )
    default:
      return <AlertCircle className="mt-0.5 size-4 shrink-0 text-blue-500" />
  }
}

export function SentryIssuesList({
  issues,
  selectedId,
  onSelect,
  isLoading,
  error,
}: SentryIssuesListProps) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium text-foreground">Sentry Issues</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <p className="text-sm">Loading issues...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium text-foreground">Sentry Issues</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm font-medium">Failed to load issues</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (issues.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium text-foreground">Sentry Issues</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <Bug className="size-8" />
            <p className="text-sm font-medium">No issues found</p>
            <p className="text-xs">All clear! No unresolved errors.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">Sentry Issues</h2>
        <span className="text-xs text-muted-foreground">
          {issues.length} issue{issues.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        {issues.map((issue) => (
          <button
            key={issue.id}
            onClick={() => onSelect(issue)}
            className={cn(
              "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50",
              selectedId === issue.id && "bg-muted"
            )}
          >
            <SeverityIcon level={issue.level} />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <SeverityBadge level={issue.level} />
                <span className="text-[10px] text-muted-foreground">
                  {issue.shortId}
                </span>
              </div>
              <p className="truncate text-sm font-medium text-foreground">
                {issue.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {issue.culprit}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  <RelativeTime dateString={issue.lastSeen} />
                </span>
                <span>{issue.count} event{issue.count !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
