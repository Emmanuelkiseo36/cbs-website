'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { saveSection, saveWhyCbs, type SectionPayload, type WhyValuePayload } from '../../actions-content';
import { Alert, Card, Field, ImageInput, PageHeader, Select, SubmitButton, TextArea, TextInput } from '@/components/admin/ui';

type Props = {
  sections: Record<string, SectionPayload & {
    whyValues?: WhyValuePayload[];
  }>;
  media: { id: number; url: string; filename: string }[];
};

type FormState = { ok?: boolean; error?: string };

const initialState: FormState = {};

function SectionEditor({
  title,
  description,
  initial,
  media,
  sectionKey,
  fields,
  onSaved,
}: {
  title: string;
  description: string;
  initial: SectionPayload & { whyValues?: WhyValuePayload[] };
  media: Props['media'];
  sectionKey: string;
  fields: string[];
  onSaved: () => void;
}) {
  const [heading, setHeading] = useState(initial?.heading ?? '');
  const [subheading, setSubheading] = useState(initial?.subheading ?? '');
  const [desc, setDesc] = useState(initial?.description ?? '');
  const [cta, setCta] = useState(initial?.ctaText ?? '');
  const [ctaUrl, setCtaUrl] = useState(initial?.ctaUrl ?? '');
  const [cta2, setCta2] = useState(initial?.cta2Text ?? '');
  const [cta2Url, setCta2Url] = useState(initial?.cta2Url ?? '');
  const [image, setImage] = useState(initial?.image ?? '');

  const [state, formAction] = useActionState(
    async (_: FormState) => {
      const res = await saveSection(sectionKey, {
        heading,
        subheading,
        description: desc,
        ctaText: cta,
        ctaUrl,
        cta2Text: cta2,
        cta2Url,
        image,
      });
      if (res.ok) onSaved();
      return res;
    },
    initialState,
  );

  return (
    <Card title={title} description={description}>
      <form action={formAction} className="space-y-5">
        {fields.includes('heading') && (
          <Field label="Heading">
            <TextInput value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Section heading" />
          </Field>
        )}
        {fields.includes('subheading') && (
          <Field label="Subheading">
            <TextInput value={subheading} onChange={(e) => setSubheading(e.target.value)} placeholder="Short subheading (optional)" />
          </Field>
        )}
        {fields.includes('description') && (
          <Field label="Description">
            <TextArea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Section description" />
          </Field>
        )}
        {fields.includes('cta') && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Primary CTA text">
              <TextInput value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Button label" />
            </Field>
            <Field label="Primary CTA URL">
              <TextInput value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="#contact or /page" />
            </Field>
            <Field label="Secondary CTA text">
              <TextInput value={cta2} onChange={(e) => setCta2(e.target.value)} placeholder="Button label" />
            </Field>
            <Field label="Secondary CTA URL">
              <TextInput value={cta2Url} onChange={(e) => setCta2Url(e.target.value)} placeholder="#services or /page" />
            </Field>
          </div>
        )}
        {fields.includes('image') && (
          <Field label="Background / feature image" hint="paste a path or pick from the media library">
            <ImageInput value={image} onChange={setImage} />
            <div className="mt-2">
              <MediaPickLabel />
              <Select value={image} onChange={(e) => setImage(e.target.value)} className="mt-1">
                <option value="">Keep current image</option>
                {media.map((m) => (
                  <option key={m.id} value={m.url}>{m.filename}</option>
                ))}
              </Select>
            </div>
          </Field>
        )}
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className="text-xs text-slate-400">Changes publish to the homepage automatically.</span>
          <SubmitButton>Save &amp; Publish</SubmitButton>
        </div>
        {state.ok && <Alert tone="success">Saved and published.</Alert>}
        {state.error && <Alert tone="error">{state.error}</Alert>}
      </form>
    </Card>
  );
}

function MediaPickLabel() {
  return <span className="text-[0.7rem] font-bold uppercase tracking-hair text-navy-900">Or pick from library</span>;
}

function WhyCbsEditor({ initial, media, onSaved }: { initial: SectionPayload & { whyValues?: WhyValuePayload[] }; media: Props['media']; onSaved: () => void }) {
  const [heading, setHeading] = useState(initial?.heading ?? '');
  const [desc, setDesc] = useState(initial?.description ?? '');
  const [rows, setRows] = useState<WhyValuePayload[]>(initial?.whyValues ?? []);

  const [state, formAction] = useActionState(
    async (_: FormState) => {
      const res = await saveWhyCbs({ heading, description: desc, values: rows });
      if (res.ok) onSaved();
      return res;
    },
    initialState,
  );

  const setRow = (i: number, key: keyof WhyValuePayload, value: string) => {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  };

  return (
    <Card title="Why CBS — Individual Advantages" description="Edit the heading, description and the list of advantage cards.">
      <form action={formAction} className="space-y-5">
        <Field label="Heading">
          <TextInput value={heading} onChange={(e) => setHeading(e.target.value)} />
        </Field>
        <Field label="Description">
          <TextArea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Field>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] font-bold uppercase tracking-hair text-navy-900">Advantages</span>
            <button
              type="button"
              onClick={() => setRows((rs) => [...rs, { title: '', description: '', icon: 'shield-check' }])}
              className="text-xs font-bold text-gold-700 hover:underline"
            >
              + Add advantage
            </button>
          </div>
          {rows.map((row, i) => (
            <div key={i} className="grid gap-3 rounded-md border border-navy-900/10 bg-paper p-3 sm:grid-cols-[1fr_1.5fr_auto]">
              <input
                value={row.title}
                onChange={(e) => setRow(i, 'title', e.target.value)}
                placeholder="Title"
                className="w-full rounded border border-navy-900/15 bg-white px-3 py-2 text-sm"
              />
              <input
                value={row.description}
                onChange={(e) => setRow(i, 'description', e.target.value)}
                placeholder="Description"
                className="w-full rounded border border-navy-900/15 bg-white px-3 py-2 text-sm"
              />
              <div className="flex items-center gap-2">
                <Select value={row.icon} onChange={(e) => setRow(i, 'icon', e.target.value)}>
                  {['shield-check', 'anchor', 'target', 'gem', 'heart-handshake', 'badge-check', 'clock', 'globe'].map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </Select>
                <button type="button" onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))} className="text-xs text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="text-xs text-slate-400">No advantages yet — add one above.</p>}
        </div>

        <SubmitButton>Save &amp; Publish</SubmitButton>
        {state.ok && <Alert tone="success">Saved and published.</Alert>}
        {state.error && <Alert tone="error">{state.error}</Alert>}
      </form>
    </Card>
  );
}

const EDITORS: { key: string; title: string; description: string; fields: string[] }[] = [
  { key: 'hero', title: 'Hero', description: 'Main headline, subheading, CTAs and background image.', fields: ['heading', 'subheading', 'description', 'cta', 'image'] },
  { key: 'intro', title: 'Introduction', description: 'The statement below the hero.', fields: ['heading', 'description'] },
  { key: 'services-heading', title: 'Services Section', description: 'Heading and intro for the services list.', fields: ['heading', 'description'] },
  { key: 'cta', title: 'CTA Section', description: 'The closing call-to-action block.', fields: ['heading', 'description', 'cta', 'image'] },
];

export default function PagesManager({ sections, media }: Props) {
  return (
    <div className="grid gap-6">
        {EDITORS.map((e) => (
          <SectionEditor
            key={e.key}
            title={e.title}
            description={e.description}
            initial={sections[e.key] ?? {}}
            media={media}
            sectionKey={e.key}
            fields={e.fields}
            onSaved={() => void 0}
          />
        ))}
        <WhyCbsEditor initial={sections['why-cbs'] ?? {}} media={media} onSaved={() => void 0} />
    </div>
  );
}