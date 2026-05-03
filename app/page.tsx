"use client"

import { useState } from "react"
import {
  DeploymentsList,
  type Deployment,
} from "@/components/dashboard/deployments-list"
import { LogsViewer } from "@/components/dashboard/logs-viewer"
import { AIAssistantPanel } from "@/components/dashboard/ai-assistant-panel"

// Sample deployment data
const sampleDeployments: Deployment[] = [
  {
    id: "1",
    name: "production-api-v2.3.1",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    logs: [
      "Starting deployment...",
      "Installing dependencies...",
      "Building application...",
      "Running tests...",
      "All tests passed",
      "Deploying to production...",
      "Deployment successful",
    ],
  },
  {
    id: "2",
    name: "staging-frontend-fix",
    status: "failed",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    logs: [
      "Starting deployment...",
      "Installing dependencies...",
      "Building application...",
      "ERROR: Module not found: Cannot resolve 'react-query'",
      "ERROR: Build failed with exit code 1",
      "Failed to compile",
      "Deployment failed",
    ],
  },
  {
    id: "3",
    name: "backend-hotfix-auth",
    status: "failed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    logs: [
      "Starting deployment...",
      "Installing dependencies...",
      "Building application...",
      "Running tests...",
      "FATAL: Connection to database failed",
      "ERROR: Unable to establish connection to PostgreSQL",
      "Exception: TimeoutError after 30000ms",
      "Deployment aborted",
    ],
  },
  {
    id: "4",
    name: "docs-update-v1.2",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    logs: [
      "Starting deployment...",
      "Building documentation...",
      "Generating static pages...",
      "Optimizing images...",
      "Deployment successful",
    ],
  },
  {
    id: "5",
    name: "api-rate-limiting",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    logs: [
      "Starting deployment...",
      "Installing dependencies...",
      "Building application...",
      "Running integration tests...",
      "All 47 tests passed",
      "Deploying to production...",
      "Health check passed",
      "Deployment successful",
    ],
  },
]

// Simulated AI responses for different error types
const aiResponses: Record<string, string> = {
  "2": `## Issue Detected

**Missing Dependency: react-query**

The build failed because the 'react-query' package is not installed or not properly listed in your dependencies.

## Suggested Fix

1. Install the package:
   \`\`\`bash
   npm install @tanstack/react-query
   \`\`\`

2. Update your imports (react-query was renamed to @tanstack/react-query):
   \`\`\`javascript
   // Before
   import { useQuery } from 'react-query'
   
   // After
   import { useQuery } from '@tanstack/react-query'
   \`\`\`

3. Ensure it's listed in package.json dependencies

## Additional Notes
- The package was renamed in v4. Make sure to update all imports across your codebase.
- Consider running \`npm ls react-query\` to check for version conflicts.`,

  "3": `## Issue Detected

**Database Connection Failure**

The deployment failed because the application couldn't establish a connection to the PostgreSQL database within the timeout period.

## Suggested Fix

1. **Check Database Credentials**
   - Verify DATABASE_URL environment variable is set correctly
   - Ensure credentials have not expired or been rotated

2. **Network Configuration**
   - Confirm the database server is accessible from the deployment environment
   - Check if IP allowlisting is required
   - Verify SSL/TLS settings match server requirements

3. **Connection Pool Settings**
   \`\`\`javascript
   // Increase timeout and add retry logic
   const pool = new Pool({
     connectionTimeoutMillis: 60000,
     max: 10,
     idleTimeoutMillis: 30000
   })
   \`\`\`

## Additional Notes
- Check database server status in your cloud provider dashboard
- Consider implementing connection retry logic with exponential backoff`,
}

export default function DashboardPage() {
  const [selectedDeployment, setSelectedDeployment] =
    useState<Deployment | null>(null)
  const [aiContent, setAiContent] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const handleSelectDeployment = (deployment: Deployment) => {
    setSelectedDeployment(deployment)
    setAiContent(null)
  }

  const handleFixWithAI = async () => {
    if (!selectedDeployment) return

    setIsAiLoading(true)
    setAiContent(null)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response =
      aiResponses[selectedDeployment.id] ||
      `## Analysis Complete

No specific fix suggestions available for this deployment. 

Please review the error logs manually or contact the DevOps team for assistance.`

    setAiContent(response)
    setIsAiLoading(false)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground">
            <span className="text-sm font-bold text-background">D</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            DevOps Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {sampleDeployments.length} deployments
          </span>
        </div>
      </header>

      {/* Main Content - 3 Panel Layout */}
      <div className="grid flex-1 grid-cols-[280px_1fr_320px] overflow-hidden">
        {/* Left Panel - Deployments List */}
        <div className="border-r border-border">
          <DeploymentsList
            deployments={sampleDeployments}
            selectedId={selectedDeployment?.id ?? null}
            onSelect={handleSelectDeployment}
          />
        </div>

        {/* Center Panel - Logs Viewer */}
        <div className="border-r border-border">
          <LogsViewer
            logs={selectedDeployment?.logs ?? []}
            deploymentName={selectedDeployment?.name ?? null}
            onFixWithAI={handleFixWithAI}
            isLoading={isAiLoading}
          />
        </div>

        {/* Right Panel - AI Assistant */}
        <div>
          <AIAssistantPanel content={aiContent} isLoading={isAiLoading} />
        </div>
      </div>
    </div>
  )
}
