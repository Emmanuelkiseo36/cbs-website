import Link from 'next/link';
import { getDashboardStats, getInquiries, getAdminPosts } from '@/lib/store';
import { Badge, Card, PageHeader } from '@/components/admin/ui';
import { ArrowUpRight, FileText, Inbox, Newspaper, Settings, Wrench } from 'lucide-react';

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recentInquiries = getInquiries().slice(0, 5);
  const recentPosts = getAdminPosts().slice(0, 5);

  const cards = [
    { label: 'Published Posts', value: stats.publishedPosts, icon: Newspaper, href: '/admin/posts', tone: 'text-gold-700 bg-gold-500/10' },
    { label: 'Services', value: stats.services, icon: Wrench, href: '/admin/services', tone: 'text-navy-700 bg-navy-900/10' },
    { label: 'New Inquiries', value: stats.newInquiries, icon: Inbox, href: '/admin/inquiries', tone: 'text-emerald-700 bg-emerald-500/10' },
    { label: 'Media Files', value: stats.media, icon: Settings, href: '/admin/media', tone: 'text-purple-700 bg-purple-500/10' },
  ];

  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Dashboard"
        title="Overview"
        description="A live summary of your content and business activity — values here reflect your actual database."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group rounded-lg border border-navy-900/10 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(7,26,46,0.25)] transition-shadow hover:shadow-[0_16px_40px_-20px_rgba(7,26,46,0.4)]"
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${c.tone}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-gold-600" aria-hidden="true" />
              </div>
              <p className="mt-5 font-display text-4xl font-black tabular-nums text-navy-900">{c.value}</p>
              <p className="mt-1 text-[0.72rem] font-bold uppercase tracking-hair text-slate-500">{c.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent Inquiries" action={<Link href="/admin/inquiries" className="text-xs font-bold text-gold-700 hover:underline">View all</Link>}>
          <div className="divide-y divide-navy-900/5">
            {recentInquiries.length === 0 && <p className="py-6 text-sm text-slate-400">No inquiries yet.</p>}
            {recentInquiries.map((q) => (
              <div key={q.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-900">{q.name}</p>
                  <p className="truncate text-xs text-slate-500">{q.service || 'General'} · {fmtDate(q.createdAt)}</p>
                </div>
                <Badge tone={q.status === 'new' ? 'green' : 'slate'}>{q.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Posts" action={<Link href="/admin/posts" className="text-xs font-bold text-gold-700 hover:underline">Manage</Link>}>
          <div className="divide-y divide-navy-900/5">
            {recentPosts.length === 0 && <p className="py-6 text-sm text-slate-400">No posts yet.</p>}
            {recentPosts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-900">{p.title}</p>
                  <p className="truncate text-xs text-slate-500">{p.category} · {fmtDate(p.publishedAt || p.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={p.status === 'published' ? 'green' : 'slate'}>{p.status}</Badge>
                  <Link href={`/admin/posts/${p.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-md border border-navy-900/15 text-navy-700 hover:border-gold-500 hover:text-gold-700">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}