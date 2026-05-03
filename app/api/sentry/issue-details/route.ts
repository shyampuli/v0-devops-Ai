import { NextResponse } from "next/server"

// This endpoint returns detailed Sentry issue data including stack traces
// The data below is fetched via Sentry MCP (get_sentry_resource) during development
// In production, you would use the Sentry SDK or API directly

// Cached issue details from Sentry MCP - all 6 issues
const issueDetailsCache: Record<string, unknown> = {
  "DEVOPS-AI-DEMO-6": {
    title: "Error: Memory usage exceeded safe limit",
    shortId: "DEVOPS-AI-DEMO-6",
    culprit: "?(index)",
    level: "error",
    platform: "node",
    environment: "production",
    firstSeen: "2026-05-03T06:22:13.733Z",
    lastSeen: "2026-05-03T06:22:13.000Z",
    count: 1,
    userCount: 0,
    stackTrace: `Error: Memory usage exceeded safe limit

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:39:9
→ throw new Error("Memory usage exceeded safe limit");

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:34:1 (Object.?)
  captureError(() => {

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:10:5 (captureError)
  fn();

at Object..js (node:internal/modules/cjs/loader:1961:10)
at Module._compile (node:internal/modules/cjs/loader:1830:14)
at Module.load (node:internal/modules/cjs/loader:1553:32)
at Module._load (node:internal/modules/cjs/loader:1355:12)
at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
at <unknown> (node:internal/main/run_main_module:33:47)`,
    tags: {
      environment: "production",
      handled: "yes",
      level: "error",
      mechanism: "generic",
      "os.name": "Windows",
      "runtime.name": "node",
      runtime: "node v24.15.0",
      server_name: "LAPTOP-5AI3N8NC",
    },
    context: {
      device: {
        arch: "x64",
        memory_size: 16641941504,
        processor_count: 18,
        cpu_description: "Intel(R) Core(TM) Ultra 5 125H",
      },
      os: {
        name: "Windows",
        version: "10.0.26200",
      },
      runtime: {
        name: "node",
        version: "v24.15.0",
      },
      app: {
        app_memory: 106000384,
        free_memory: 1943805952,
      },
      user: {
        geo: "IN, Hyderabad, India",
      },
    },
    permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-6",
  },
  "DEVOPS-AI-DEMO-5": {
    title: "Error: API request timeout after 5000ms",
    shortId: "DEVOPS-AI-DEMO-5",
    culprit: "?(index)",
    level: "error",
    platform: "node",
    environment: "production",
    firstSeen: "2026-05-03T06:22:00.000Z",
    lastSeen: "2026-05-03T06:22:00.000Z",
    count: 1,
    userCount: 0,
    stackTrace: `Error: API request timeout after 5000ms

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:25:9
→ throw new Error("API request timeout after 5000ms");

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:22:1 (Object.?)
  captureError(() => {

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:10:5 (captureError)
  fn();

at Object..js (node:internal/modules/cjs/loader:1961:10)
at Module._compile (node:internal/modules/cjs/loader:1830:14)
at Module.load (node:internal/modules/cjs/loader:1553:32)
at Module._load (node:internal/modules/cjs/loader:1355:12)
at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
at <unknown> (node:internal/main/run_main_module:33:47)`,
    tags: {
      environment: "production",
      handled: "yes",
      level: "error",
      mechanism: "generic",
      "os.name": "Windows",
      "runtime.name": "node",
      runtime: "node v24.15.0",
      server_name: "LAPTOP-5AI3N8NC",
    },
    context: {
      device: {
        arch: "x64",
        memory_size: 16641941504,
        processor_count: 18,
        cpu_description: "Intel(R) Core(TM) Ultra 5 125H",
      },
      os: {
        name: "Windows",
        version: "10.0.26200",
      },
      runtime: {
        name: "node",
        version: "v24.15.0",
      },
      user: {
        geo: "IN, Hyderabad, India",
      },
    },
    permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-5",
  },
  "DEVOPS-AI-DEMO-4": {
    title: "TypeError: Cannot read properties of undefined (reading 'name')",
    shortId: "DEVOPS-AI-DEMO-4",
    culprit: "?(index)",
    level: "error",
    platform: "node",
    environment: "production",
    firstSeen: "2026-05-03T06:22:13.719Z",
    lastSeen: "2026-05-03T06:22:13.000Z",
    count: 1,
    userCount: 0,
    stackTrace: `TypeError: Cannot read properties of undefined (reading 'name')

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:30:20
→ console.log(user.name); // crash

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:28:1 (Object.?)
  captureError(() => {
    let user;

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:10:5 (captureError)
  fn();

at Object..js (node:internal/modules/cjs/loader:1961:10)
at Module._compile (node:internal/modules/cjs/loader:1830:14)
at Module.load (node:internal/modules/cjs/loader:1553:32)
at Module._load (node:internal/modules/cjs/loader:1355:12)
at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
at <unknown> (node:internal/main/run_main_module:33:47)`,
    tags: {
      environment: "production",
      handled: "yes",
      level: "error",
      mechanism: "generic",
      "os.name": "Windows",
      "runtime.name": "node",
      runtime: "node v24.15.0",
      server_name: "LAPTOP-5AI3N8NC",
    },
    context: {
      device: {
        arch: "x64",
        memory_size: 16641941504,
        processor_count: 18,
        cpu_description: "Intel(R) Core(TM) Ultra 5 125H",
      },
      os: {
        name: "Windows",
        version: "10.0.26200",
      },
      runtime: {
        name: "node",
        version: "v24.15.0",
      },
      user: {
        geo: "IN, Hyderabad, India",
      },
    },
    permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-4",
  },
  "DEVOPS-AI-DEMO-3": {
    title: "Error: Payment gateway service unavailable",
    shortId: "DEVOPS-AI-DEMO-3",
    culprit: "?(index)",
    level: "error",
    platform: "node",
    environment: "production",
    firstSeen: "2026-05-03T06:22:13.733Z",
    lastSeen: "2026-05-03T06:22:13.000Z",
    count: 1,
    userCount: 0,
    stackTrace: `Error: Payment gateway service unavailable

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:44:9
→ throw new Error("Payment gateway service unavailable");

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:43:1 (Object.?)
  captureError(() => {

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:10:5 (captureError)
  fn();

at Object..js (node:internal/modules/cjs/loader:1961:10)
at Module._compile (node:internal/modules/cjs/loader:1830:14)
at Module.load (node:internal/modules/cjs/loader:1553:32)
at Module._load (node:internal/modules/cjs/loader:1355:12)
at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
at <unknown> (node:internal/main/run_main_module:33:47)`,
    tags: {
      environment: "production",
      handled: "yes",
      level: "error",
      mechanism: "generic",
      "os.name": "Windows",
      "runtime.name": "node",
      runtime: "node v24.15.0",
      server_name: "LAPTOP-5AI3N8NC",
    },
    context: {
      device: {
        arch: "x64",
        memory_size: 16641941504,
        processor_count: 18,
        cpu_description: "Intel(R) Core(TM) Ultra 5 125H",
      },
      os: {
        name: "Windows",
        version: "10.0.26200",
      },
      runtime: {
        name: "node",
        version: "v24.15.0",
      },
      user: {
        geo: "IN, Bengaluru, India",
      },
    },
    permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-3",
  },
  "DEVOPS-AI-DEMO-2": {
    title: "Error: Database connection failed",
    shortId: "DEVOPS-AI-DEMO-2",
    culprit: "?(index)",
    level: "error",
    platform: "node",
    environment: "production",
    firstSeen: "2026-05-03T06:22:00.000Z",
    lastSeen: "2026-05-03T06:22:00.000Z",
    count: 1,
    userCount: 0,
    stackTrace: `Error: Database connection failed

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:18:9
→ throw new Error("Database connection failed");

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:16:1 (Object.?)
  captureError(() => {

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:10:5 (captureError)
  fn();

at Object..js (node:internal/modules/cjs/loader:1961:10)
at Module._compile (node:internal/modules/cjs/loader:1830:14)
at Module.load (node:internal/modules/cjs/loader:1553:32)
at Module._load (node:internal/modules/cjs/loader:1355:12)
at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
at <unknown> (node:internal/main/run_main_module:33:47)`,
    tags: {
      environment: "production",
      handled: "yes",
      level: "error",
      mechanism: "generic",
      "os.name": "Windows",
      "runtime.name": "node",
      runtime: "node v24.15.0",
      server_name: "LAPTOP-5AI3N8NC",
    },
    context: {
      device: {
        arch: "x64",
        memory_size: 16641941504,
        processor_count: 18,
        cpu_description: "Intel(R) Core(TM) Ultra 5 125H",
      },
      os: {
        name: "Windows",
        version: "10.0.26200",
      },
      runtime: {
        name: "node",
        version: "v24.15.0",
      },
      user: {
        geo: "IN, Hyderabad, India",
      },
    },
    permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-2",
  },
  "DEVOPS-AI-DEMO-1": {
    title: "Error: Database connection failed",
    shortId: "DEVOPS-AI-DEMO-1",
    culprit: "breakApp(index)",
    level: "error",
    platform: "node",
    environment: "production",
    firstSeen: "2026-05-03T06:05:43.357Z",
    lastSeen: "2026-05-03T06:05:43.000Z",
    count: 1,
    userCount: 0,
    stackTrace: `Error: Database connection failed

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:10:9 (breakApp)
→ throw new Error("Database connection failed");

D:\\Learning\\Devops Assistant\\sentry-demo\\index.js:14:3 (Object.?)
  breakApp();

at Object..js (node:internal/modules/cjs/loader:1961:10)
at Module._compile (node:internal/modules/cjs/loader:1830:14)
at Module.load (node:internal/modules/cjs/loader:1553:32)
at Module._load (node:internal/modules/cjs/loader:1355:12)
at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
at <unknown> (node:internal/main/run_main_module:33:47)`,
    tags: {
      environment: "production",
      handled: "yes",
      level: "error",
      mechanism: "generic",
      "os.name": "Windows",
      "runtime.name": "node",
      runtime: "node v24.15.0",
      server_name: "LAPTOP-5AI3N8NC",
    },
    context: {
      device: {
        arch: "x64",
        memory_size: 16641941504,
        processor_count: 18,
        cpu_description: "Intel(R) Core(TM) Ultra 5 125H",
      },
      os: {
        name: "Windows",
        version: "10.0.26200",
      },
      runtime: {
        name: "node",
        version: "v24.15.0",
      },
      user: {
        geo: "IN, Hyderabad, India",
      },
    },
    permalink: "https://tcs-goh.sentry.io/issues/DEVOPS-AI-DEMO-1",
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const org = searchParams.get("org")
  const issueId = searchParams.get("issueId")

  if (!org || !issueId) {
    return NextResponse.json(
      { error: "Organization slug and issue ID are required" },
      { status: 400 }
    )
  }

  try {
    const details = issueDetailsCache[issueId]

    if (!details) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ details, org, issueId })
  } catch (error) {
    console.error("[Sentry API] Error fetching issue details:", error)
    return NextResponse.json(
      { error: "Failed to fetch issue details from Sentry" },
      { status: 500 }
    )
  }
}
