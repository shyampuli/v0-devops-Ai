"use client"

import dynamic from "next/dynamic"
import { ArrowRight, Sparkles } from "lucide-react"

// Dynamically import ColorBends to avoid SSR issues with Three.js
const ColorBends = dynamic(() => import("@/components/effects/color-bends"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
})

interface LandingViewProps {
  onViewErrors: () => void
}

export function LandingView({ onViewErrors }: LandingViewProps) {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <ColorBends
          colors={["#3b82f6", "#06b6d4", "#0ea5e9"]}
          rotation={45}
          speed={0.15}
          scale={1.2}
          frequency={0.8}
          warpStrength={0.8}
          mouseInfluence={0.5}
          noise={0.1}
          parallax={0.3}
          iterations={2}
          intensity={1.2}
          bandWidth={5}
          transparent={false}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6">
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

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={onViewErrors}
            className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/20"
          >
            <Sparkles className="size-5" />
            View errors in your project
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
            Learn more
          </button>
        </div>

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
      </div>
    </div>
  )
}
