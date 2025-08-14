'use client'

import type { Meal } from '@/types/recipe'
import type { DayName, MealType } from '@/types/planner'

export function MealSlot({
  day, mealType, meal, onDrop, onClear,
}: {
  day: DayName
  mealType: MealType
  meal: Meal | null
  onDrop: (day: DayName, mealType: MealType, meal: Meal) => void
  onClear: (day: DayName, mealType: MealType) => void
}) {
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (!data) return
    try {
      const parsed = JSON.parse(data) as Meal
      onDrop(day, mealType, parsed)
    } catch {}
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="rounded-md border border-dashed border-gray-700 p-3 min-h-24"
    >
      <div className="text-xs uppercase text-gray-500 mb-1">{mealType}</div>
      {meal ? (
        <div className="rounded-md bg-purple-600/20 text-purple-200 text-sm px-3 py-2 border border-purple-600/40 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate">{meal.title}</div>
            <div className="text-xs text-gray-300">• {meal.time}</div>
          </div>
          <button
            className="text-[11px] rounded border border-red-500/40 px-2 py-[2px] text-red-300 hover:bg-red-500/10"
            onClick={() => onClear(day, mealType)}
            title="Clear slot"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Drop a saved meal here</div>
      )}
    </div>
  )
}
