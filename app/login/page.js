'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirectTo);
    }
  }, [authLoading, user, redirectTo, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
      router.push(redirectTo);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-xl font-bold text-white tracking-tight">
            TechStore
          </a>
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-300 transition"
          >
            Back to store
          </a>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          {mode === 'login' ? 'Sign in' : 'Create an account'}
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          {mode === 'login'
            ? 'Sign in to manage your cart and ratings.'
            : 'Register to start adding items to your cart.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-400 transition"
              required
              minLength={3}
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-400 transition"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-900 text-red-300 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 py-2.5 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign in'
              : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-amber-400 hover:text-amber-300 text-sm transition"
          >
            {mode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111111] flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
