'use client';

import { FIREBASE_CONFIGURED } from '@/lib/env';
import type { Meal } from '@/types/recipe';

export type SavedMeal = Meal & { id: string; createdAt?: number | undefined };

const LS_KEY = 'cooksmart.meals';

/* ------------------------------ LocalStorage ------------------------------ */
function lsLoad(): SavedMeal[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function lsSave(items: SavedMeal[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('meals:update'));
}

function listenMealsLS(_uid: string, cb: (items: SavedMeal[]) => void) {
  const push = () => cb(lsLoad());
  push();
  const h = () => push();
  window.addEventListener('meals:update', h);
  return () => window.removeEventListener('meals:update', h);
}
async function addMealLS(_uid: string, meal: Meal) {
  const items = lsLoad();
  items.unshift({ ...meal, id: crypto.randomUUID(), createdAt: Date.now() });
  lsSave(items);
}
async function deleteMealLS(_uid: string, id: string) {
  lsSave(lsLoad().filter((m) => m.id !== id));
}

/* -------------------------------- Firestore ------------------------------- */
async function listenMealsFS(uid: string, cb: (items: SavedMeal[]) => void) {
  const { db } = await import('@/lib/firebase');
  const { collection, onSnapshot, orderBy, query } = await import('firebase/firestore');
  const q = query(collection(db, 'users', uid, 'meals'), orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, (snap) => {
    const out = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        title: data.title,
        description: data.description,
        time: data.time,
        servings: data.servings,
        difficulty: data.difficulty,
        ingredients: data.ingredients || [],
        createdAt: data.createdAt?.toMillis?.() ?? undefined,
      } as SavedMeal;
    });
    cb(out);
  });
  return unsub;
}

async function addMealFS(uid: string, meal: Meal) {
  const { db } = await import('@/lib/firebase');
  const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
  await addDoc(collection(db, 'users', uid, 'meals'), {
    ...meal,
    createdAt: serverTimestamp(),
  });
}

async function deleteMealFS(uid: string, id: string) {
  const { db } = await import('@/lib/firebase');
  const { deleteDoc, doc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'users', uid, 'meals', id));
}

/* --------------------------------- Facade -------------------------------- */
export function listenMeals(uid: string, cb: (items: SavedMeal[]) => void) {
  return FIREBASE_CONFIGURED ? listenMealsFS(uid, cb) : listenMealsLS(uid, cb);
}
export function addMeal(uid: string, meal: Meal) {
  return FIREBASE_CONFIGURED ? addMealFS(uid, meal) : addMealLS(uid, meal);
}
export function deleteMeal(uid: string, id: string) {
  return FIREBASE_CONFIGURED ? deleteMealFS(uid, id) : deleteMealLS(uid, id);
}
