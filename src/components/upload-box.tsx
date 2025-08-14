'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadPantryImage } from '@/lib/storage';
import { useAuth } from '@/context/auth-context';

type Props = { onUploaded: (url: string) => void };

export default function UploadBox({ onUploaded }: Props) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (accepted: File[]) => {
    if (!user) return;
    const file = accepted[0];
    if (!file) return;
    try {
      setError(null);
      setBusy(true);
      // local preview while uploading
      setPreview(URL.createObjectURL(file));
      const url = await uploadPantryImage(user.uid, file);
      onUploaded(url);
    } catch (e: any) {
      setError(e?.message ?? 'Upload failed');
    } finally {
      setBusy(false);
    }
  }, [user, onUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': [] },
    maxSize: 8 * 1024 * 1024, // 8MB, tweak as desired
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`rounded-md border-2 border-dashed p-6 text-sm cursor-pointer ${
          isDragActive ? 'border-purple-500 bg-purple-500/5' : 'border-gray-700 bg-gray-800/40'
        }`}
      >
        <input {...getInputProps()} />
        {!busy ? (
          <p className="text-gray-300">
            Drag & drop a pantry photo here, or <span className="underline">click to upload</span>.
          </p>
        ) : (
          <p className="text-gray-400">Uploading…</p>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {preview && (
        <div className="rounded-md overflow-hidden border border-gray-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
        </div>
      )}
    </div>
  );
}
