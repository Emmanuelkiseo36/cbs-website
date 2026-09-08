import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, User, Tag } from 'lucide-react';
import { getPostBySlug, getPostById, getPublicPosts, getSettings } from '@/lib/store';
import { renderMarkdown } from '@/lib/markdown';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const full = getPostById(slug) ?? getPostBySlug(slug);
  if (!full) return { title: 'Post not found' };
  const seoDescription = 'seoDescription' in full ? full.seoDescription : undefined;
  return {
    title: `${full.title} — ${full.category || 'News'} | Customs Brokerage Services`,
    description: full.excerpt || seoDescription || undefined,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const s = getSettings();
  const recent = getPublicPosts().filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <header className="relative overflow-hidden bg-navy-950 pb-16 pt-40">
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div className="container-site relative max-w-4xl">
          <Link href="/news" className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-hair text-gold-300 hover:text-gold-200">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to news
          </Link>
          {post.category && (
            <span className="mt-6 block text-[0.72rem] font-bold uppercase tracking-hair text-gold-300">{post.category}</span>
          )}
          <h1 className="mt-4 font-display text-[clamp(1.9rem,5vw,3.4rem)] font-black uppercase leading-[1.05] tracking-tight text-white text-balance">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-gold-400" aria-hidden="true" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold-400" aria-hidden="true" />
              {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      <section className="bg-paper">
        <div className="container-site max-w-4xl">
          {post.image && (
            <div className="relative -mt-10 aspect-[16/8] overflow-hidden rounded-lg shadow-xl">
              <Image src={post.image} alt={post.title} fill sizes="(max-width: 900px) 100vw, 900px" className="object-cover" />
            </div>
          )}

          <article className="mt-10 pb-16">
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content || '<p></p>') }}
            />
            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-navy-900/10 pt-6">
                <Tag className="h-4 w-4 text-gold-700" aria-hidden="true" />
                {post.tags.map((t) => (
                  <span key={t} className="rounded-md bg-navy-900/5 px-3 py-1 text-xs font-medium text-navy-700">{t}</span>
                ))}
              </div>
            )}
          </article>

          {recent.length > 0 && (
            <div className="border-t border-navy-900/10 py-14">
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-navy-900">Latest from CBS</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {recent.map((r) => (
                  <Link key={r.id} href={`/posts/${r.slug}`} className="group rounded-lg border border-navy-900/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <span className="text-[0.68rem] font-bold uppercase tracking-hair text-gold-700">{r.category || 'News'}</span>
                    <h3 className="mt-2 font-display text-sm font-extrabold uppercase leading-snug tracking-tight text-navy-900 group-hover:text-gold-700">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}