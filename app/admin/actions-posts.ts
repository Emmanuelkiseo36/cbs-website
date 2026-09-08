'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { get, run } from '@/lib/db';
import type { AdminPost } from '@/lib/store';

export type SaveResult = { ok: boolean; error?: string };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  let slug = base || 'post';
  let n = 1;
  while (true) {
    const row = get<{ id: number }>('SELECT id FROM posts WHERE slug = ?', slug);
    if (!row || (excludeId !== undefined && Number(row.id) === excludeId)) return slug;
    slug = `${base}-${n++}`;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function createPost(input: {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  status: string;
}): Promise<SaveResult & { id?: number }> {
  try {
    await requireUser();
    const slug = await uniqueSlug(slugify(input.title));
    const publishedAt = input.status === 'published' ? nowIso() : null;
    const res = run(
      `INSERT INTO posts (title, slug, excerpt, content, category, author, image, tags, seo_title, seo_description, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      input.title.trim(),
      slug,
      input.excerpt.trim(),
      input.content,
      input.category.trim(),
      input.author.trim() || 'CBS',
      input.image,
      input.tags,
      input.seoTitle,
      input.seoDescription,
      input.status === 'published' ? 'published' : 'draft',
      publishedAt,
    );
    revalidatePath('/news');
    revalidatePath('/');
    return { ok: true, id: Number(res.lastInsertRowid) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to create post.' };
  }
}

export async function updatePost(
  id: number,
  input: Partial<AdminPost> & {
    seoTitle: string;
    seoDescription: string;
  },
): Promise<SaveResult> {
  try {
    await requireUser();
    const current = get<{ status: string; published_at: string | null }>(
      'SELECT status, published_at FROM posts WHERE id = ?',
      id,
    );
    const slug = await uniqueSlug(slugify(input.title ?? ''), id);
    const targetStatus = input.status === 'published' ? 'published' : 'draft';
    const now = nowIso();
    const publishedAt = targetStatus === 'published' ? (current?.published_at ?? now) : (current?.published_at ?? null);

    run(
      `UPDATE posts SET
        title = ?, slug = ?, excerpt = ?, content = ?, category = ?, author = ?, image = ?,
        tags = ?, seo_title = ?, seo_description = ?, status = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
      input.title ?? '',
      slug,
      input.excerpt ?? '',
      input.content ?? '',
      input.category ?? '',
      input.author ?? 'CBS',
      input.image ?? '',
      input.tagsRaw ?? '',
      input.seoTitle ?? '',
      input.seoDescription ?? '',
      targetStatus,
      publishedAt,
      now,
      id,
    );
    revalidatePath('/news');
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to save post.' };
  }
}

export async function setPostStatus(id: number, status: string): Promise<SaveResult> {
  try {
    await requireUser();
    const target = status === 'published' ? 'published' : 'draft';
    const current = get<{ published_at: string | null }>('SELECT published_at FROM posts WHERE id = ?', id);
    run(
      'UPDATE posts SET status = ?, published_at = ?, updated_at = datetime(\'now\') WHERE id = ?',
      target,
      target === 'published' ? (current?.published_at ?? nowIso()) : (current?.published_at ?? null),
      id,
    );
    revalidatePath('/news');
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to update post.' };
  }
}

export async function deletePost(id: number): Promise<SaveResult> {
  try {
    await requireUser();
    run('DELETE FROM posts WHERE id = ?', id);
    revalidatePath('/news');
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to delete post.' };
  }
}