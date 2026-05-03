"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, AlertCircle, Wrench, Shield, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIAssistantPanelProps {
  content: string | null
  isLoading?: boolean
}

interface ParsedAnalysis {
  error: string
  cause: string
  fix: string
  prevention: string
}

function parseAnalysis(content: string): ParsedAnalysis | null {
  const sections: ParsedAnalysis = {
    error: "",
    cause: "",
    fix: "",
    prevention: "",
  }

  // Match each section using regex
  const errorMatch = content.match(/Error:\s*([\s\S]*?)(?=Cause:|$)/i)
  const causeMatch = content.match(/Cause:\s*([\s\S]*?)(?=Fix:|$)/i)
  const fixMatch = content.match(/Fix:\s*([\s\S]*?)(?=Prevention:|$)/i)
  const preventionMatch = content.match(/Prevention:\s*([\s\S]*?)$/i)

  if (errorMatch) sections.error = errorMatch[1].trim()
  if (causeMatch) sections.cause = causeMatch[1].trim()
  if (fixMatch) sections.fix = fixMatch[1].trim()
  if (preventionMatch) sections.prevention = preventionMatch[1].trim()

  // Return null if no sections were parsed
  if (!sections.error && !sections.cause && !sections.fix && !sections.prevention) {
    return null
  }

  return sections
}

function AnalysisSection({
  icon: Icon,
  title,
  content,
  variant = "default",
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  content: string
  variant?: "error" | "warning" | "success" | "default"
}) {
  const variantStyles = {
    error: "border-red-500/20 bg-red-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
    success: "border-emerald-500/20 bg-emerald-500/5",
    default: "border-border bg-muted/30",
  }

  const iconStyles = {
    error: "text-red-500",
    warning: "text-amber-500",
    success: "text-emerald-500",
    default: "text-muted-foreground",
  }

  return (
    <div className={cn("rounded-lg border p-3", variantStyles[variant])}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className={cn("size-4", iconStyles[variant])} />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      </div>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {content}
      </div>
    </div>
  )
}

export function AIAssistantPanel({
  content,
  isLoading = false,
}: AIAssistantPanelProps) {
  const parsed = content ? parseAnalysis(content) : null

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
                Analyzing error...
              </p>
            </div>
          </div>
        ) : parsed ? (
          <div className="flex flex-col gap-3 p-4">
            {parsed.error && (
              <AnalysisSection
                icon={AlertCircle}
                title="Error"
                content={parsed.error}
                variant="error"
              />
            )}
            {parsed.cause && (
              <AnalysisSection
                icon={Search}
                title="Cause"
                content={parsed.cause}
                variant="warning"
              />
            )}
            {parsed.fix && (
              <AnalysisSection
                icon={Wrench}
                title="Fix"
                content={parsed.fix}
                variant="success"
              />
            )}
            {parsed.prevention && (
              <AnalysisSection
                icon={Shield}
                title="Prevention"
                content={parsed.prevention}
                variant="default"
              />
            )}
          </div>
        ) : content ? (
          // Fallback for non-structured content
          <div className="p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {content}
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
              Click &quot;Fix with AI&quot; on an error to get analysis
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
