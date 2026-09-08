'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { get, run } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';

export type SaveResult = { ok: boolean; error?: string };

function revalidateAdmin() {
  revalidatePath('/admin/users');
  revalidatePath('/admin/profile');
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<SaveResult> {
  try {
    await requireUser();
    if (input.password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };
    const email = input.email.trim().toLowerCase();
    const existing = get<{ id: number }>('SELECT id FROM users WHERE email = ?', email);
    if (existing) return { ok: false, error: 'A user with this email already exists.' };
    run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      input.name.trim(),
      email,
      hashPassword(input.password),
      input.role === 'admin' ? 'admin' : 'editor',
    );
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to create user.' };
  }
}

export async function updateUser(
  id: number,
  input: { name: string; email: string; role: string; password: string },
): Promise<SaveResult> {
  try {
    await requireUser();
    const email = input.email.trim().toLowerCase();
    const dup = get<{ id: number }>('SELECT id FROM users WHERE email = ? AND id != ?', email, id);
    if (dup) return { ok: false, error: 'A user with this email already exists.' };
    if (input.password && input.password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters.' };
    }
    if (input.password) {
      run(
        'UPDATE users SET name = ?, email = ?, role = ?, password_hash = ? WHERE id = ?',
        input.name.trim(),
        email,
        input.role === 'admin' ? 'admin' : 'editor',
        hashPassword(input.password),
        id,
      );
    } else {
      run(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        input.name.trim(),
        email,
        input.role === 'admin' ? 'admin' : 'editor',
        id,
      );
    }
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to update user.' };
  }
}

export async function deleteUser(id: number): Promise<SaveResult> {
  try {
    await requireUser();
    const target = get<{ id: number }>('SELECT id FROM users WHERE id = ?', id);
    if (!target) return { ok: false, error: 'User not found.' };
    const adminCount = get<{ c: number }>('SELECT COUNT(*) AS c FROM users WHERE role = ?', 'admin');
    const targetRole = get<{ role: string }>('SELECT role FROM users WHERE id = ?', id)?.role;
    if (targetRole === 'admin' && Number(adminCount?.c) <= 1) {
      return { ok: false, error: 'You cannot delete the last admin account.' };
    }
    run('DELETE FROM users WHERE id = ?', id);
    run('DELETE FROM sessions WHERE user_id = ?', id);
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to delete user.' };
  }
}

export async function updateProfile(input: { name: string; email: string }): Promise<SaveResult> {
  try {
    const me = await requireUser();
    const email = input.email.trim().toLowerCase();
    const dup = get<{ id: number }>('SELECT id FROM users WHERE email = ? AND id != ?', email, me.id);
    if (dup) return { ok: false, error: 'A user with this email already exists.' };
    run('UPDATE users SET name = ?, email = ? WHERE id = ?', input.name.trim(), email, me.id);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to update profile.' };
  }
}

export async function changePassword(input: { current: string; next: string }): Promise<SaveResult> {
  try {
    const me = await requireUser();
    if (input.next.length < 8) return { ok: false, error: 'New password must be at least 8 characters.' };
    const row = get<{ password_hash: string }>('SELECT password_hash FROM users WHERE id = ?', me.id);
    if (!row || !verifyPassword(input.current, row.password_hash)) {
      return { ok: false, error: 'Current password is incorrect.' };
    }
    run('UPDATE users SET password_hash = ? WHERE id = ?', hashPassword(input.next), me.id);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to change password.' };
  }
}