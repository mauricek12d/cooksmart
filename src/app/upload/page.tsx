'use client';

import { useState } from 'react';
import { RequireAuth } from '@/components/require-auth';
import UploadBox from '@/components/upload-box';
import { useAuth } from '@/context/auth-context';

export default function UploadDemoPage() {
  return (
    <RequireAuth>
      <UploadClient />
    </RequireAuth>
  );
}

function UploadClient() {
  const { user } = useAuth();
  const [url, setUrl] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Upload Pantry Photo</h1>
      <p className="text-sm text-gray-400">
        Signed in as <span className="font-mono">{user?.email || user?.uid}</span>
      </p>

      <UploadBox onUploaded={(u) => setUrl(u)} />

      {url && (
        <div className="space-y-2">
          <div className="text-sm text-gray-300">Uploaded URL:</div>
          <code className="block break-all rounded bg-gray-900 p-3 text-xs">{url}</code>
          <div className="rounded-md overflow-hidden border border-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Uploaded" className="w-full h-48 object-cover" />
          </div>
        </div>
      )}
    </main>
  );
}
