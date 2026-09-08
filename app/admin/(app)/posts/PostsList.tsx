'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deletePost, setPostStatus } from '../../actions-posts';
import type { AdminPost } from '@/lib/store';
import { Badge, Button, Card, PageHeader } from '@/components/admin/ui';
import { Pencil, Plus, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';

const fmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function PostsList({ posts }: { posts: AdminPost[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const fmt = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Content"
        title="Posts & News"
        description="Manage the articles published on your /news page. Drafts stay offline until you publish them."
        action={
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New post
            </Button>
          </Link>
        }
      />

      {posts.length === 0 ? (
        <Card><p className="text-sm text-slate-400">No posts yet — create your first one.</p></Card>
      ) : (
        <Card>
          <ul className="divide-y divide-navy-900/5">
            {posts.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/posts/${p.id}/edit`} className="font-display text-base font-extrabold uppercase tracking-tight text-navy-900 hover:text-gold-700">
                      {p.title}
                    </Link>
                    <Badge tone={p.status === 'published' ? 'green' : 'slate'}>{p.status}</Badge>
                    {p.category && <Badge tone="gold">{p.category}</Badge>}
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    /{p.slug} · {fmt(p.publishedAt || p.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {p.status === 'published' && (
                    <Link href={`/posts/${p.slug}`} target="_blank" aria-label="View post" className="flex h-9 w-9 items-center justify-center rounded-md border border-navy-900/15 text-navy-700 hover:border-gold-500 hover:text-gold-700">
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={async () => { await setPostStatus(p.id, p.status === 'published' ? 'draft' : 'published'); refresh(); }}
                    className="flex h-9 items-center gap-1.5 rounded-md border border-navy-900/15 px-2.5 text-xs font-bold uppercase tracking-hair text-navy-700 hover:border-gold-500 hover:text-gold-700"
                  >
                    {p.status === 'published' ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {p.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link href={`/admin/posts/${p.id}/edit`} aria-label="Edit post" className="flex h-9 w-9 items-center justify-center rounded-md border border-navy-900/15 text-navy-700 hover:border-gold-500 hover:text-gold-700">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={async () => { if (confirm(`Delete "${p.title}"?`)) { await deletePost(p.id); refresh(); } }}
                    aria-label="Delete post"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-navy-900/15 text-navy-700 hover:border-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}