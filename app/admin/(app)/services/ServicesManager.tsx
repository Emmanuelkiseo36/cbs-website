'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createService, updateService, deleteService, toggleServicePublished, reorderServices } from '../../actions-services';
import type { AdminService } from '@/lib/store';
import { Alert, Badge, Button, Card, Field, ImageInput, PageHeader, Select, TextArea, TextInput, Toggle } from '@/components/admin/ui';
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X } from 'lucide-react';

type Props = { services: AdminService[]; media: { id: number; url: string; filename: string }[] };

function ServiceRow({ service, media, onSave, onDelete, onToggle, onMove }: {
  service: AdminService;
  media: Props['media'];
  onSave: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(service.title);
  const [shortDescription, setShortDescription] = useState(service.shortDescription);
  const [description, setDescription] = useState(service.description);
  const [icon, setIcon] = useState(service.icon);
  const [image, setImage] = useState(service.image);
  const [alt, setAlt] = useState(service.alt);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const res = await updateService(service.id, {
      title,
      shortDescription,
      description,
      icon,
      image,
      alt,
      displayOrder: service.displayOrder,
      published: service.published === 1,
    });
    setBusy(false);
    if (res.ok) {
      setEdit(false);
      onSave();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="rounded-lg border border-navy-900/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <button type="button" onClick={() => onMove(-1)} aria-label="Move up" className="text-slate-400 hover:text-gold-700 disabled:opacity-30" disabled={service.displayOrder === 0}>
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onMove(1)} aria-label="Move down" className="text-slate-400 hover:text-gold-700">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display text-base font-extrabold uppercase tracking-tight text-navy-900">{service.title}</p>
            <Badge tone={service.published === 1 ? 'green' : 'slate'}>{service.published === 1 ? 'Published' : 'Unpublished'}</Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-500">/{service.slug} · order {service.displayOrder + 1}</p>
        </div>
        <div className="flex items-center gap-2">
          <Toggle checked={service.published === 1} onChange={onToggle} label="Published" />
          <Button variant="outline" onClick={() => setEdit((v) => !v)}>
            {edit ? <X className="h-3.5 w-3.5" aria-hidden="true" /> : <Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
            {edit ? 'Close' : 'Edit'}
          </Button>
          <Button variant="danger" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {edit && (
        <div className="mt-5 grid gap-4 border-t border-navy-900/10 pt-5 sm:grid-cols-2">
          <Field label="Title">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Icon" hint="icon name">
            <Select value={icon} onChange={(e) => setIcon(e.target.value)}>
              {['', 'shield-check', 'anchor', 'target', 'gem', 'heart-handshake', 'badge-check', 'clock', 'globe', 'scroll', 'file-check', 'ship'].map((i) => (
                <option key={i} value={i}>{i || 'None'}</option>
              ))}
            </Select>
          </Field>
          <Field label="Short description">
            <TextArea rows={2} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
          </Field>
          <Field label="Image" hint="paste path or pick from library">
            <ImageInput value={image} onChange={setImage} />
            <div className="mt-2">
              <Select value={image} onChange={(e) => setImage(e.target.value)}>
                <option value="">Keep current image</option>
                {media.map((m) => (
                  <option key={m.id} value={m.url}>{m.filename}</option>
                ))}
              </Select>
            </div>
          </Field>
          <Field label="Image alt text">
            <TextInput value={alt} onChange={(e) => setAlt(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Full description">
              <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save service'}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesManager({ services, media }: Props) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [image, setImage] = useState('');
  const [alt, setAlt] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = () => router.refresh();

  const move = async (id: number, dir: -1 | 1) => {
    const idx = services.findIndex((s) => s.id === id);
    const target = services[idx + dir];
    if (!target) return;
    const ids = services.map((s) => s.id);
    const i = ids.indexOf(id);
    ids.splice(i, 1);
    ids.splice(i + dir, 0, id);
    await reorderServices(ids);
    refresh();
  };

  const create = async () => {
    if (!title.trim()) return alert('Enter a title.');
    setBusy(true);
    const res = await createService({ title, shortDescription, description, icon, image, alt });
    setBusy(false);
    if (res.ok) {
      setShowCreate(false);
      setTitle(''); setShortDescription(''); setDescription(''); setIcon(''); setImage(''); setAlt('');
      refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Content"
        title="Services"
        description="Add, edit, reorder, publish or unpublish the services shown on your public site."
        action={
          <Button onClick={() => setShowCreate((v) => !v)}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {showCreate ? 'Close' : 'Add service'}
          </Button>
        }
      />

      {showCreate && (
        <Card title="New Service" description="The slug is generated automatically from the title.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Bonded Warehouse Supervision" />
            </Field>
            <Field label="Icon">
              <Select value={icon} onChange={(e) => setIcon(e.target.value)}>
                {['', 'shield-check', 'anchor', 'target', 'gem', 'heart-handshake', 'badge-check', 'clock', 'globe', 'scroll', 'file-check', 'ship'].map((i) => (
                  <option key={i} value={i}>{i || 'None'}</option>
                ))}
              </Select>
            </Field>
            <Field label="Short description">
              <TextArea rows={2} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
            </Field>
            <Field label="Image" hint="paste path or pick from library">
              <ImageInput value={image} onChange={setImage} />
            </Field>
            <Field label="Image alt text">
              <TextInput value={alt} onChange={(e) => setAlt(e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Full description">
                <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={create} disabled={busy}>{busy ? 'Creating…' : 'Create service'}</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {services.length === 0 && (
          <Card><p className="text-sm text-slate-400">No services yet — create your first one above.</p></Card>
        )}
        {services.map((s, index) => (
          <ServiceRow
            key={s.id}
            service={s}
            media={media}
            onSave={refresh}
            onDelete={async () => {
              if (confirm(`Delete "${s.title}"? This cannot be undone.`)) {
                await deleteService(s.id);
                refresh();
              }
            }}
            onToggle={async (v) => {
              await toggleServicePublished(s.id, v);
              refresh();
            }}
            onMove={(dir) => move(s.id, dir)}
          />
        ))}
      </div>
    </div>
  );
}