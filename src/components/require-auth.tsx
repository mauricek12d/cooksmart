'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !user) router.replace('/login');
  }, [initializing, user, router]);

  if (initializing) return <div className="p-6 text-sm text-gray-400">Checking session…</div>;
  return <>{user ? children : null}</>;
}

