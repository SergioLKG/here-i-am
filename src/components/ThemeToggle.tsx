"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only run on client side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Initialize state based on localStorage or system preference
    const darkMode =
      localStorage.getItem("darkMode") === "true" ||
      (localStorage.getItem("darkMode") === null && window.matchMedia("(prefers-color-scheme: dark)").matches)

    setIsDark(darkMode)
  }, [])

  useEffect(() => {
    // Only update DOM after component is mounted to prevent hydration mismatch
    if (!mounted) return

    // Update the DOM when state changes
    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }, [isDark, mounted])

  // Add listener for system preference changes
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem("darkMode") === null) {
        setIsDark(e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [mounted])

  // Render placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}