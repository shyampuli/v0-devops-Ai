"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Clock, Code, GitBranch } from "lucide-react"

// Dynamically import DarkVeil to avoid SSR issues with OGL
const DarkVeil = dynamic(() => import("@/components/effects/dark-veil"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
})

interface LandingViewProps {
  onViewErrors: () => void
}

export function LandingView({ onViewErrors }: LandingViewProps) {
  return (
    <div className="relative min-h-screen overflow-y-auto bg-black">
      {/* Fixed Animated Background */}
      <div className="fixed inset-0 h-screen w-screen">
        <DarkVeil
          hueShift={180}
          speed={0.3}
          warpAmount={0.5}
          noiseIntensity={0.02}
          scanlineIntensity={0}
          scanlineFrequency={0}
          resolutionScale={1}
        />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 pt-16">
          {/* Badge */}
          <div className="mb-8 flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-black">
              NEW
            </span>
            <span className="text-sm text-white/80">AI-Powered Error Analysis</span>
          </div>

          {/* Hero Text */}
          <h1 className="mb-6 max-w-4xl text-balance text-center text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Debug smarter, ship faster
          </h1>

          <p className="mb-10 max-w-2xl text-balance text-center text-lg text-white/70 md:text-xl">
            Connect your Sentry project and let AI analyze your errors in real-time. 
            Get instant fixes and prevention strategies.
          </p>

          {/* CTA Button */}
          <button
            onClick={onViewErrors}
            className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/20"
          >
            <Sparkles className="size-5" />
            View errors in your project
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-3xl font-bold text-white">10x</p>
              <p className="text-sm text-white/60">Faster debugging</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">95%</p>
              <p className="text-sm text-white/60">Fix accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-white/60">AI monitoring</p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-white/40">
              <span className="text-xs">Scroll to explore</span>
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Everything you need to fix errors fast
              </h2>
              <p className="mx-auto max-w-2xl text-white/60">
                Powered by advanced AI to analyze, diagnose, and fix production errors before they impact your users.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-500/20">
                  <Zap className="size-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Instant Analysis</h3>
                <p className="text-sm text-white/60">
                  Get AI-powered analysis of your errors in seconds, not hours. Understand root causes immediately.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-green-500/20">
                  <Shield className="size-6 text-green-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Prevention Tips</h3>
                <p className="text-sm text-white/60">
                  Learn how to prevent similar errors from occurring in the future with actionable recommendations.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-purple-500/20">
                  <BarChart3 className="size-6 text-purple-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Error Trends</h3>
                <p className="text-sm text-white/60">
                  Track error frequency and identify patterns to prioritize what needs fixing first.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-orange-500/20">
                  <Clock className="size-6 text-orange-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Real-time Monitoring</h3>
                <p className="text-sm text-white/60">
                  Stay informed with real-time error notifications and automatic severity classification.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-cyan-500/20">
                  <Code className="size-6 text-cyan-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Code Suggestions</h3>
                <p className="text-sm text-white/60">
                  Get copy-paste ready code fixes that you can apply directly to your codebase.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-pink-500/20">
                  <GitBranch className="size-6 text-pink-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Sentry Integration</h3>
                <p className="text-sm text-white/60">
                  Seamlessly connects with your Sentry projects to import errors automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                How it works
              </h2>
              <p className="mx-auto max-w-2xl text-white/60">
                Three simple steps to start fixing errors faster than ever before.
              </p>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start gap-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-white">Connect your Sentry project</h3>
                  <p className="text-white/60">
                    Link your Sentry organization to automatically import all your unresolved errors and exceptions.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold text-white">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-white">Select an error to analyze</h3>
                  <p className="text-white/60">
                    Browse your error list and click on any issue to view the full stack trace, metadata, and context.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-white">Get AI-powered fix suggestions</h3>
                  <p className="text-white/60">
                    Click &quot;Fix with AI&quot; to receive a detailed analysis including the root cause, solution steps, and prevention tips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-12 text-center backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to debug smarter?
            </h2>
            <p className="mb-8 text-white/70">
              Start analyzing your errors with AI-powered insights today.
            </p>
            <button
              onClick={onViewErrors}
              className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/20"
            >
              <Sparkles className="size-5" />
              Get started now
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center">
              <Image
                src="/images/devops-ai-logo.png"
                alt="DevOps AI"
                width={80}
                height={32}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-white/40">
              Built with Sentry MCP and Google Gemini AI
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
