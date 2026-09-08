import { getSessionUser } from '@/lib/auth';
import { getAdminUsers } from '@/lib/store';
import { PageHeader } from '@/components/admin/ui';
import UsersManager from './UsersManager';

export default async function AdminUsers() {
  const me = await getSessionUser();
  const users = getAdminUsers();
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="System"
        title="Admin Users"
        description="People who can sign in to this dashboard. Admins manage everything; editors manage content."
      />
      <UsersManager users={users} meId={me?.id ?? 0} />
    </div>
  );
}