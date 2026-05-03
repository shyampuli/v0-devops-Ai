"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Home, Settings, Moon, Sun, LogOut, User, ChevronDown } from "lucide-react"

interface NavbarProps {
  currentView: "landing" | "dashboard"
  onNavigateHome: () => void
  theme: "light" | "dark"
  onToggleTheme: () => void
}

export function Navbar({ currentView, onNavigateHome, theme, onToggleTheme }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = () => {
    setIsDropdownOpen(false)
    onNavigateHome()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="text-lg font-semibold text-white">DevOps AI</span>
        </div>

        {/* Center - Navigation */}
        <div className="flex items-center">
          <button
            onClick={onNavigateHome}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
              currentView === "landing"
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <Home className="size-4" />
            Home
          </button>
        </div>

        {/* Right - Settings Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/70 transition-all hover:bg-white/5 hover:text-white"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <User className="size-4 text-white" />
            </div>
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl transition-all duration-200",
              isDropdownOpen
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            )}
          >
            {/* User Info */}
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <User className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Demo User</p>
                  <p className="text-xs text-white/60">demo@devops-ai.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <div className="mb-2 flex items-center justify-between rounded-xl px-3 py-2 text-white/60">
                <span className="text-xs">Version</span>
                <span className="text-xs font-medium text-white/80">v1.0.0</span>
              </div>

              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white">
                <Settings className="size-4" />
                Settings
              </button>

              <button
                onClick={onToggleTheme}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  Theme
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1">
                  <span className="text-xs capitalize">{theme}</span>
                </div>
              </button>

              <div className="my-2 border-t border-white/10" />

              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-all hover:bg-red-500/10"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
