'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMedia } from '../../actions-media';
import type { MediaRow } from '@/lib/store';
import { Alert, Card, MediaThumb, PageHeader, TextInput } from '@/components/admin/ui';
import { Copy, Trash2, Search } from 'lucide-react';

export default function MediaManager({ media }: { media: MediaRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const doc = (f: File) => {
    setMsg(null); setErr(null); setBusy(true);
    void (async () => {
      const fd = new FormData();
      fd.append('file', f);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = (await res.json()) as { ok: boolean; url?: string; error?: string };
      setBusy(false);
      if (json.ok) {
        setMsg(`Uploaded ${f.name}`);
        router.refresh();
      } else {
        setErr(json.error ?? 'Upload failed.');
      }
    })();
  };

  const filtered = media.filter((m) => m.filename.toLowerCase().includes(query.toLowerCase()));

  const fmtSize = (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMsg(`Copied ${url}`);
    } catch {
      setMsg(url);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Content"
        title="Media Library"
        description="Upload images and videos, preview them, and copy URLs to use in services, posts and page content. Files up to 20 MB (JPG, PNG, WebP, GIF, AVIF, MP4, WebM)."
      />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…" className="pl-9" />
          </div>
          <button
            type="button"
            onClick={() => document.getElementById('media-input')?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-hair text-white hover:bg-navy-800 disabled:opacity-50"
          >
            {busy ? 'Uploading…' : 'Upload files'}
          </button>
          <input
            id="media-input"
            type="file"
            multiple
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm"
            onChange={(e) => e.target.files && Array.from(e.target.files).forEach(doc)}
          />
        </div>

        {msg && <div className="mt-4"><Alert tone="success">{msg}</Alert></div>}
        {err && <div className="mt-4"><Alert tone="error">{err}</Alert></div>}

        <div className="mt-6">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No media found{query ? ` for “${query}”` : ' — upload your first file above.'}</p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((m) => (
                <li key={m.id} className="group overflow-hidden rounded-lg border border-navy-900/10 bg-white shadow-sm">
                  <MediaThumb url={m.url} />
                  <div className="p-3">
                    <p className="truncate text-xs font-semibold text-navy-900" title={m.filename}>{m.filename}</p>
                    <p className="mt-1 text-[0.68rem] text-slate-500">
                      {m.type} · {fmtSize(m.size)}
                    </p>
                    <p className="text-[0.68rem] text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <button type="button" onClick={() => copyUrl(m.url)} aria-label={`Copy ${m.filename} URL`} className="rounded p-1.5 text-navy-700 hover:bg-gold-500/10 hover:text-gold-700">
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <a href={m.url} target="_blank" rel="noreferrer" className="ml-1 text-[0.68rem] font-bold uppercase tracking-hair text-gold-700 hover:underline">Open</a>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Delete ${m.filename}?`)) {
                            await deleteMedia(m.id, m.url);
                            router.refresh();
                          }
                        }}
                        aria-label={`Delete ${m.filename}`}
                        className="ml-auto rounded p-1.5 text-navy-700 hover:bg-red-500/10 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}