export const FIREBASE_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'YOUR_KEY' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'YOUR_PROJECT_ID';

/** Optional: quick mode flag you can use in UIs */
export const DATA_MODE: 'firebase' | 'local' = FIREBASE_CONFIGURED ? 'firebase' : 'local';
