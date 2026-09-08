import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getNewInquiryCount } from '@/lib/store';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin');

  const newInquiries = getNewInquiryCount();

  return (
    <AdminShell email={user.email} name={user.name} newInquiries={newInquiries}>
      {children}
    </AdminShell>
  );
}