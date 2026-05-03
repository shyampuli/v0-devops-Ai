"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Dynamically import DarkVeil to avoid SSR issues
const DarkVeil = dynamic(() => import("@/components/effects/dark-veil"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
})

interface LoginPageProps {
  onLogin: (user: { email: string; name: string; provider?: string }) => void
}

// Simulated user database stored in localStorage
interface StoredUser {
  email: string
  password: string
  name: string
  createdAt: string
  provider: "email" | "google"
}

const getUsersFromStorage = (): StoredUser[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("devops-users")
  return stored ? JSON.parse(stored) : []
}

const saveUserToStorage = (user: StoredUser) => {
  const users = getUsersFromStorage()
  // Check if user already exists, update if so
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase())
  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }
  localStorage.setItem("devops-users", JSON.stringify(users))
}

const findUser = (email: string): StoredUser | undefined => {
  return getUsersFromStorage().find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({})
  const [isSignUp, setIsSignUp] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Google email modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [googleEmail, setGoogleEmail] = useState("")
  const [googleError, setGoogleError] = useState("")

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    if (password.length < 8) errors.push("At least 8 characters")
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter")
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter")
    if (!/[0-9]/.test(password)) errors.push("One number")
    return { valid: errors.length === 0, errors }
  }

  const handleGoogleLogin = () => {
    setShowGoogleModal(true)
    setGoogleEmail("")
    setGoogleError("")
  }

  const handleGoogleEmailSubmit = async () => {
    // Validate Gmail address
    if (!googleEmail.trim()) {
      setGoogleError("Please enter your Gmail address")
      return
    }
    if (!validateEmail(googleEmail)) {
      setGoogleError("Please enter a valid email address")
      return
    }
    if (!googleEmail.toLowerCase().endsWith("@gmail.com")) {
      setGoogleError("Please enter a valid Gmail address (@gmail.com)")
      return
    }

    setIsGoogleLoading(true)
    setShowGoogleModal(false)
    
    // Simulate Google OAuth delay
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Extract name from email
    const name = googleEmail.split("@")[0].replace(/[._]/g, " ").split(" ").map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ")
    
    // Save Google user to database (so they can be recognized later)
    saveUserToStorage({
      email: googleEmail,
      password: "", // No password for Google users
      name: name,
      createdAt: new Date().toISOString(),
      provider: "google"
    })
    
    // Show success animation
    setShowSuccess(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    onLogin({
      email: googleEmail,
      name: name,
      provider: "google"
    })
  }

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate fields
    const newErrors: { email?: string; password?: string; confirmPassword?: string; general?: string } = {}
    
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password.trim()) {
      newErrors.password = "Password is required"
    } else if (isSignUp) {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        newErrors.password = `Missing: ${passwordValidation.errors.join(", ")}`
      }
    }

    if (isSignUp && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const existingUser = findUser(email)

    if (isSignUp) {
      // Sign up flow
      if (existingUser) {
        setIsLoading(false)
        setErrors({ email: "An account with this email already exists. Please sign in." })
        return
      }
      // Create new user
      saveUserToStorage({
        email: email,
        password: password,
        name: email.split("@")[0],
        createdAt: new Date().toISOString(),
        provider: "email"
      })
    } else {
      // Sign in flow
      if (!existingUser) {
        setIsLoading(false)
        setErrors({ general: "No account found with this email. Please sign up first." })
        return
      }
      // Check if this is a Google-only account
      if (existingUser.provider === "google") {
        setIsLoading(false)
        setErrors({ general: "This account uses Google Sign-In. Please use 'Continue with Google' to sign in." })
        return
      }
      if (existingUser.password !== password) {
        setIsLoading(false)
        setErrors({ password: "Incorrect password" })
        return
      }
    }

    // Show success animation before redirect
    setShowSuccess(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    onLogin({
      email: email,
      name: email.split("@")[0],
      provider: "email"
    })
  }

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setErrors({ email: "Enter your email first" })
      return
    }
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" })
      return
    }
    const user = findUser(email)
    if (!user) {
      setErrors({ email: "No account found with this email" })
      return
    }
    alert(`Password reset link sent to ${email}`)
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" }
    const validation = validatePassword(password)
    const score = 4 - validation.errors.length
    if (score <= 1) return { strength: 25, label: "Weak", color: "bg-red-500" }
    if (score === 2) return { strength: 50, label: "Fair", color: "bg-orange-500" }
    if (score === 3) return { strength: 75, label: "Good", color: "bg-yellow-500" }
    return { strength: 100, label: "Strong", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <DarkVeil
          hueShift={220}
          speed={0.2}
          warpAmount={0.4}
          noiseIntensity={0.015}
          scanlineIntensity={0}
          scanlineFrequency={0}
          resolutionScale={1}
        />
      </div>

      {/* Google Email Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/80 p-6 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute right-4 top-4 text-white/60 transition-colors hover:text-white"
            >
              <X className="size-5" />
            </button>
            
            <div className="mb-6 flex items-center gap-3">
              <svg className="size-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Continue with Google</h2>
            </div>
            
            <p className="mb-4 text-sm text-white/60">
              Enter your Gmail address to continue
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => {
                      setGoogleEmail(e.target.value)
                      setGoogleError("")
                    }}
                    placeholder="your.email@gmail.com"
                    autoFocus
                    className={cn(
                      "w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none transition-all focus:bg-white/10",
                      googleError ? "border-red-500/50" : "border-white/10 focus:border-blue-500/50"
                    )}
                    onKeyDown={(e) => e.key === "Enter" && handleGoogleEmailSubmit()}
                  />
                </div>
                {googleError && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="size-3" />
                    {googleError}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleGoogleEmailSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="px-8 pb-2 pt-10 text-center">
            {/* Logo */}
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome to DevOps AI</h1>
            <p className="mt-2 text-sm text-white/60">
              {isSignUp ? "Create an account to get started" : "Monitor, analyze, and fix production issues faster"}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* General Error */}
            {errors.general && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="size-4 shrink-0" />
                {errors.general}
              </div>
            )}

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading || showSuccess}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : showSuccess ? (
                <CheckCircle2 className="size-5 text-green-400" />
              ) : (
                <svg className="size-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-white/40">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Manual Login Form */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: undefined })
                      if (errors.general) setErrors({ ...errors, general: undefined })
                    }}
                    placeholder="Email address"
                    className={cn(
                      "w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none transition-all focus:bg-white/10",
                      errors.email
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-blue-500/50"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="size-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: undefined })
                    }}
                    placeholder="Password"
                    className={cn(
                      "w-full rounded-xl border bg-white/5 py-3 pl-11 pr-12 text-sm text-white placeholder-white/40 outline-none transition-all focus:bg-white/10",
                      errors.password
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-blue-500/50"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="size-3" />
                    {errors.password}
                  </p>
                )}
                {/* Password Strength Indicator (only during sign up) */}
                {isSignUp && password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Password strength</span>
                      <span className={cn(
                        passwordStrength.strength === 100 ? "text-green-400" :
                        passwordStrength.strength >= 75 ? "text-yellow-400" :
                        passwordStrength.strength >= 50 ? "text-orange-400" : "text-red-400"
                      )}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn("h-full transition-all", passwordStrength.color)}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {isSignUp && (
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
                      }}
                      placeholder="Confirm password"
                      className={cn(
                        "w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none transition-all focus:bg-white/10",
                        errors.confirmPassword
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-blue-500/50"
                      )}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="size-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Forgot Password */}
              {!isSignUp && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading || showSuccess || !email.trim() || !password.trim() || (isSignUp && !confirmPassword.trim())}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showSuccess ? (
                  <>
                    <CheckCircle2 className="size-4 text-white" />
                    Success
                  </>
                ) : isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </button>
            </form>

            {/* Toggle Sign Up / Sign In */}
            <p className="mt-6 text-center text-sm text-white/60">
              {isSignUp ? "Already have an account?" : "Don&apos;t have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setErrors({})
                  setPassword("")
                  setConfirmPassword("")
                }}
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-white/30">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
