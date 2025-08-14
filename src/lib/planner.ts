'use client'

import { FIREBASE_CONFIGURED } from '@/lib/env'
import type { Meal } from '@/types/recipe'
import type { DayName, MealType, WeekPlan, DayPlan } from '@/types/planner'
import { DAYS } from '@/types/planner'

/* -------------------------- Shared helpers -------------------------- */
function emptyDay(): DayPlan { return { breakfast: null, lunch: null, dinner: null } }
export function emptyWeek(): WeekPlan {
  return {
    Monday: emptyDay(), Tuesday: emptyDay(), Wednesday: emptyDay(),
    Thursday: emptyDay(), Friday: emptyDay(), Saturday: emptyDay(), Sunday: emptyDay(),
  }
}

/* ---------------------------- LocalStorage --------------------------- */
const LS_KEY = 'cooksmart.planner'

function lsLoad(): WeekPlan {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return emptyWeek()
    const parsed = JSON.parse(raw)
    // ensure all days/slots exist
    const wk = emptyWeek()
    for (const d of DAYS) wk[d] = { ...emptyDay(), ...(parsed?.[d] || {}) }
    return wk
  } catch { return emptyWeek() }
}
function lsSave(plan: WeekPlan) {
  localStorage.setItem(LS_KEY, JSON.stringify(plan))
  window.dispatchEvent(new Event('planner:update'))
}

function listenPlannerLS(_uid: string, cb: (plan: WeekPlan) => void) {
  const push = () => cb(lsLoad())
  push()
  const h = () => push()
  window.addEventListener('planner:update', h)
  return () => window.removeEventListener('planner:update', h)
}

async function setPlannerMealLS(_uid: string, day: DayName, slot: MealType, meal: Meal | null) {
  const plan = lsLoad()
  plan[day][slot] = meal
  lsSave(plan)
}

/* ------------------------------ Firestore --------------------------- */
/** We store a single doc 'current' for simplicity. */
const DOC_ID = 'current'

async function listenPlannerFS(uid: string, cb: (plan: WeekPlan) => void) {
  const { db } = await import('@/lib/firebase')
  const { doc, onSnapshot, setDoc } = await import('firebase/firestore')
  const ref = doc(db, 'users', uid, 'planner', DOC_ID)
  // Ensure doc exists
  await setDoc(ref, emptyWeek(), { merge: true })
  const unsub = onSnapshot(ref, (snap) => {
    const data = (snap.data() as any) || {}
    const wk = emptyWeek()
    for (const d of DAYS) {
      const day = data[d] || {}
      wk[d] = { breakfast: day.breakfast ?? null, lunch: day.lunch ?? null, dinner: day.dinner ?? null }
    }
    cb(wk)
  })
  return unsub
}

async function setPlannerMealFS(uid: string, day: DayName, slot: MealType, meal: Meal | null) {
  const { db } = await import('@/lib/firebase')
  const { doc, setDoc } = await import('firebase/firestore')
  const ref = doc(db, 'users', uid, 'planner', DOC_ID)
  await setDoc(ref, { [day]: { [slot]: meal } }, { merge: true })
}

/* --------------------------------- Facade --------------------------- */
export function listenPlanner(uid: string, cb: (plan: WeekPlan) => void) {
  return FIREBASE_CONFIGURED ? listenPlannerFS(uid, cb) : listenPlannerLS(uid, cb)
}
export function setPlannerMeal(uid: string, day: DayName, slot: MealType, meal: Meal | null) {
  return FIREBASE_CONFIGURED ? setPlannerMealFS(uid, day, slot, meal) : setPlannerMealLS(uid, day, slot, meal)
}
