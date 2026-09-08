import { getAdminServices, getMedia } from '@/lib/store';
import { PageHeader } from '@/components/admin/ui';
import ServicesManager from './ServicesManager';

export default function AdminServices() {
  const services = getAdminServices();
  const media = getMedia().map((m) => ({ id: m.id, url: m.url, filename: m.filename }));
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Content"
        title="Services"
        description="Add, edit, reorder, publish or unpublish the services shown on your public site."
      />
      <ServicesManager services={services} media={media} />
    </div>
  );
}