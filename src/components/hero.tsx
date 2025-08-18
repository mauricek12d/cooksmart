'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-4xl mx-auto"
    >
      {/* Badge */}
      <div className="mb-10 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-purple-400" />
          AI-powered cooking assistant for modern kitchens
        </div>
      </div>

      {/* Headline */}
      <h1 className="mx-auto mb-8 max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
        <span className="block text-white">Save 2 hours per person</span>
        <span className="block text-gray-400">every single week</span>
      </h1>

      {/* Subhead */}
      <p className="mx-auto mb-12 max-w-2xl text-xl md:text-2xl leading-relaxed text-gray-400">
        CookSmart is the most intelligent cooking app ever made.
        <br />Plan faster and cook better with AI-native recipes.
      </p>

      {/* CTA */}
      <Link
        href="/generate"
        className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium text-white
                   bg-gradient-to-tr from-purple-600 to-fuchsia-500 hover:brightness-110 active:scale-[0.99]
                   shadow-[0_12px_40px_rgba(168,85,247,0.35)] transition"
      >
        Get Started
      </Link>
    </motion.div>
  )
}
