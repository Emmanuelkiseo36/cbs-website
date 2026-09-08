'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, deleteUser, updateUser } from '../../actions-users';
import type { AdminUserRecord } from '@/lib/store';
import { Alert, Badge, Button, Card, Field, Select, TextInput } from '@/components/admin/ui';
import { Pencil, Plus, Trash2, X } from 'lucide-react';

type Props = { users: AdminUserRecord[]; meId: number };

export default function UsersManager({ users, meId }: Props) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const [editing, setEditing] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const startEdit = (u: AdminUserRecord) => {
    setEditing(u.id); setName(u.name); setEmail(u.email); setRole(u.role); setPassword(''); setErr(null);
  };

  const submitEdit = async () => {
    if (!editing) return;
    const res = await updateUser(editing, { name, email, role, password });
    if (res.ok) { setEditing(null); setMsg('User updated.'); refresh(); } else setErr(res.error ?? 'Failed to update.');
  };

  const submitCreate = async () => {
    const res = await createUser({ name, email, role, password });
    if (res.ok) { setShowCreate(false); setName(''); setEmail(''); setRole('editor'); setPassword(''); setMsg('User created.'); refresh(); } else setErr(res.error ?? 'Failed to create.');
  };

  return (
    <div className="space-y-8">
      {/* also rendered header from page */}
      <Card
        title="Admin Users"
        description="People who can sign in to this dashboard. Admins can manage everything; editors can manage content."
        action={
          <Button onClick={() => { setShowCreate((v) => !v); setErr(null); }}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {showCreate ? 'Close' : 'Add user'}
          </Button>
        }
      >
        {showCreate && (
          <div className="mb-6 grid gap-4 rounded-md bg-paper p-4 sm:grid-cols-2">
            <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Email"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label="Role">
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </Select>
            </Field>
            <Field label="Password" hint="min 8 characters">
              <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={submitCreate}>Create user</Button>
            </div>
          </div>
        )}

        <ul className="divide-y divide-navy-900/5">
          {users.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20 font-display text-xs font-black text-gold-700">
                  {u.name.slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {u.name} {u.id === meId && <span className="text-xs font-normal text-slate-400">(you)</span>}
                  </p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={u.role === 'admin' ? 'gold' : 'slate'}>{u.role}</Badge>
                {editing === u.id ? (
                  <>
                    <Button variant="outline" onClick={() => setEditing(null)}><X className="h-3.5 w-3.5" aria-hidden="true" />Cancel</Button>
                    <Button onClick={submitEdit}>Save</Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => startEdit(u)}><Pencil className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                )}
                <Button
                  variant="danger"
                  disabled={u.id === meId}
                  aria-label={`Delete ${u.name}`}
                  onClick={async () => { if (confirm(`Delete ${u.name}?`)) { const res = await deleteUser(u.id); if (!res.ok) setErr(res.error ?? 'Failed to delete.'); else { setMsg('User deleted.'); refresh(); } } }}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {editing !== null && (
          <div className="mt-4 grid gap-4 rounded-md bg-paper p-4 sm:grid-cols-2">
            <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Email"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label="Role">
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </Select>
            </Field>
            <Field label="New password" hint="leave empty to keep current"><TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          </div>
        )}

        {msg && <div className="mt-4"><Alert tone="success">{msg}</Alert></div>}
        {err && <div className="mt-4"><Alert tone="error">{err}</Alert></div>}
      </Card>
    </div>
  );
}