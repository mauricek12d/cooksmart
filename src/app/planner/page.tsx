'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/header'
import { CalendarGrid } from '@/components/calendar-grid'

import { FIREBASE_CONFIGURED } from '@/lib/env'
import { listenMeals, type SavedMeal } from '@/lib/meals'
import { listenPlanner, setPlannerMeal } from '@/lib/planner'
import type { WeekPlan, DayName, MealType } from '@/types/planner'
import type { Meal } from '@/types/recipe'

import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingCart,
} from 'lucide-react'

// Auth wiring (same pattern you already use)
let RequireAuth: any = ({ children }: { children: React.ReactNode }) => <>{children}</>
let useAuth: any = () => ({ user: { uid: 'dev', email: 'dev@local' } })
if (FIREBASE_CONFIGURED) {
  const RA = require('@/components/require-auth')
  const AC = require('@/context/auth-context')
  RequireAuth = RA.RequireAuth
  useAuth = AC.useAuth
}

export default function PlannerPage() {
  const shell = <PlannerClient />
  return FIREBASE_CONFIGURED ? <RequireAuth>{shell}</RequireAuth> : shell
}

function PlannerClient() {
  const { user } = useAuth()
  const uid = user?.uid || 'dev'

  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([])
  const [plan, setPlan] = useState<WeekPlan>(() => ({
    Monday: { breakfast: null, lunch: null, dinner: null },
    Tuesday: { breakfast: null, lunch: null, dinner: null },
    Wednesday: { breakfast: null, lunch: null, dinner: null },
    Thursday: { breakfast: null, lunch: null, dinner: null },
    Friday: { breakfast: null, lunch: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, dinner: null },
  }))

  // basic “week offset” for the header display only
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    const p = listenMeals(uid, setSavedMeals)
    let unsub: any
    Promise.resolve(p as any).then(u => (unsub = u))
    return () => { try { unsub && unsub() } catch {} }
  }, [uid])

  useEffect(() => {
    const p = listenPlanner(uid, setPlan)
    let unsub: any
    Promise.resolve(p as any).then(u => (unsub = u))
    return () => { try { unsub && unsub() } catch {} }
  }, [uid])

  const onMealDrop = async (day: DayName, mealType: MealType, meal: Meal) => {
    await setPlannerMeal(uid, day, mealType, meal)
  }

  const onClearSlot = async (day: DayName, mealType: MealType) => {
    await setPlannerMeal(uid, day, mealType, null)
  }

  const mealsCount = useMemo(() => {
    return (Object.values(plan) as any[]).flatMap((d: any) => [d.breakfast, d.lunch, d.dinner]).filter(Boolean).length
  }, [plan])

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Weekly Meal Planner</h2>
            <p className="text-gray-400">Plan your meals and generate shopping lists</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/shopping">
              <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shopping List
              </Button>
            </Link>
            <Link href="/generate">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Recipe
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => setWeekOffset((n) => n - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous Week
          </Button>

          <div className="text-center">
            <h3 className="font-semibold text-lg">Week {weekOffset >= 0 ? `+${weekOffset}` : weekOffset} (display)</h3>
            <p className="text-sm text-gray-400">Drag meals to rearrange your plan</p>
          </div>

          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => setWeekOffset((n) => n + 1)}
          >
            Next Week
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>

        {/* Saved Meals (drag source) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-gray-700 p-4 mb-6"
        >
          <h4 className="font-medium mb-3">Saved Meals (drag onto the calendar)</h4>
          <div className="flex flex-wrap gap-3">
            {savedMeals.map((m) => (
              <div
                key={m.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify(m))}
                className="cursor-grab active:cursor-grabbing rounded-md bg-gray-800/90 px-3 py-2 text-sm border border-gray-700"
                title="Drag to a day/slot"
              >
                {m.title} <span className="text-xs text-gray-400">• {m.time}</span>
              </div>
            ))}
            {savedMeals.length === 0 && (
              <p className="text-sm text-gray-500">
                No saved meals yet. Go to <Link href="/generate" className="underline">/generate</Link> and save a few.
              </p>
            )}
          </div>
        </motion.div>

        {/* Calendar grid — matches the screenshot’s feel */}
        <AnimatePresence initial={false}>
          <CalendarGrid
            weekPlan={plan}
            onMealDrop={onMealDrop}
            onClearSlot={onClearSlot}
          />
        </AnimatePresence>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid md:grid-cols-4 gap-4 mt-8"
        >
          <div className="border-0 shadow-md rounded-xl bg-gradient-to-br from-rose-100/10 to-pink-100/10 p-4 text-center">
            <div className="text-2xl font-bold text-rose-300">{mealsCount}</div>
            <div className="text-sm text-rose-200/80">Meals Planned</div>
          </div>
          <div className="border-0 shadow-md rounded-xl bg-gradient-to-br from-blue-100/10 to-sky-100/10 p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">
              {21 - mealsCount /* 7 days × 3 slots */}
            </div>
            <div className="text-sm text-blue-200/80">Empty Slots</div>
          </div>
          <div className="border-0 shadow-md rounded-xl bg-gradient-to-br from-emerald-100/10 to-green-100/10 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-300">12</div>
            <div className="text-sm text-emerald-200/80">Shopping Items</div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
