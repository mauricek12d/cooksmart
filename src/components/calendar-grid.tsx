import type { WeekPlan, DayName, MealType } from '@/types/planner'
import { DAYS, MEAL_TYPES } from '@/types/planner'
import { MealSlot } from './meal-slot'
import type { Meal } from '@/types/recipe'

export function CalendarGrid({
  weekPlan,
  onMealDrop,
  onClearSlot,
}: {
  weekPlan: WeekPlan
  onMealDrop: (day: DayName, mealType: MealType, meal: Meal) => void
  onClearSlot: (day: DayName, mealType: MealType) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {DAYS.map((day) => (
        <div key={day} className="h-full rounded-lg border border-gray-800 bg-gray-900 shadow-sm">
          <div className="pb-3 px-4 pt-4">
            <h3 className="text-center text-lg font-semibold text-white">{day}</h3>
          </div>
          <div className="space-y-3 px-4 pb-4">
            {MEAL_TYPES.map((mt) => (
              <MealSlot
                key={mt}
                day={day}
                mealType={mt}
                meal={weekPlan[day]?.[mt] ?? null}
                onDrop={onMealDrop}
                onClear={onClearSlot}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
