'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Clock, Users, ArrowRight, CalendarDays, ListChecks, Wand2 } from 'lucide-react'

type FeaturedMeal = {
  id: number
  title: string
  image?: string
  time: string
  servings: number
  tags: string[]
}

const featuredMeals: FeaturedMeal[] = [
  { id: 1, title: 'Creamy Chicken Pasta', image: '/placeholder.svg', time: '25 min', servings: 4, tags: ['Easy', 'Weeknight'] },
  { id: 2, title: 'Garlic Broccoli Stir-Fry', image: '/placeholder.svg', time: '15 min', servings: 2, tags: ['Vegan', 'Quick'] },
  { id: 3, title: 'Overnight Oats', image: '/placeholder.svg', time: '10 min', servings: 1, tags: ['Breakfast', 'Meal Prep'] },
]

const quickActions = [
  { title: 'Manage Pantry', description: 'Track what you have and reduce waste', href: '/pantry', icon: ListChecks },
  { title: 'Generate Recipes', description: 'Turn ingredients into meals with AI', href: '/generate', icon: Wand2 },
  { title: 'Plan Your Week', description: 'Drag meals into your calendar', href: '/planner', icon: CalendarDays },
]

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <Hero />
      </section>

      {/* App Preview */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative max-w-6xl mx-auto mb-20">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            {/* Mock App Header */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-white font-medium">Pantry</span>
                    <span className="text-gray-400">Recipes</span>
                    <span className="text-gray-400">Planner</span>
                    <span className="text-gray-400">Shopping</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Mock App Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {featuredMeals.map((meal, index) => (
                  <motion.div key={meal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                    <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-700 transition-colors">
                      <div className="relative">
                        <img src={meal.image || '/placeholder.svg'} alt={meal.title} className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-white mb-2">{meal.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meal.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {meal.servings}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {meal.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="py-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to cook smarter</h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">From pantry management to meal planning, CookSmart handles it all</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {quickActions.map((action, index) => (
              <motion.div key={action.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                <Link href={action.href}>
                  <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 cursor-pointer group h-full rounded-xl">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-purple-600/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/20 transition-colors">
                        <action.icon className="w-8 h-8 text-purple-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-3">{action.title}</h4>
                      <p className="text-gray-400 mb-4">{action.description}</p>
                      <div className="flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  )
}
