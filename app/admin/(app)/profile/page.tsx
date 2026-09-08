import { getSessionUser } from '@/lib/auth';
import ProfileManager from './ProfileManager';

export default async function AdminProfile() {
  const me = await getSessionUser();
  return (
    <ProfileManager key={me?.id} name={me?.name ?? ''} email={me?.email ?? ''} />
  );
}