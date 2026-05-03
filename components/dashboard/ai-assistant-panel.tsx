"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles } from "lucide-react"

interface AIAssistantPanelProps {
  content: string | null
  isLoading?: boolean
}

export function AIAssistantPanel({
  content,
  isLoading = false,
}: AIAssistantPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Sparkles className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-foreground">AI Assistant</h2>
      </div>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
              <p className="text-sm text-muted-foreground">
                Analyzing logs...
              </p>
            </div>
          </div>
        ) : content ? (
          <div className="p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {content}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <Sparkles className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              AI Assistant Ready
            </p>
            <p className="text-xs text-muted-foreground">
              Click &quot;Fix with AI&quot; on a failed deployment to get
              suggestions
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
