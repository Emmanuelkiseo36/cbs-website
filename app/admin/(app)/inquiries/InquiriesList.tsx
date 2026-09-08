'use client';

import { useRouter } from 'next/navigation';
import { deleteInquiry, setInquiryStatus } from '../../actions-inquiries';
import type { InquiryRow } from '@/lib/store';
import { Badge, Button, Card, PageHeader } from '@/components/admin/ui';
import { CheckCheck, Trash2 } from 'lucide-react';

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function InquiriesList({ inquiries }: { inquiries: InquiryRow[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Business"
        title="Inquiries"
        description="Messages submitted through the public contact form, straight from your database."
      />

      {inquiries.length === 0 ? (
        <Card><p className="text-sm text-slate-400">No inquiries yet — they will appear here automatically when someone fills the public contact form.</p></Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((q) => (
            <Card key={q.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-base font-extrabold uppercase tracking-tight text-navy-900">{q.name}</h2>
                    <Badge tone={q.status === 'new' ? 'green' : 'slate'}>{q.status}</Badge>
                    <span className="text-xs text-slate-400">{fmt(q.createdAt)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {q.phone && <span>Phone: {q.phone}</span>}
                    {q.email && <span>Email: {q.email}</span>}
                    {q.service && <span>Service: {q.service}</span>}
                    {q.cargo && <span>Cargo: {q.cargo}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {q.status === 'new' ? (
                    <Button variant="outline" onClick={async () => { await setInquiryStatus(q.id, 'read'); refresh(); }}>
                      <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Mark read
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={async () => { await setInquiryStatus(q.id, 'new'); refresh(); }}>
                      Mark new
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={async () => { if (confirm(`Delete inquiry from ${q.name}?`)) { await deleteInquiry(q.id); refresh(); } }}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-md bg-paper p-4 text-sm leading-relaxed text-ink-600">{q.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}