import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { get, run } from './db';

export const SESSION_COOKIE = 'cbs_session';
export function sessionTtlMs(): number {
  const row = get<{ value: string }>('SELECT value FROM settings WHERE key = ?', 'session_ttl_hours');
  const hours = Number(row?.value ?? 120);
  return hours * 60 * 60 * 1000;
}

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString('hex');
  const tokenHash = sha256(token);
  const now = Date.now();
  const ttl = sessionTtlMs();
  run(
    'INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)',
    tokenHash,
    userId,
    now + ttl,
    now,
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(ttl / 1000),
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    run('DELETE FROM sessions WHERE token_hash = ?', sha256(token));
  }
  store.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<AdminUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = sha256(token);
  const row = get<{ userId: number }>('SELECT user_id AS userId FROM sessions WHERE token_hash = ? AND expires_at > ?', tokenHash, Date.now());
  if (!row) {
    store.delete(SESSION_COOKIE);
    return null;
  }

  const user = get<AdminUser>('SELECT id, name, email, role FROM users WHERE id = ?', row.userId);
  if (!user) {
    run('DELETE FROM sessions WHERE token_hash = ?', tokenHash);
    return null;
  }

  const ttl = sessionTtlMs();
  const remaining = get<{ expires_at: number }>('SELECT expires_at FROM sessions WHERE token_hash = ?', tokenHash);
  if (remaining && remaining.expires_at - Date.now() < ttl / 2) {
    run('UPDATE sessions SET expires_at = ? WHERE token_hash = ?', Date.now() + ttl, tokenHash);
  }

  return user;
}

export async function requireUser(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}