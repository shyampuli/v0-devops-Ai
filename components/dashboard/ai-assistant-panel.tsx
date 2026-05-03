"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, AlertCircle, Search, Wrench, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIAssistantPanelProps {
  content: string | null
  isLoading?: boolean
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

  // Match sections - support both "Problem:" and "Error:" formats
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
    },
    cause: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: "text-amber-500",
    },
    fix: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: "text-emerald-500",
    },
    prevention: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: "text-blue-500",
    },
  }

  const style = styles[variant]

  return (
    <div className={cn("rounded-2xl border p-5", style.bg, style.border)}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("size-4", style.icon)} />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-5">
        <Sparkles className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex h-[calc(100%-80px)] items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted">
                <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Analyzing...</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Finding the root cause and solution
              </p>
            </div>
          </div>
        ) : parsed ? (
          <div className="space-y-4 px-6 pb-8">
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
                title="Cause"
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
          <div className="px-6 pb-8">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {content}
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100%-80px)] items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                <Sparkles className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Ready to help</p>
              <p className="mt-1 max-w-[200px] text-xs leading-relaxed text-muted-foreground">
                Select an issue and click &quot;Fix with AI&quot; to analyze
              </p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
