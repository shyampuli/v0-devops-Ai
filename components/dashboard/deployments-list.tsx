"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"

export interface Deployment {
  id: string
  name: string
  status: "success" | "failed"
  timestamp: Date
  logs: string[]
}

interface DeploymentsListProps {
  deployments: Deployment[]
  selectedId: string | null
  onSelect: (deployment: Deployment) => void
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export function DeploymentsList({
  deployments,
  selectedId,
  onSelect,
}: DeploymentsListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">Deployments</h2>
      </div>
      <div className="flex-1 overflow-auto">
        {deployments.map((deployment) => (
          <button
            key={deployment.id}
            onClick={() => onSelect(deployment)}
            className={cn(
              "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50",
              selectedId === deployment.id && "bg-muted"
            )}
          >
            {deployment.status === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            ) : (
              <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {deployment.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {getRelativeTime(deployment.timestamp)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
