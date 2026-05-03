"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles } from "lucide-react"

interface LogsViewerProps {
  logs: string[]
  deploymentName: string | null
  onFixWithAI: () => void
  isLoading?: boolean
}

function isErrorLine(line: string): boolean {
  const errorPatterns = [
    /error/i,
    /failed/i,
    /exception/i,
    /fatal/i,
    /cannot/i,
    /unable/i,
  ]
  return errorPatterns.some((pattern) => pattern.test(line))
}

export function LogsViewer({
  logs,
  deploymentName,
  onFixWithAI,
  isLoading = false,
}: LogsViewerProps) {
  const hasErrors = logs.some(isErrorLine)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Logs</h2>
          {deploymentName && (
            <p className="text-xs text-muted-foreground">{deploymentName}</p>
          )}
        </div>
        {hasErrors && (
          <Button
            onClick={onFixWithAI}
            disabled={isLoading}
            size="sm"
            className="gap-2"
          >
            <Sparkles className="size-4" />
            {isLoading ? "Analyzing..." : "Fix with AI"}
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        {logs.length > 0 ? (
          <div className="p-4">
            <pre className="font-mono text-xs leading-relaxed">
              {logs.map((line, index) => (
                <div
                  key={index}
                  className={
                    isErrorLine(line)
                      ? "rounded bg-destructive/10 px-2 py-0.5 text-destructive"
                      : "px-2 py-0.5 text-muted-foreground"
                  }
                >
                  <span className="mr-3 inline-block w-6 text-right text-muted-foreground/50">
                    {index + 1}
                  </span>
                  {line}
                </div>
              ))}
            </pre>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">
              Select a deployment to view logs
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
