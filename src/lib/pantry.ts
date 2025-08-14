'use client';

import { FIREBASE_CONFIGURED } from '@/lib/env';

export type PantryDoc = {
  id: string;
  name: string;
  category?: string | null;
  imageUrl?: string | null;
  createdAt?: number | undefined; // epoch ms in dev; Firestore Timestamp when real
};

/* ------------------------------ LocalStorage ------------------------------ */
const LS_KEY = 'cooksmart.pantry';
function lsLoad(): PantryDoc[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function lsSave(items: PantryDoc[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('pantry:update'));
}
function listenPantryLS(_uid: string, cb: (items: PantryDoc[]) => void) {
  const push = () => cb(lsLoad());
  push();
  const h = () => push();
  window.addEventListener('pantry:update', h);
  return () => window.removeEventListener('pantry:update', h);
}
async function addPantryItemLS(_uid: string, data: { name: string; category?: string | null; imageUrl?: string | null }) {
  const items = lsLoad();
  items.unshift({
    id: crypto.randomUUID(),
    name: data.name.trim(),
    category: data.category?.trim() || null,
    imageUrl: data.imageUrl || null,
    createdAt: Date.now(),
  });
  lsSave(items);
}
async function deletePantryItemLS(_uid: string, id: string) {
  lsSave(lsLoad().filter((i) => i.id !== id));
}

/* -------------------------------- Firestore ------------------------------- */
async function listenPantryFS(uid: string, cb: (items: PantryDoc[]) => void) {
  const { db } = await import('@/lib/firebase');
  const { collection, onSnapshot, orderBy, query } = await import('firebase/firestore');
  const q = query(collection(db, 'users', uid, 'pantry'), orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, (snap) => {
    const out = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        name: data.name,
        category: data.category ?? null,
        imageUrl: data.imageUrl ?? null,
        createdAt: data.createdAt?.toMillis?.() ?? undefined,
      } as PantryDoc;
    });
    cb(out);
  });
  return unsub;
}
async function addPantryItemFS(uid: string, data: { name: string; category?: string | null; imageUrl?: string | null }) {
  const { db } = await import('@/lib/firebase');
  const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
  await addDoc(collection(db, 'users', uid, 'pantry'), {
    name: data.name.trim(),
    category: data.category?.trim() || null,
    imageUrl: data.imageUrl || null,
    createdAt: serverTimestamp(),
  });
}
async function deletePantryItemFS(uid: string, id: string) {
  const { db } = await import('@/lib/firebase');
  const { deleteDoc, doc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'users', uid, 'pantry', id));
}

/* ------------------------------- Facade API ------------------------------- */
export function listenPantry(uid: string, cb: (items: PantryDoc[]) => void) {
  return FIREBASE_CONFIGURED ? listenPantryFS(uid, cb) : listenPantryLS(uid, cb);
}
export function addPantryItem(uid: string, data: { name: string; category?: string | null; imageUrl?: string | null }) {
  return FIREBASE_CONFIGURED ? addPantryItemFS(uid, data) : addPantryItemLS(uid, data);
}
export function deletePantryItem(uid: string, id: string) {
  return FIREBASE_CONFIGURED ? deletePantryItemFS(uid, id) : deletePantryItemLS(uid, id);
}
export { FIREBASE_CONFIGURED };
