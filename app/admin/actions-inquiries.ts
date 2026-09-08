'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { run } from '@/lib/db';

export type SaveResult = { ok: boolean; error?: string };

export async function setInquiryStatus(id: number, status: 'new' | 'read'): Promise<SaveResult> {
  try {
    await requireUser();
    run('UPDATE inquiries SET status = ? WHERE id = ?', status, id);
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/inquiries');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to update.' };
  }
}

export async function deleteInquiry(id: number): Promise<SaveResult> {
  try {
    await requireUser();
    run('DELETE FROM inquiries WHERE id = ?', id);
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/inquiries');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to delete.' };
  }
}