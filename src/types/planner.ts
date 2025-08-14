import type { Meal } from '@/types/recipe'

export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type DayName = 'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'|'Sunday'

export type DayPlan = {
  breakfast: Meal | null
  lunch: Meal | null
  dinner: Meal | null
}

export type WeekPlan = Record<DayName, DayPlan>

export const DAYS: DayName[] = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
export const MEAL_TYPES: MealType[] = ['breakfast','lunch','dinner']
