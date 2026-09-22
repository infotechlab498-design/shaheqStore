'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Lock, Mail } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || 'Unable to sign in.');
        setIsSubmitting(false);
        return;
      }
      router.push(searchParams.get('next') || '/admin/dashboard');
      router.refresh();
    } catch {
      setError('Unable to sign in. Try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#051C42] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white shadow-2xl overflow-hidden">
        <div className="bg-[#073574] px-6 py-5 text-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center">
              <Box className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="font-extrabold tracking-wider">ALPHA TECH</div>
              <div className="text-[10px] uppercase tracking-widest text-blue-200">Admin Dashboard</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <h1 className="text-xl font-black text-[#073574]">Staff sign in</h1>
            <p className="text-xs text-slate-500 mt-1">Access inventory, orders, quotes, and operations.</p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Email</span>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#073574] focus:ring-1 focus:ring-[#073574]"
                placeholder="info@aljazeeragc.com"
              />
            </div>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Password</span>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#073574] focus:ring-1 focus:ring-[#073574]"
              />
            </div>
          </label>

          {error && (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#073574] hover:bg-[#062A63] disabled:opacity-60 text-white py-2.5 text-sm font-bold"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in to dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#051C42]" />}>
      <AdminLoginForm />
    </React.Suspense>
  );
}
