'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpEmail } from '@/lib/auth-actions';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setErr(null);
    setLoading(true);
    try {
      await signUpEmail(email, password);
      router.push('/pantry'); // or /login
    } catch (e: any) {
      setErr(e?.message ?? 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      {err && <div className="mb-3 border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300 rounded">{err}</div>}
      <input className="w-full mb-2 px-3 py-2 border rounded bg-background text-foreground" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full mb-4 px-3 py-2 border rounded bg-background text-foreground" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full bg-purple-600 text-white py-2 rounded disabled:opacity-60" onClick={handleSignup} disabled={loading}>
        {loading ? 'Creating…' : 'Sign up'}
      </button>
    </div>
  );
}