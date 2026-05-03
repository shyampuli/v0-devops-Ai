"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, AlertTriangle, Bug } from "lucide-react"

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

  if (time === null) return <span className="invisible">loading</span>
  return <>{time}</>
}

function SeverityIndicator({ level }: { level: SentryIssue["level"] }) {
  const config = {
    fatal: { color: "bg-red-500", icon: AlertCircle },
    error: { color: "bg-orange-500", icon: Bug },
    warning: { color: "bg-amber-400", icon: AlertTriangle },
    info: { color: "bg-blue-400", icon: AlertCircle },
  }
  const { color, icon: Icon } = config[level] || config.error

  return (
    <div className="relative flex items-center justify-center">
      <div className={cn("size-2 rounded-full", color)} />
      <Icon className="ml-2 size-4 text-muted-foreground" />
    </div>
  )
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
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold text-foreground">Issues</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold text-foreground">Issues</h2>
        </div>
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Unable to load</p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (issues.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold text-foreground">Issues</h2>
        </div>
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
              <Bug className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">All clear</p>
            <p className="mt-1 text-xs text-muted-foreground">No unresolved issues</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-sm font-semibold text-foreground">Issues</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {issues.length}
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-1 px-3 pb-4">
          {issues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => onSelect(issue)}
              className={cn(
                "w-full rounded-xl px-3 py-3 text-left transition-colors",
                selectedId === issue.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5",
                  selectedId === issue.id && "opacity-80"
                )}>
                  <SeverityIndicator level={issue.level} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    "truncate text-sm font-medium",
                    selectedId === issue.id ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {issue.title}
                  </p>
                  <p className={cn(
                    "mt-0.5 truncate text-xs",
                    selectedId === issue.id ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {issue.culprit}
                  </p>
                  <div className={cn(
                    "mt-2 flex items-center gap-3 text-xs",
                    selectedId === issue.id ? "text-primary-foreground/60" : "text-muted-foreground"
                  )}>
                    <span><RelativeTime dateString={issue.lastSeen} /></span>
                    <span className="flex items-center gap-1">
                      <span className={cn(
                        "size-1 rounded-full",
                        selectedId === issue.id ? "bg-primary-foreground/40" : "bg-muted-foreground/40"
                      )} />
                      {issue.count} events
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
