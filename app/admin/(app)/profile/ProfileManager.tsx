'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword, updateProfile } from '../../actions-users';
import { Alert, Card, Field, TextInput } from '@/components/admin/ui';

export default function ProfileManager({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [fname, setFname] = useState(name);
  const [femail, setFemail] = useState(email);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const saveProfile = async () => {
    const res = await updateProfile({ name: fname, email: femail });
    if (res.ok) { setProfileMsg('Profile updated.'); router.refresh(); } else setErr(res.error ?? 'Failed to update.');
  };

  const savePassword = async () => {
    setErr(null);
    if (next.length < 8) { setErr('New password must be at least 8 characters.'); return; }
    if (next !== confirm) { setErr('Passwords do not match.'); return; }
    const res = await changePassword({ current, next });
    if (res.ok) { setPwMsg('Password changed.'); setCurrent(''); setNext(''); setConfirm(''); } else setErr(res.error ?? 'Failed to change password.');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.7rem] font-bold uppercase tracking-hair text-gold-700">Account</p>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-navy-900 sm:text-3xl">Profile</h1>
      </div>

      <Card title="Profile details">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name"><TextInput value={fname} onChange={(e) => setFname(e.target.value)} /></Field>
          <Field label="Email"><TextInput type="email" value={femail} onChange={(e) => setFemail(e.target.value)} /></Field>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={saveProfile} className="rounded-md bg-gold-500 px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-hair text-navy-950 hover:bg-gold-400">
            Update profile
          </button>
        </div>
        {profileMsg && <div className="mt-4"><Alert tone="success">{profileMsg}</Alert></div>}
      </Card>

      <Card title="Change password">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Current password"><TextInput type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
          <Field label="New password" hint="min 8 characters"><TextInput type="password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
          <Field label="Confirm new password"><TextInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={savePassword} className="rounded-md bg-navy-900 px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-hair text-white hover:bg-navy-800">
            Change password
          </button>
        </div>
        {pwMsg && <div className="mt-4"><Alert tone="success">{pwMsg}</Alert></div>}
        {err && <div className="mt-4"><Alert tone="error">{err}</Alert></div>}
      </Card>
    </div>
  );
}