'use client'

import { useState } from 'react'
import type { Meal } from '@/types/recipe'

export default function GeneratePage() {
  const [input, setInput] = useState('chicken, broccoli, pasta')
  const [loading, setLoading] = useState(false)
  const [meals, setMeals] = useState<Meal[]>([])
  const [meta, setMeta] = useState<{ source?: string; error?: string }>({})

  async function onGenerate() {
    setLoading(true)
    setMeta({})
    try {
      const ingredients = input
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      const res = await fetch('/api/gpt/generate-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      })
      const data = await res.json()
      setMeals(data.meals || [])
      setMeta({ source: data.source, error: data.error })
    } catch (e: any) {
      setMeals([])
      setMeta({ error: e?.message || 'Failed to generate' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Generate meals from ingredients</h1>

      <div className="rounded-lg border border-gray-700 p-4">
        <label className="block text-sm text-gray-400 mb-1">Ingredients (comma-separated)</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. chicken, spinach, rice"
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {meta.source && (
          <div className="mt-3 text-xs text-gray-500">
            Source: <code>{meta.source}</code>{meta.error ? ` — ${meta.error}` : ''}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((m, i) => (
          <div key={i} className="rounded-lg border border-gray-700 p-4 bg-gray-900 space-y-2">
            <h3 className="text-lg font-semibold">{m.title}</h3>
            <p className="text-sm text-gray-300">{m.description}</p>
            <div className="text-xs text-gray-400">{m.time} • Serves {m.servings} • {m.difficulty}</div>
            <div className="text-xs text-gray-400">Ingredients: {m.ingredients.join(', ')}</div>
            {/* Day 6: add <MealCard /> + Save action */}
          </div>
        ))}
      </div>

      {meals.length === 0 && !loading && (
        <p className="text-sm text-gray-500">No meals yet — enter a few ingredients and click Generate.</p>
      )}
    </main>
  )
}
