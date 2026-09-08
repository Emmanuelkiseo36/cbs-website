import { getSections, getMedia } from '@/lib/store';
import { PageHeader } from '@/components/admin/ui';
import PagesManager from './PagesManager';

export default function AdminPages() {
  const sections = getSections();
  const media = getMedia().map((m) => ({ id: m.id, url: m.url, filename: m.filename }));

  const props: Record<string, unknown> = {};
  for (const key of ['hero', 'intro', 'services-heading', 'why-cbs', 'cta']) {
    const s = sections[key];
    if (!s) continue;
    let whyValues: { title: string; description: string; icon: string }[] | undefined;
    if (key === 'why-cbs') {
      try {
        whyValues = JSON.parse(s.extra || '[]');
      } catch {
        whyValues = [];
      }
    }
    props[key] = { ...s, whyValues };
  }

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Content"
        title="Pages"
        description="Edit homepage content without touching code. Save → publishes live to the public site."
      />
      <div className="grid gap-6">
        <PagesManager sections={props as never} media={media} />
      </div>
    </div>
  );
}