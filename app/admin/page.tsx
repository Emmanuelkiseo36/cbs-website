'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { login, type LoginState } from './actions-auth';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

const initial: LoginState = {};

export default function AdminLogin() {
  const [state, formAction] = useActionState(login, initial);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4 py-16">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center border border-gold-500/40 font-display text-lg font-black tracking-tight text-gold-400">
            CBS
          </span>
          <h1 className="mt-5 font-display text-2xl font-black uppercase tracking-tight text-white">
            Admin Login
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4 text-gold-400" aria-hidden="true" />
            Customs Brokerage Services — secure control panel
          </p>
        </div>

        <form action={formAction} className="rounded-lg border border-white/10 bg-white p-7 shadow-2xl">
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900">Email</span>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  className="w-full rounded-md border border-navy-900/15 bg-paper px-3.5 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  placeholder="admin@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900">Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-navy-900/15 bg-paper px-3.5 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                placeholder="••••••••"
              />
            </label>

            {state.error && (
              <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-7 py-3 text-[0.78rem] font-bold uppercase tracking-hair text-navy-950 transition-colors hover:bg-gold-400"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Login
            </button>

            <div className="flex items-center justify-between pt-1 text-xs">
              <Link href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-gold-700">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to website
              </Link>
              <a href="mailto:eangleemarlian@gmail.com?subject=Forgot%20password%20-%20CBS%20Admin" className="text-slate-500 hover:text-gold-700">
                Forgot Password
              </a>
            </div>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by secure password hashing and server-side session management.
        </p>
      </div>
    </main>
  );
}