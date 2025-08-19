'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-24 lg:py-32 max-w-5xl mx-auto"
    >
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          AI-powered cooking assistant for modern kitchens
        </div>
      </div>

      {/* Bigger headline with clamp */}
      <h1 className="mb-8 font-extrabold leading-[1.05] tracking-tight">
        <span className="block text-[clamp(40px,8vw,96px)] text-white">
          Save 2 hours per person
        </span>
        <span className="block text-[clamp(34px,7.5vw,86px)] text-gray-400">
          every single week
        </span>
      </h1>

      <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
        CookSmart is the most intelligent cooking app ever made.
        <br />
        Plan faster and cook better with AI-native recipes.
      </p>
    </motion.div>
  )
}
