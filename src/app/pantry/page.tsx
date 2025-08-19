'use client'

import { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/header'
import {
  FIREBASE_CONFIGURED,
  addPantryItem,
  deletePantryItem,
  listenPantry,
  type PantryDoc,
} from '@/lib/pantry'

let RequireAuth: any = ({ children }: { children: React.ReactNode }) => <>{children}</>
let useAuth: any = () => ({ user: null, signOut: async () => {} })
if (FIREBASE_CONFIGURED) {
  const RA = require('@/components/require-auth')
  const AC = require('@/context/auth-context')
  RequireAuth = RA.RequireAuth
  useAuth = AC.useAuth
}

export default function PantryPage() {
  const shell = <PantryClient />
  return FIREBASE_CONFIGURED ? <RequireAuth>{shell}</RequireAuth> : shell
}

function PantryClient() {
  const { user, signOut } = FIREBASE_CONFIGURED
    ? useAuth()
    : { user: { uid: 'dev', email: 'dev@local' }, signOut: async () => {} }
  const uid = user?.uid || 'dev'

  const [items, setItems] = useState<PantryDoc[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const unsubPromise = listenPantry(uid, setItems)
    let unsub: any
    Promise.resolve(unsubPromise as any).then((u) => (unsub = u))
    return () => {
      try { unsub && unsub() } catch {}
    }
  }, [uid])

  const grouped = useMemo(() => {
    return items.reduce<Record<string, PantryDoc[]>>((acc, it) => {
      const k = it.category || 'Other'
      ;(acc[k] ||= []).push(it)
      return acc
    }, {})
  }, [items])

  async function handleAdd() {
    setErr(null)
    if (!name.trim()) { setErr('Name is required'); return }
    setBusy(true)
    try {
      await addPantryItem(uid, { name, category, imageUrl })
      setName(''); setCategory(''); setImageUrl(null)
    } catch (e: any) {
      setErr(e?.message ?? 'Add failed')
    } finally { setBusy(false) }
  }

  async function handleDelete(id: string) {
    await deletePantryItem(uid, id)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Site header (matches Generate/Planner) */}
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        {/* Page head row */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Pantry</h1>
          {FIREBASE_CONFIGURED ? (
            <button className="text-sm underline hover:text-gray-300" onClick={() => signOut()}>
              Sign out
            </button>
          ) : (
            <span className="text-xs rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 px-2 py-1">
              Dev mode (LocalStorage)
            </span>
          )}
        </div>

        {/* Add form */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h2 className="mb-3 font-medium">Add Ingredient</h2>

            {err && <div className="mb-3 text-sm text-red-400">{err}</div>}

            <input
              className="w-full mb-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Name (e.g. Chicken Breast)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full mb-3 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Category (e.g. Protein, Produce)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              className="w-full mb-3 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Image URL (optional)"
              value={imageUrl ?? ''}
              onChange={(e) => setImageUrl(e.target.value || null)}
            />

            <button
              className="rounded bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-white hover:from-purple-600 hover:to-purple-700 disabled:opacity-60"
              onClick={handleAdd}
              disabled={busy}
            >
              {busy ? 'Adding…' : 'Add'}
            </button>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
            <p className="mb-2">Tips:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>In Dev mode, data is stored in your browser’s LocalStorage.</li>
              <li>When you add real Firebase keys, this page uses Firestore automatically.</li>
              <li>You can upload an image at <code>/upload</code> and paste its URL here.</li>
            </ul>
          </div>
        </div>

        {/* Items grouped by category */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <h3 className="mb-3 font-medium">{cat}</h3>
              <div className="space-y-2">
                {list.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between rounded border border-gray-700 bg-gray-800/70 p-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm">{it.name}</div>
                      {it.imageUrl && (
                        <div className="max-w-[220px] truncate text-xs text-gray-400">{it.imageUrl}</div>
                      )}
                    </div>
                    <button
                      className="text-xs underline text-red-300 hover:text-red-200"
                      onClick={() => handleDelete(it.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {list.length === 0 && (
                  <div className="text-sm text-gray-500">No items in {cat}</div>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500">No pantry items yet.</p>}
        </div>
      </main>
    </div>
  )
}
