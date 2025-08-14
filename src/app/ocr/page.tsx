'use client';

import { useState } from 'react';
import { RequireAuth } from '@/components/require-auth';
import UploadBox from '@/components/upload-box';
import { extractIngredients } from '@/lib/ingredients';

export default function OCRPage() {
  return (
    <RequireAuth>
      <OCRClient />
    </RequireAuth>
  );
}

function OCRClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function analyze() {
    if (!imageUrl) return;
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Vision failed');
      setRawText(data.text || '');
      const parsed = extractIngredients(data.text || '');
      setItems(parsed);
      setSelected(new Set(parsed)); // pre-select all
    } catch (e: any) {
      setErr(e?.message ?? 'Analyze failed');
    } finally {
      setBusy(false);
    }
  }

  function toggle(item: string) {
    setSelected(s => {
      const n = new Set(s);
      n.has(item) ? n.delete(item) : n.add(item);
      return n;
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">OCR Pantry Extract</h1>

      <div className="rounded-lg border border-gray-700 p-4">
        <h2 className="mb-3 font-medium">1) Upload an image</h2>
        <UploadBox onUploaded={url => setImageUrl(url)} />
        {imageUrl && <p className="mt-2 text-xs text-gray-400 break-all">Image: {imageUrl}</p>}
      </div>

      <div className="rounded-lg border border-gray-700 p-4">
        <h2 className="mb-3 font-medium">2) Analyze with Vision</h2>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={analyze}
          disabled={!imageUrl || busy}
        >
          {busy ? 'Analyzing…' : 'Analyze image'}
        </button>
        {err && <p className="mt-3 text-red-400 text-sm">{err}</p>}
      </div>

      {rawText && (
        <div className="rounded-lg border border-gray-700 p-4">
          <h2 className="mb-3 font-medium">Raw text (Vision)</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-300">{rawText}</pre>
        </div>
      )}

      {items.length > 0 && (
        <div className="rounded-lg border border-gray-700 p-4">
          <h2 className="mb-3 font-medium">3) Select ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {items.map(it => (
              <button
                key={it}
                onClick={() => toggle(it)}
                className={`text-xs rounded-full border px-3 py-1 ${
                  selected.has(it)
                    ? 'bg-purple-600/20 text-purple-200 border-purple-600/50'
                    : 'bg-gray-800 text-gray-300 border-gray-700'
                }`}
              >
                {it}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-sm text-gray-400">Selected (comma-separated)</label>
            <textarea
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
              rows={3}
              value={Array.from(selected).join(', ')}
              readOnly
            />
          </div>

          <p className="mt-3 text-sm text-gray-400">
            Day 4 will save these to Firestore as pantry items.
          </p>
        </div>
      )}
    </main>
  );
}
