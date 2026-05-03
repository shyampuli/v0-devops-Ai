"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, FileCode, Clock, Tag, Server } from "lucide-react"

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

interface LogsViewerProps {
  issueDetails: IssueDetails | null
  isLoading?: boolean
  onFixWithAI: () => void
  isAnalyzing?: boolean
}

function isErrorLine(line: string): boolean {
  const errorPatterns = [
    /error/i,
    /failed/i,
    /exception/i,
    /fatal/i,
    /throw/i,
    /→/,
  ]
  return errorPatterns.some((pattern) => pattern.test(line))
}

function MetadataItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="size-3.5 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

export function LogsViewer({
  issueDetails,
  isLoading = false,
  onFixWithAI,
  isAnalyzing = false,
}: LogsViewerProps) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium text-foreground">Issue Details</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
            <p className="text-sm">Loading details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!issueDetails) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium text-foreground">Issue Details</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-sm text-muted-foreground">
            Select an issue to view details
          </p>
        </div>
      </div>
    )
  }

  const stackLines = issueDetails.stackTrace
    ? issueDetails.stackTrace.split("\n")
    : []

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Issue Details</h2>
          <p className="text-xs text-muted-foreground">{issueDetails.shortId}</p>
        </div>
        <Button
          onClick={onFixWithAI}
          disabled={isAnalyzing}
          size="sm"
          className="gap-2"
        >
          <Sparkles className="size-4" />
          {isAnalyzing ? "Analyzing..." : "Fix with AI"}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Error Title */}
          <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="font-mono text-sm font-medium text-destructive">
              {issueDetails.title}
            </p>
          </div>

          {/* Metadata */}
          <div className="mb-4 flex flex-wrap gap-4">
            <MetadataItem
              icon={FileCode}
              label="Culprit"
              value={issueDetails.culprit}
            />
            <MetadataItem
              icon={Server}
              label="Platform"
              value={issueDetails.platform}
            />
            <MetadataItem
              icon={Tag}
              label="Environment"
              value={issueDetails.environment}
            />
            <MetadataItem
              icon={Clock}
              label="Events"
              value={String(issueDetails.count)}
            />
          </div>

          {/* Stack Trace */}
          {stackLines.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Stack Trace
              </h3>
              <pre className="font-mono text-xs leading-relaxed">
                {stackLines.map((line, index) => (
                  <div
                    key={index}
                    className={
                      isErrorLine(line)
                        ? "rounded bg-destructive/10 px-2 py-0.5 text-destructive"
                        : "px-2 py-0.5 text-muted-foreground"
                    }
                  >
                    <span className="mr-3 inline-block w-5 text-right text-muted-foreground/50">
                      {index + 1}
                    </span>
                    {line || " "}
                  </div>
                ))}
              </pre>
            </div>
          )}

          {/* Tags */}
          {Object.keys(issueDetails.tags).length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(issueDetails.tags).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs"
                  >
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="ml-1 font-medium text-foreground">
                      {value}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Link to Sentry */}
          <div className="mt-4 pt-3 border-t border-border">
            <a
              href={issueDetails.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              View in Sentry →
            </a>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
