'use client';

import { storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function uploadPantryImage(uid: string, file: File) {
  const safeName = file.name.replace(/[^\w.-]+/g, '_');
  const path = `users/${uid}/uploads/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
}
