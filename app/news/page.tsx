import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { getPublicPosts, getSettings } from '@/lib/store';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  const s = getSettings();
  return {
    title: `News & Insights — ${s.name}`,
    description: `Latest customs, trade and logistics news and insights from ${s.name}, Dar es Salaam, Tanzania.`,
  };
}

export default function NewsPage() {
  const posts = getPublicPosts();
  const s = getSettings();

  return (
    <>
      <header className="relative overflow-hidden bg-navy-950 pb-20 pt-40">
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div className="container-site relative">
          <p className="flex items-center gap-4 text-[0.72rem] font-bold uppercase tracking-hair text-gold-300">
            <span className="h-px w-10 bg-gold-400" aria-hidden="true" />
            News & Insights
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.5rem)] font-black uppercase leading-[1.02] tracking-tight text-white">
            Trade, Customs & Logistics Updates
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300">
            Practical guidance and news for importers, exporters and anyone
            moving goods through Tanzanian ports.
          </p>
        </div>
      </header>

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-site">
          {posts.length === 0 ? (
            <p className="text-slate-500">No articles published yet. Check back soon.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-navy-900/10 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  {post.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-navy-900/5">
                      <span className="font-display text-xs font-black uppercase tracking-hair text-slate-400">{s.shortName}</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.category && (
                      <span className="text-[0.68rem] font-bold uppercase tracking-hair text-gold-700">{post.category}</span>
                    )}
                    <h2 className="mt-3 font-display text-lg font-extrabold uppercase leading-tight tracking-tight text-navy-900 group-hover:text-gold-700">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-navy-900/5 pt-4">
                      <span className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-hair text-navy-900 group-hover:text-gold-700">
                        Read
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}