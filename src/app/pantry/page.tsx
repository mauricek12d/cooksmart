'use client';

import { useEffect, useMemo, useState } from 'react';
import { FIREBASE_CONFIGURED, addPantryItem, deletePantryItem, listenPantry, type PantryDoc } from '@/lib/pantry';

let RequireAuth: any = ({ children }: { children: React.ReactNode }) => <>{children}</>;
let useAuth: any = () => ({ user: null, signOut: async () => {} });

// Lazy-load auth bits only when configured (avoids redirect during dev mode)
if (FIREBASE_CONFIGURED) {
  // dynamic imports in client module scope are ok in dev
  const RA = require('@/components/require-auth');
  const AC = require('@/context/auth-context');
  RequireAuth = RA.RequireAuth;
  useAuth = AC.useAuth;
}

export default function PantryPage() {
  const shell = <PantryClient />;
  return FIREBASE_CONFIGURED ? <RequireAuth>{shell}</RequireAuth> : shell;
}

function PantryClient() {
  const { user, signOut } = FIREBASE_CONFIGURED ? useAuth() : { user: { uid: 'dev', email: 'dev@local' }, signOut: async () => {} };
  const uid = user?.uid || 'dev';

  const [items, setItems] = useState<PantryDoc[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const unsubPromise = listenPantry(uid, setItems);
    // listenPantry returns Promise<unsub> in FS mode, or function in LS mode
    let unsub: any;
    Promise.resolve(unsubPromise as any).then((u) => (unsub = u));
    return () => { try { unsub && unsub(); } catch {} };
  }, [uid]);

  const grouped = useMemo(() => {
    return items.reduce<Record<string, PantryDoc[]>>((acc, it) => {
      const k = it.category || 'Other';
      (acc[k] ||= []).push(it);
      return acc;
    }, {});
  }, [items]);

  async function handleAdd() {
    setErr(null);
    if (!name.trim()) { setErr('Name is required'); return; }
    setBusy(true);
    try {
      await addPantryItem(uid, { name, category, imageUrl });
      setName(''); setCategory(''); setImageUrl(null);
    } catch (e: any) {
      setErr(e?.message ?? 'Add failed');
    } finally { setBusy(false); }
  }

  async function handleDelete(id: string) {
    await deletePantryItem(uid, id);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Pantry</h1>
        {FIREBASE_CONFIGURED ? (
          <button className="text-sm underline" onClick={() => signOut()}>Sign out</button>
        ) : (
          <span className="text-xs rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 px-2 py-1">
            Dev mode (LocalStorage)
          </span>
        )}
      </div>

      {/* Add form */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-700 p-4">
          <h2 className="mb-3 font-medium">Add Ingredient</h2>
          {err && <div className="mb-3 text-sm text-red-400">{err}</div>}
          <input className="w-full mb-2 px-3 py-2 border rounded bg-background text-foreground" placeholder="Name (e.g. Chicken Breast)" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full mb-3 px-3 py-2 border rounded bg-background text-foreground" placeholder="Category (e.g. Protein, Produce)" value={category} onChange={e=>setCategory(e.target.value)} />
          {/* Optional: paste an image URL from /upload (or leave blank) */}
          <input className="w-full mb-3 px-3 py-2 border rounded bg-background text-foreground" placeholder="Image URL (optional)" value={imageUrl ?? ''} onChange={e=>setImageUrl(e.target.value || null)} />
          <button className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60" onClick={handleAdd} disabled={busy}>
            {busy ? 'Adding…' : 'Add'}
          </button>
        </div>

        <div className="rounded-lg border border-gray-700 p-4 text-sm text-gray-300">
          <p className="mb-2">Tips:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>In Dev mode, data is stored in your browser’s LocalStorage.</li>
            <li>When you add real Firebase keys, this page will use Firestore automatically (no code changes).</li>
            <li>You can upload an image at <code>/upload</code> and paste its URL here.</li>
          </ul>
        </div>
      </div>

      {/* Items grouped by category */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([cat, list]) => (
          <div key={cat} className="rounded-lg border border-gray-700 p-4">
            <h3 className="font-medium mb-3">{cat}</h3>
            <div className="space-y-2">
              {list.map((it) => (
                <div key={it.id} className="flex items-center justify-between rounded border border-gray-700 p-2">
                  <div className="min-w-0">
                    <div className="text-sm">{it.name}</div>
                    {it.imageUrl && <div className="text-xs text-gray-400 truncate max-w-[220px]">{it.imageUrl}</div>}
                  </div>
                  <button className="text-xs underline text-red-300" onClick={() => handleDelete(it.id)}>Delete</button>
                </div>
              ))}
              {list.length === 0 && <div className="text-sm text-gray-500">No items in {cat}</div>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">No pantry items yet.</p>}
      </div>
    </main>
  );
}
