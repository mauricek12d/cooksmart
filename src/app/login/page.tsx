'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInEmail, signInGoogle } from '@/lib/auth-actions';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth(); // requires AuthProvider mounted in app/layout.tsx

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, bounce to home (or wherever)
  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  async function handleEmailSignIn() {
    setError(null);
    setLoadingEmail(true);
    try {
      await signInEmail(email, password);
      router.push('/'); // success redirect
    } catch (e: any) {
      setError(e?.message ?? 'Sign-in failed');
    } finally {
      setLoadingEmail(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoadingGoogle(true);
    try {
      await signInGoogle();
      router.push('/');
    } catch (e: any) {
      setError(e?.message ?? 'Google sign-in failed');
    } finally {
      setLoadingGoogle(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {error && (
        <div className="mb-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <input
        className="w-full mb-2 px-3 py-2 border rounded bg-background text-foreground"
        placeholder="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full mb-4 px-3 py-2 border rounded bg-background text-foreground"
        placeholder="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        className="w-full mb-2 bg-purple-600 text-white py-2 rounded disabled:opacity-60"
        onClick={handleEmailSignIn}
        disabled={loadingEmail || loadingGoogle}
      >
        {loadingEmail ? 'Signing in…' : 'Sign in'}
      </button>

      <button
        type="button"
        className="w-full border py-2 rounded disabled:opacity-60"
        onClick={handleGoogleSignIn}
        disabled={loadingEmail || loadingGoogle}
      >
        {loadingGoogle ? 'Opening Google…' : 'Continue with Google'}
      </button>

      <p className="mt-4 text-sm text-gray-400">
        Don’t have an account? <a className="underline" href="/signup">Create one</a>
      </p>
    </div>
  );
}
