'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { run } from '@/lib/db';
import fs from 'node:fs';
import path from 'node:path';

export type SaveResult = { ok: boolean; error?: string };

export async function deleteMedia(id: number, url: string): Promise<SaveResult> {
  try {
    await requireUser();
    run('DELETE FROM media WHERE id = ?', id);
    const safe = url.replace(/^\/uploads\//, '');
    const filePath = path.join(process.cwd(), 'public', 'uploads', safe);
    if (safe && !safe.includes('..') && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    revalidatePath('/admin/media');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to delete file.' };
  }
}