'use client'

import { useEffect, useMemo, useState } from 'react'
import { FIREBASE_CONFIGURED } from '@/lib/env'
import { listenMeals, type SavedMeal } from '@/lib/meals'
import { listenPlanner, setPlannerMeal } from '@/lib/planner'
import type { WeekPlan, DayName, MealType } from '@/types/planner'
import type { Meal } from '@/types/recipe'
import { CalendarGrid } from '@/components/calendar-grid'

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

  // Saved meals source list
  useEffect(() => {
    const p = listenMeals(uid, setSavedMeals)
    let unsub: any
    Promise.resolve(p as any).then(u => (unsub = u))
    return () => { try { unsub && unsub() } catch {} }
  }, [uid])

  // Planner state
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

  const draggableMeals = useMemo(() => savedMeals, [savedMeals])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Meal Planner</h1>

      {/* Source list: Saved Meals */}
      <div className="rounded-lg border border-gray-700 p-4">
        <h2 className="font-medium mb-3">Saved Meals (drag onto the calendar)</h2>
        <div className="flex flex-wrap gap-3">
          {draggableMeals.map((m) => (
            <div
              key={m.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify(m))}
              className="cursor-grab active:cursor-grabbing rounded-md bg-gray-800 px-3 py-2 text-sm border border-gray-700"
              title="Drag to a day/slot"
            >
              {m.title} <span className="text-xs text-gray-400">• {m.time}</span>
            </div>
          ))}
          {draggableMeals.length === 0 && (
            <p className="text-sm text-gray-500">No saved meals yet. Go to <a className="underline" href="/generate">/generate</a> and save a few.</p>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <CalendarGrid weekPlan={plan} onMealDrop={onMealDrop} onClearSlot={onClearSlot} />
    </main>
  )
}
