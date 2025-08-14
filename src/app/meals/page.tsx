'use client'

import { useEffect, useState } from 'react'
import { FIREBASE_CONFIGURED } from '@/lib/env'
import { listenMeals, deleteMeal, type SavedMeal } from '@/lib/meals'
import { MealCard } from '@/components/meal-card'

let RequireAuth: any = ({ children }: { children: React.ReactNode }) => <>{children}</>
let useAuth: any = () => ({ user: { uid: 'dev' } })
if (FIREBASE_CONFIGURED) {
  const RA = require('@/components/require-auth')
  const AC = require('@/context/auth-context')
  RequireAuth = RA.RequireAuth
  useAuth = AC.useAuth
}

export default function MealsPage() {
  const shell = <MealsClient />
  return FIREBASE_CONFIGURED ? <RequireAuth>{shell}</RequireAuth> : shell
}

function MealsClient() {
  const { user } = useAuth()
  const uid = user?.uid || 'dev'
  const [items, setItems] = useState<SavedMeal[]>([])

  useEffect(() => {
    const p = listenMeals(uid, setItems)
    let unsub: any
    Promise.resolve(p as any).then(u => (unsub = u))
    return () => { try { unsub && unsub() } catch {} }
  }, [uid])

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Saved Meals</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m) => (
          <MealCard
            key={m.id}
            meal={m}
            showActions
            onDelete={() => deleteMeal(uid, m.id)}
          />
        ))}
      </div>
      {items.length === 0 && <p className="text-sm text-gray-500">No saved meals yet.</p>}
    </main>
  )
}
