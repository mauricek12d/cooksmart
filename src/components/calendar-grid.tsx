'use client'

import { motion } from 'framer-motion'
import { Clock, Plus, X } from 'lucide-react'
import type { WeekPlan, DayName, MealType } from '@/types/planner'
import type { Meal } from '@/types/recipe'

type Props = {
  weekPlan: WeekPlan
  onMealDrop: (day: DayName, mealType: MealType, meal: Meal) => void | Promise<void>
  onClearSlot: (day: DayName, mealType: MealType) => void | Promise<void>
}

const DAYS: DayName[] = [
  'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
]
const MEAL_TYPES: MealType[] = ['breakfast','lunch','dinner']

export function CalendarGrid({ weekPlan, onMealDrop, onClearSlot }: Props) {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleDrop = async (
    e: React.DragEvent,
    day: DayName,
    mealType: MealType
  ) => {
    e.preventDefault()
    try {
      const json = e.dataTransfer.getData('application/json')
      if (!json) return
      const meal = JSON.parse(json) as Meal
      await onMealDrop(day, mealType, meal)
    } catch {}
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-7 gap-4"
    >
      {DAYS.map((day, idx) => {
        const dayPlan = weekPlan[day]
        return (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
          >
            <div className="h-full rounded-xl border-0 bg-gray-800 shadow-md">
              {/* Column header */}
              <div className="px-4 pt-4 pb-3 text-center border-b border-gray-700">
                <div className="text-lg font-semibold">{day}</div>
                <div className="text-xs text-gray-400">Week view</div>
              </div>

              {/* Slots */}
              <div className="p-4 space-y-4">
                {MEAL_TYPES.map((slot) => {
                  const meal = dayPlan[slot]
                  return (
                    <div key={slot} className="space-y-2">
                      <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        {slot}
                      </div>

                      {meal ? (
                        <motion.div
                          layout
                          className="group relative rounded-lg border-2 border-dashed border-transparent hover:border-rose-300 transition-all"
                        >
                          <div className="p-3 rounded-lg bg-gray-700/60">
                            <div className="flex items-start justify-between">
                              <div className="font-medium text-sm">{meal.title ?? meal.name}</div>
                              <button
                                className="opacity-60 hover:opacity-100 transition"
                                onClick={() => onClearSlot(day, slot)}
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-[12px] text-gray-300/80">
                              <Clock className="w-3 h-3" />
                              {meal.time ?? '—'}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div
                          onDrop={(e) => handleDrop(e, day, slot)}
                          onDragOver={handleDragOver}
                          className="p-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-rose-300 transition-colors"
                        >
                          <button
                            type="button"
                            className="w-full h-auto p-2 text-gray-400 hover:text-gray-200 inline-flex items-center justify-center"
                            // optional: open a modal to add meal manually
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add meal
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
