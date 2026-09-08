'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '../../actions-posts';
import type { AdminPost } from '@/lib/store';
import { renderMarkdown } from '@/lib/markdown';
import { Alert, Button, Card, Field, ImageInput, Select, SubmitButton, TextArea, TextInput } from '@/components/admin/ui';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2, Quote, Code, Eye, PencilLine } from 'lucide-react';

type Props = { post: AdminPost | null; media: { id: number; url: string; filename: string }[] };

const EMPTY: AdminPost = {
  id: 0,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  author: 'CBS',
  image: '',
  tags: [],
  tagsRaw: '',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
  publishedAt: '',
  createdAt: '',
  updatedAt: '',
};

function wrapSelection(textarea: HTMLTextAreaElement | null, before: string, after = before): string {
  if (!textarea) return '';
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  return value.slice(0, start) + before + value.slice(start, end) + after + value.slice(end);
}

export default function PostEditor({ post, media }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(() => (post ? { ...post, tagsRaw: post.tagsRaw } : { ...EMPTY }));
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof AdminPost>(key: K, value: AdminPost[K]) => setForm((f) => ({ ...f, [key]: value }));

  const insert = (before: string, after?: string) => {
    const merged = wrapSelection(contentRef.current, before, after);
    if (merged) set('content', merged);
  };

  const save = async (status: 'published' | 'draft') => {
    if (!form.title.trim()) {
      setError('Please enter a title.');
      return;
    }
    setBusy(true);
    setError(null);
    const common = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      author: form.author,
      image: form.image,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      status,
    };
    const res = form.id
      ? await updatePost(form.id, { ...common, tagsRaw: form.tagsRaw })
      : await createPost({ ...common, tags: form.tagsRaw });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? 'Failed to save.');
      return;
    }
    if (form.id) {
      router.refresh();
    } else if (res && 'id' in res && res.id) {
      router.replace(`/admin/posts/${res.id}/edit`);
      router.refresh();
    }
  };

  const toolbar = [
    { icon: Bold, label: 'Bold', action: () => insert('**') },
    { icon: Italic, label: 'Italic', action: () => insert('*') },
    { icon: Heading2, label: 'Heading', action: () => insert('## ') },
    { icon: List, label: 'Bullet list', action: () => insert('\n- ') },
    { icon: ListOrdered, label: 'Numbered list', action: () => insert('\n1. ') },
    { icon: Quote, label: 'Quote', action: () => insert('\n> ') },
    { icon: Code, label: 'Inline code', action: () => insert('`') },
    { icon: LinkIcon, label: 'Link', action: () => insert('[text](https://)') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-hair text-gold-700">{post ? 'Edit' : 'New'} post</p>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight text-navy-900">
            {post ? post.title || 'Untitled' : 'New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => void save('draft')} disabled={busy}>
            {form.status === 'draft' ? 'Save draft' : 'Save as draft'}
          </Button>
          <Button onClick={() => void save('published')} disabled={busy}>
            {busy ? 'Saving…' : form.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <Card>
        <div className="grid gap-5">
          <Field label="Title">
            <TextInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Post title" />
          </Field>
          <Field label="Excerpt" hint="shown on the /news listing">
            <TextArea rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary of the article" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Category">
              <TextInput value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Customs, Trade" />
            </Field>
            <Field label="Author">
              <TextInput value={form.author} onChange={(e) => set('author', e.target.value)} />
            </Field>
            <Field label="Tags" hint="comma separated">
              <TextInput value={form.tagsRaw} onChange={(e) => set('tagsRaw', e.target.value)} placeholder="imports, customs" />
            </Field>
          </div>
          <Field label="Featured image" hint="paste path or pick from library">
            <ImageInput value={form.image} onChange={(v) => set('image', v)} />
            <div className="mt-2">
              <Select value={form.image} onChange={(e) => set('image', e.target.value)}>
                <option value="">Choose from library…</option>
                {media.map((m) => (
                  <option key={m.id} value={m.url}>{m.filename}</option>
                ))}
              </Select>
            </div>
          </Field>
        </div>
      </Card>

      <Card
        title="Content"
        description="Markdown supported — use the toolbar or type directly. Preview shows the live result."
        action={
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="inline-flex items-center gap-2 rounded-md border border-navy-900/15 px-3 py-1.5 text-xs font-bold uppercase tracking-hair text-navy-700 hover:border-gold-500 hover:text-gold-700"
          >
            {preview ? <PencilLine className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
            {preview ? 'Edit' : 'Preview'}
          </button>
        }
      >
        {!preview && (
          <>
            <div className="-mx-6 -mt-6 mb-4 flex items-center gap-1 overflow-x-auto border-b border-navy-900/10 px-6 py-2">
              {toolbar.map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.label} type="button" onClick={t.action} aria-label={t.label} className="rounded-md p-2 text-navy-700 hover:bg-gold-500/10 hover:text-gold-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
            <TextArea
              ref={contentRef}
              rows={16}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              className="font-mono text-[0.85rem] leading-relaxed"
              placeholder={'Start writing… Use # heading, **bold**, - lists, [link](url).\n\n## Introduction\n\n- first point\n- second point'}
            />
          </>
        )}
        {preview && (
          <div className="prose min-h-[24rem] rounded-md border border-navy-900/10 bg-paper p-6 text-[0.95rem] leading-relaxed text-ink-600" dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) }} />
        )}
      </Card>

      <Card title="SEO">
        <div className="grid gap-5">
          <Field label="SEO title" hint={`${form.seoTitle.length || 0} chars — aim for under 60`}>
            <TextInput value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} placeholder={form.title} />
          </Field>
          <Field label="SEO description" hint={`${form.seoDescription.length || 0} chars — aim for under 160`}>
            <TextArea rows={2} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} placeholder={form.excerpt} />
          </Field>
        </div>
      </Card>
    </div>
  );
}