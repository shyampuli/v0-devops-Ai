"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, FileCode, Server, Tag, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export interface IssueDetails {
  title: string
  shortId: string
  culprit: string
  level: string
  platform: string
  environment: string
  firstSeen: string
  lastSeen: string
  count: number
  userCount: number
  stackTrace: string
  tags: Record<string, string>
  context: Record<string, unknown>
  permalink: string
}

interface IssueDetailsPanelProps {
  issueDetails: IssueDetails | null
  isLoading?: boolean
  onFixWithAI: () => void
  isAnalyzing?: boolean
}

function isErrorLine(line: string): boolean {
  const errorPatterns = [/error/i, /failed/i, /exception/i, /throw/i, /→/]
  return errorPatterns.some((pattern) => pattern.test(line))
}

export function IssueDetailsPanel({
  issueDetails,
  isLoading = false,
  onFixWithAI,
  isAnalyzing = false,
}: IssueDetailsPanelProps) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold text-foreground">Details</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
            <p className="text-sm text-muted-foreground">Loading details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!issueDetails) {
    return (
      <div className="flex h-full flex-col">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold text-foreground">Details</h2>
        </div>
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
              <FileCode className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Select an issue</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose an issue from the list to view details
            </p>
          </div>
        </div>
      </div>
    )
  }

  const stackLines = issueDetails.stackTrace
    ? issueDetails.stackTrace.split("\n")
    : []

  return (
    <div className="flex h-full flex-col">
      {/* Header with Fix with AI button */}
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Details</h2>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {issueDetails.shortId}
            </span>
          </div>
        </div>
        
        {/* Primary Fix with AI Button - Always Visible */}
        <button
          onClick={onFixWithAI}
          disabled={isAnalyzing}
          className={cn(
            "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
            "bg-foreground text-background",
            "hover:opacity-90 active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Sparkles className={cn("size-4", isAnalyzing && "animate-pulse")} />
          {isAnalyzing ? "Analyzing..." : "Fix with AI"}
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 px-6 pb-8">
          {/* Error Title Card */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <p className="font-mono text-sm font-medium leading-relaxed text-orange-900">
              {issueDetails.title}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetadataCard
              icon={FileCode}
              label="Source"
              value={issueDetails.culprit}
            />
            <MetadataCard
              icon={Server}
              label="Platform"
              value={issueDetails.platform}
            />
            <MetadataCard
              icon={Tag}
              label="Environment"
              value={issueDetails.environment}
            />
            <MetadataCard
              icon={Tag}
              label="Events"
              value={`${issueDetails.count} occurrences`}
            />
          </div>

          {/* Stack Trace */}
          {stackLines.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Stack Trace
              </h3>
              <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
                  {stackLines.map((line, index) => (
                    <div
                      key={index}
                      className={cn(
                        "px-2 py-0.5",
                        isErrorLine(line)
                          ? "rounded bg-orange-100 text-orange-800"
                          : "text-muted-foreground"
                      )}
                    >
                      <span className="mr-4 inline-block w-5 text-right opacity-40">
                        {index + 1}
                      </span>
                      {line || " "}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          )}

          {/* Tags */}
          {Object.keys(issueDetails.tags).length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(issueDetails.tags).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center rounded-lg bg-muted px-3 py-1.5 text-xs"
                  >
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="ml-1 font-medium text-foreground">{value}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* View in Sentry Link */}
          <a
            href={issueDetails.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View in Sentry
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </ScrollArea>
    </div>
  )
}

function MetadataCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1.5 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}
