'use client'

import Link from 'next/link'
import { ChefHat } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-600/25">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-wide text-white">COOKSMART</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-gray-300 font-medium transition-colors">Home</Link>
            <Link href="/pantry" className="text-gray-400 hover:text-white transition-colors">Pantry</Link>
            <Link href="/generate" className="text-gray-400 hover:text-white transition-colors">Generate</Link>
            <Link href="/planner" className="text-gray-400 hover:text-white transition-colors">Planner</Link>
          </nav>

          {/* CTA */}
          <Link
            href="/generate"
            className="rounded-lg px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/25 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
