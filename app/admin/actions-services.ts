'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { get, run } from '@/lib/db';

export type SaveResult = { ok: boolean; error?: string };
export type { AdminService } from '@/lib/store';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  let slug = base || 'service';
  let n = 1;
  while (true) {
    const row = get<{ id: number }>('SELECT id FROM services WHERE slug = ?', slug);
    if (!row || (excludeId !== undefined && Number(row.id) === excludeId)) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function createService(input: {
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  alt: string;
}): Promise<SaveResult & { id?: number }> {
  try {
    await requireUser();
    const slug = await uniqueSlug(slugify(input.title));
    const next = get<{ m: number | null }>('SELECT MAX(display_order) AS m FROM services');
    const order = (Number(next?.m ?? -1)) + 1;
    const res = run(
      `INSERT INTO services (title, slug, short_description, description, icon, image, alt, display_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      input.title.trim(),
      slug,
      input.shortDescription.trim(),
      input.description.trim(),
      input.icon,
      input.image,
      input.alt,
      order,
    );
    revalidatePath('/');
    revalidatePath('/admin/services');
    return { ok: true, id: Number(res.lastInsertRowid) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to create service.' };
  }
}

export async function updateService(
  id: number,
  input: {
    title: string;
    shortDescription: string;
    description: string;
    icon: string;
    image: string;
    alt: string;
    displayOrder: number;
    published: boolean;
  },
): Promise<SaveResult> {
  try {
    await requireUser();
    const slug = await uniqueSlug(slugify(input.title), id);
    run(
      `UPDATE services SET title = ?, slug = ?, short_description = ?, description = ?, icon = ?, image = ?, alt = ?, display_order = ?, published = ? WHERE id = ?`,
      input.title.trim(),
      slug,
      input.shortDescription.trim(),
      input.description.trim(),
      input.icon,
      input.image,
      input.alt,
      Number(input.displayOrder),
      input.published ? 1 : 0,
      id,
    );
    revalidatePath('/');
    revalidatePath('/admin/services');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to save service.' };
  }
}

export async function toggleServicePublished(id: number, published: boolean): Promise<SaveResult> {
  try {
    await requireUser();
    run('UPDATE services SET published = ? WHERE id = ?', published ? 1 : 0, id);
    revalidatePath('/');
    revalidatePath('/admin/services');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to update.' };
  }
}

export async function reorderServices(ids: number[]): Promise<SaveResult> {
  try {
    await requireUser();
    ids.forEach((id, i) => {
      run('UPDATE services SET display_order = ?, updated_at = datetime(\'now\') WHERE id = ?', i, id);
    });
    revalidatePath('/');
    revalidatePath('/admin/services');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to reorder.' };
  }
}

export async function deleteService(id: number): Promise<SaveResult> {
  try {
    await requireUser();
    run('DELETE FROM services WHERE id = ?', id);
    revalidatePath('/');
    revalidatePath('/admin/services');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to delete.' };
  }
}