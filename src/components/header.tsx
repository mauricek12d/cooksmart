"use client"

import Link from "next/link"
import { useState } from "react"
import { ChefHat, Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo + wordmark */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-wide text-white">COOKSMART</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white font-medium transition-colors hover:text-gray-300">
              Home
            </Link>
            <Link href="/pantry" className="text-gray-400 transition-colors hover:text-white">
              Pantry
            </Link>
            <Link href="/generate" className="text-gray-400 transition-colors hover:text-white">
              Generate
            </Link>
            <Link href="/planner" className="text-gray-400 transition-colors hover:text-white">
              Planner
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* CTA Button - Desktop */}
          <Link
            href="/get-started"
            className="hidden md:inline-flex items-center rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-white font-medium transition-colors hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/pantry"
                className="text-gray-400 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Pantry
              </Link>
              <Link
                href="/generate"
                className="text-gray-400 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Generate
              </Link>
              <Link
                href="/planner"
                className="text-gray-400 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Planner
              </Link>
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700 mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
