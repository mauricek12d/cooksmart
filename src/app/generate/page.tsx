'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Loader2,
  RefreshCw,
  Clock,
  Users,
  Heart,
} from 'lucide-react'

type Meal = {
  id: string
  title: string
  description: string
  time: string
  servings: number
  difficulty: string
  ingredients: string[]
  image?: string
  color?: string // tailwind gradient helper (e.g. 'from-rose-500 to-pink-500')
}

const AVAILABLE_INGREDIENTS = [
  'chicken',
  'salmon',
  'broccoli',
  'spinach',
  'rice',
  'pasta',
  'garlic',
  'tomato',
  'onion',
  'eggs',
  'quinoa',
  'mushroom',
]

export default function GeneratePage() {
  // left panel state
  const [selected, setSelected] = useState<string[]>(['chicken', 'broccoli', 'pasta'])
  const [customRequest, setCustomRequest] = useState('')

  // generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [meals, setMeals] = useState<Meal[]>([])
  const hasGenerated = meals.length > 0

  function toggleIngredient(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    )
  }

  async function generateMeals() {
    setIsGenerating(true)
    try {
      // If you have a real API, call it here. This mock keeps the UI identical.
      // const res = await fetch('/api/gpt/generate-meals', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ingredients: selected, request: customRequest }) })
      // const data = await res.json()
      // setMeals(data.meals)

      // Mocked results for demo parity with v0
      const mock: Meal[] = [
        {
          id: '1',
          title: 'Creamy Chicken Pasta',
          description: 'Tender chicken and al dente pasta in a silky garlic cream sauce.',
          time: '25 min',
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['chicken', 'pasta', 'garlic'],
          image: '/placeholder.svg',
          color: 'from-rose-500 to-pink-500',
        },
        {
          id: '2',
          title: 'Garlic Broccoli Stir-Fry',
          description: 'Crisp-tender broccoli tossed with fragrant garlic and light soy.',
          time: '15 min',
          servings: 2,
          difficulty: 'Easy',
          ingredients: ['broccoli', 'garlic', 'onion'],
          image: '/placeholder.svg',
          color: 'from-purple-500 to-violet-500',
        },
        {
          id: '3',
          title: 'One-Pan Chicken & Rice',
          description: 'Comforting, savory, and perfect for busy weeknights.',
          time: '30 min',
          servings: 3,
          difficulty: 'Medium',
          ingredients: ['chicken', 'rice', 'onion'],
          image: '/placeholder.svg',
          color: 'from-emerald-500 to-teal-500',
        },
      ]
      setMeals(mock)
    } finally {
      setIsGenerating(false)
    }
  }

  function regenerateMeals() {
    // Just call generate again (or hit your API with a different seed)
    generateMeals()
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-2 text-3xl font-bold text-gray-100">Generate Meals</h2>
          <p className="text-gray-400">
            Let AI create personalized recipes from your ingredients
          </p>
        </motion.div>

        {/* 3-column grid at lg with sticky left panel (matches v0 layout) */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24 border-gray-800 bg-gray-900">
              <CardContent className="space-y-6 p-6">
                {/* Title row */}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-500" />
                  <h3 className="text-white">Recipe Generator</h3>
                </div>

                {/* Available Ingredients */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-100">Available Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_INGREDIENTS.map((ing) => {
                      const active = selected.includes(ing)
                      return (
                        <button
                          key={ing}
                          type="button"
                          onClick={() => toggleIngredient(ing)}
                          className={[
                            'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-all',
                            active
                              ? 'border-transparent bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                              : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700',
                          ].join(' ')}
                        >
                          {ing}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Custom Request */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-100">Special Requests</h4>
                  <textarea
                    placeholder="Any dietary restrictions, cuisine preferences, or cooking methods?"
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    className="min-h-[100px] w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                {/* Generate / Regenerate */}
                <div className="space-y-3">
                  <button
                    onClick={generateMeals}
                    disabled={selected.length === 0 || isGenerating}
                    className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 font-medium text-white transition-all hover:from-purple-600 hover:to-purple-700 disabled:opacity-60"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Meals
                      </>
                    )}
                  </button>

                  {hasGenerated && (
                    <button
                      onClick={regenerateMeals}
                      disabled={isGenerating}
                      className="inline-flex w-full items-center justify-center rounded-md border border-gray-700 bg-transparent px-4 py-2 font-medium text-gray-300 transition-all hover:bg-gray-800 disabled:opacity-60"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate New Ideas
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {!hasGenerated && !isGenerating && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100">
                  <Sparkles className="h-12 w-12 text-rose-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-100">
                  Ready to Cook Something Amazing?
                </h3>
                <p className="text-gray-400">
                  Select your ingredients and let our AI create personalized recipes for you
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100">
                  <Loader2 className="h-12 w-12 animate-spin text-rose-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-100">
                  Creating Your Recipes…
                </h3>
                <p className="text-gray-400">Our AI is analyzing your ingredients and preferences</p>
              </div>
            )}

            <AnimatePresence>
              {meals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-100">Generated Recipes</h3>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                      {meals.length} recipes found
                    </span>
                  </div>

                  <div className="grid gap-6">
                    {meals.map((meal, index) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ y: -2 }}
                      >
                        <Card className="overflow-hidden border-0 bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl">
                          <div className="md:flex">
                            <div className="relative md:w-1/3">
                              <img
                                src={meal.image || '/placeholder.svg'}
                                alt={meal.title}
                                className="h-48 w-full object-cover md:h-full"
                              />
                              <div
                                className={`absolute inset-0 bg-gradient-to-t ${meal.color || 'from-purple-500 to-pink-500'} opacity-20`}
                              />
                            </div>

                            <div className="md:w-2/3 p-6">
                              <div className="mb-3 flex items-start justify-between">
                                <h4 className="text-xl font-semibold text-gray-100">{meal.title}</h4>
                                <button
                                  type="button"
                                  className="rounded p-1 text-gray-400 transition-colors hover:text-red-500"
                                  aria-label="Save"
                                >
                                  <Heart className="h-4 w-4" />
                                </button>
                              </div>

                              <p className="mb-4 text-gray-400">{meal.description}</p>

                              <div className="mb-4 flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {meal.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {meal.servings} servings
                                </div>
                                <span className="inline-flex items-center rounded-full border border-gray-700 px-2 py-0.5 text-xs text-gray-300">
                                  {meal.difficulty}
                                </span>
                              </div>

                              <div className="mb-4">
                                <p className="mb-2 text-sm font-medium text-gray-300">
                                  Using your ingredients:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {meal.ingredients.map((ing) => (
                                    <span
                                      key={ing}
                                      className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800"
                                    >
                                      {ing}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 font-medium text-white transition-all hover:from-purple-600 hover:to-purple-700">
                                  View Recipe
                                </button>
                                <button className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-transparent px-4 py-2 font-medium text-gray-300 transition-all hover:bg-gray-800">
                                  Add to Planner
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
