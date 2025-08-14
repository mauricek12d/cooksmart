'use client';

import { motion } from 'framer-motion';
import type { Meal } from '@/types/recipe';

type Props = {
  meal: Meal;
  onSave?: () => void;
  onDelete?: () => void;
  saved?: boolean;
  showActions?: boolean; // toggle Save/Delete row
};

export function MealCard({ meal, onSave, onDelete, saved, showActions = true }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-gray-700 p-4 bg-gray-900 space-y-2"
    >
      <h3 className="text-lg font-semibold">{meal.title}</h3>
      <p className="text-sm text-gray-300">{meal.description}</p>
      <div className="text-xs text-gray-400">{meal.time} • Serves {meal.servings} • {meal.difficulty}</div>
      <div className="text-xs text-gray-400">Ingredients: {meal.ingredients.join(', ')}</div>

      {showActions && (
        <div className="pt-2 flex gap-2">
          {onSave && (
            <button
              onClick={onSave}
              className="px-3 py-1 rounded bg-purple-600 text-white text-xs disabled:opacity-60"
              disabled={saved}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 rounded border border-red-500/40 text-red-300 text-xs hover:bg-red-500/10"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
