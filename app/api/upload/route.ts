import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { run } from '@/lib/db';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

const MAX_BYTES = 20 * 1024 * 1024;

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No file provided.' }, { status: 400 });
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: 'File type not allowed. Upload JPG, PNG, WebP, GIF, AVIF, MP4 or WebM.' },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'File exceeds the 20 MB limit.' }, { status: 400 });
  }

  const dir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), buffer);

  const url = `/uploads/${filename}`;
  const res = run(
    'INSERT INTO media (filename, original_name, type, ext, size, url) VALUES (?, ?, ?, ?, ?, ?)',
    filename,
    file.name,
    file.type,
    ext,
    file.size,
    url,
  );

  return NextResponse.json({
    ok: true,
    url,
    id: Number(res.lastInsertRowid),
    filename,
    size: file.size,
    type: file.type,
  });
}