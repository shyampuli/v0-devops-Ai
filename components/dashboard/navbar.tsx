"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Home, Settings, LogOut, User, ChevronDown, Bell, HelpCircle, Keyboard, ExternalLink } from "lucide-react"

interface NavbarProps {
  currentView: "landing" | "dashboard"
  onNavigateHome: () => void
}

export function Navbar({ currentView, onNavigateHome }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState(true)
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

  const toggleNotifications = () => {
    setNotifications(!notifications)
  }

  const openDocs = () => {
    window.open("https://docs.sentry.io/", "_blank")
    setIsDropdownOpen(false)
  }

  const openKeyboardShortcuts = () => {
    alert("Keyboard Shortcuts:\n\n• Ctrl/Cmd + K: Quick search\n• Ctrl/Cmd + R: Refresh issues\n• Escape: Close modal\n• Arrow keys: Navigate issues")
    setIsDropdownOpen(false)
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
              "absolute right-0 top-full mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl transition-all duration-200",
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
              {/* Version Info */}
              <div className="mb-2 flex items-center justify-between rounded-xl px-3 py-2 text-white/60">
                <span className="text-xs">Version</span>
                <span className="text-xs font-medium text-white/80">v1.0.0</span>
              </div>

              {/* Notifications Toggle */}
              <button
                onClick={toggleNotifications}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <Bell className="size-4" />
                  Notifications
                </div>
                <div
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    notifications ? "bg-blue-500" : "bg-white/20"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 size-4 rounded-full bg-white transition-transform",
                      notifications ? "translate-x-4" : "translate-x-0.5"
                    )}
                  />
                </div>
              </button>

              {/* Settings */}
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white">
                <Settings className="size-4" />
                Settings
              </button>

              {/* Keyboard Shortcuts */}
              <button
                onClick={openKeyboardShortcuts}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <Keyboard className="size-4" />
                  Keyboard Shortcuts
                </div>
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">?</kbd>
              </button>

              {/* Documentation */}
              <button
                onClick={openDocs}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="size-4" />
                  Documentation
                </div>
                <ExternalLink className="size-3 text-white/40" />
              </button>

              <div className="my-2 border-t border-white/10" />

              {/* Sign Out */}
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
