# DevOps AI

DevOps AI is an intelligent monitoring and debugging platform built with **Next.js** and **v0**.  
It integrates **Sentry MCP (Model Context Protocol)** to fetch real-time production errors and combines it with AI-powered analysis to help developers quickly identify issues and apply fixes.


## Live App

**Try the app here:**  
[https://your-app.vercel.app](https://devopsai.vercel.app/)

---

## Architecture

```mermaid
flowchart LR
    A[Sentry (Real Errors)] --> B[Sentry MCP Server]
    B --> C[DevOps AI App (Next.js + v0)]
    C --> D[AI Engine (Gemini / LLM)]
    D --> C
    C --> E[User Dashboard UI]

    subgraph User Interaction
        E --> F[Select Issue]
        F --> G[Ask AI]
        G --> D
    end
---

## Key Features

- **Real-time Error Monitoring**  
  Integrated with **Sentry MCP** to fetch live application errors and logs.

- **AI-Powered Analysis**  
  Automatically analyzes errors to provide:
  - Root cause
  - Fix suggestions
  - Prevention strategies

- **Secure Authentication**  
  Google OAuth login for safe and seamless access.

- **Modern UI/UX**  
  Built using v0 with an interactive and responsive interface.

- **Smart Debugging Workflow**  
  Convert complex logs into meaningful, actionable insights.

---

## Built with v0

This repository is connected to a **v0 project**, enabling rapid UI and feature development using natural language prompts.
- Changes made in v0 are automatically pushed to this repository  
- Every merge to `main` triggers automatic deployment  

---

