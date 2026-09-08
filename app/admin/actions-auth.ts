'use server';

import { redirect } from 'next/navigation';
import { createSession, destroySession, getSessionUser } from '@/lib/auth';
import { get } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  const existing = await getSessionUser();
  if (existing) redirect('/admin/dashboard');

  const row = get<{ id: number; password_hash: string }>(
    'SELECT id, password_hash FROM users WHERE email = ?',
    email,
  );

  if (!row || !verifyPassword(password, row.password_hash)) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(Number(row.id));
  redirect('/admin/dashboard');
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/admin');
}