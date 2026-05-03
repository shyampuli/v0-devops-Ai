"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sparkles, AlertCircle, Search, Wrench, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIAnalysisModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string | null
  isLoading: boolean
  issueTitle?: string
  onRetry?: () => void
}

interface ParsedAnalysis {
  problem: string
  cause: string
  fix: string
  prevention: string
}

function parseAnalysis(content: string): ParsedAnalysis | null {
  const sections: ParsedAnalysis = {
    problem: "",
    cause: "",
    fix: "",
    prevention: "",
  }

  const problemMatch = content.match(/(?:Problem|Error):\s*([\s\S]*?)(?=Cause:|$)/i)
  const causeMatch = content.match(/Cause:\s*([\s\S]*?)(?=Fix:|$)/i)
  const fixMatch = content.match(/Fix:\s*([\s\S]*?)(?=Prevention:|$)/i)
  const preventionMatch = content.match(/Prevention:\s*([\s\S]*?)$/i)

  if (problemMatch) sections.problem = problemMatch[1].trim()
  if (causeMatch) sections.cause = causeMatch[1].trim()
  if (fixMatch) sections.fix = fixMatch[1].trim()
  if (preventionMatch) sections.prevention = preventionMatch[1].trim()

  if (!sections.problem && !sections.cause && !sections.fix && !sections.prevention) {
    return null
  }

  return sections
}

function AnalysisSection({
  icon: Icon,
  title,
  content,
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  content: string
  variant: "problem" | "cause" | "fix" | "prevention"
}) {
  const styles = {
    problem: {
      bg: "bg-red-50",
      border: "border-red-100",
      icon: "text-red-500",
      title: "text-red-900",
    },
    cause: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: "text-amber-600",
      title: "text-amber-900",
    },
    fix: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: "text-emerald-600",
      title: "text-emerald-900",
    },
    prevention: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: "text-blue-500",
      title: "text-blue-900",
    },
  }

  const style = styles[variant]

  return (
    <div className={cn("rounded-xl border p-5", style.bg, style.border)}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("size-4 shrink-0", style.icon)} />
        <h3 className={cn("text-sm font-semibold", style.title)}>{title}</h3>
      </div>
      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
        {content}
      </div>
    </div>
  )
}

export function AIAnalysisModal({
  open,
  onOpenChange,
  content,
  isLoading,
  issueTitle,
  onRetry,
}: AIAnalysisModalProps) {
  const parsed = content ? parseAnalysis(content) : null
  const isError = content?.startsWith("Problem:\nAI analysis failed")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-foreground">
              <Sparkles className="size-5 text-background" />
            </div>
            <div>
              <DialogTitle className="text-base">AI Analysis</DialogTitle>
              {issueTitle && (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {issueTitle}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(85vh-80px)] overflow-auto px-6 py-6">
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
                </div>
                <p className="text-base font-medium text-foreground">
                  Analyzing error...
                </p>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  Performing deep analysis of stack trace, identifying root cause, and generating actionable fixes
                </p>
              </div>
            </div>
          ) : parsed ? (
            <div className="space-y-4">
              {parsed.problem && (
                <AnalysisSection
                  icon={AlertCircle}
                  title="Problem"
                  content={parsed.problem}
                  variant="problem"
                />
              )}
              {parsed.cause && (
                <AnalysisSection
                  icon={Search}
                  title="Root Cause"
                  content={parsed.cause}
                  variant="cause"
                />
              )}
              {parsed.fix && (
                <AnalysisSection
                  icon={Wrench}
                  title="Fix"
                  content={parsed.fix}
                  variant="fix"
                />
              )}
              {parsed.prevention && (
                <AnalysisSection
                  icon={Shield}
                  title="Prevention"
                  content={parsed.prevention}
                  variant="prevention"
                />
              )}
            </div>
          ) : content ? (
            <div className="space-y-4">
              <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                {content}
              </div>
              {isError && onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90"
                >
                  <Sparkles className="size-4" />
                  Retry Analysis
                </button>
              )}
            </div>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No analysis available
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
