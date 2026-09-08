'use client';

import { useMemo, useState } from 'react';
import { saveSettings } from '../../actions-content';
import type { SiteSettings } from '@/lib/store';
import { Alert, Card, Field, TextArea, TextInput } from '@/components/admin/ui';

type Props = { settings: SiteSettings };

export default function SettingsManager({ settings }: Props) {
  const [tab, setTab] = useState<'contact' | 'website' | 'seo'>('contact');
  const [form, setForm] = useState(() => settings);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const set = (key: keyof SiteSettings, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const setSocial = (key: string, value: string) => {
    setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));
  };

  const action = async () => {
    const res = await saveSettings({
      site_name: form.name,
      site_short_name: form.shortName,
      slogan: form.slogan,
      powered_by: form.poweredBy,
      phone_display: form.phoneDisplay,
      phone_number: form.phoneNumber,
      whatsapp_number: form.whatsappNumber,
      email: form.email,
      location: form.location,
      location_line: form.locationLine,
      business_description: form.businessDescription,
      seo_title: form.seoTitle,
      seo_description: form.seoDescription,
      seo_keywords: form.seoKeywords,
      session_ttl_hours: String(form.sessionTtlHours),
      social_facebook: form.social.facebook,
      social_twitter: form.social.twitter,
      social_linkedin: form.social.linkedin,
      social_instagram: form.social.instagram,
      social_youtube: form.social.youtube,
    });
    if (res.ok) setMsg('Settings saved. The public site now uses the new values.');
    else setErr(res.error ?? 'Failed to save.');
  };

  const tabs = useMemo(
    () => [
      { id: 'contact' as const, label: 'Contact Details' },
      { id: 'website' as const, label: 'Website' },
      { id: 'seo' as const, label: 'SEO' },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.7rem] font-bold uppercase tracking-hair text-gold-700">Settings</p>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-navy-900 sm:text-3xl">Website Settings</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
          Change your contact details, business info and SEO — the public site reads live from here. E.g. updating the WhatsApp number updates every WhatsApp button site-wide.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTab(t.id); setMsg(null); setErr(null); }}
            className={`shrink-0 rounded-md px-4 py-2 text-[0.72rem] font-bold uppercase tracking-hair transition-colors ${
              tab === t.id ? 'bg-navy-900 text-white' : 'border border-navy-900/15 text-navy-700 hover:border-gold-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {tab === 'contact' && (
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone — display" hint="as shown on the site">
                <TextInput value={form.phoneDisplay} onChange={(e) => set('phoneDisplay', e.target.value)} />
              </Field>
              <Field label="Phone — number" hint="digits only, with country code">
                <TextInput value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} placeholder="255798106766" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="WhatsApp number" hint="digits only, with country code">
                <TextInput value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="255798106766" />
              </Field>
              <Field label="Email">
                <TextInput value={form.email} onChange={(e) => set('email', e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Location">
                <TextInput value={form.location} onChange={(e) => set('location', e.target.value)} />
              </Field>
              <Field label="Location — short line" hint="used in the footer">
                <TextInput value={form.locationLine} onChange={(e) => set('locationLine', e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Business description">
                  <TextArea rows={3} value={form.businessDescription} onChange={(e) => set('businessDescription', e.target.value)} />
                </Field>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-hair text-navy-900">Social media links</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'] as const).map((k) => (
                  <Field key={k} label={k}>
                    <TextInput value={form.social[k]} onChange={(e) => setSocial(k, e.target.value)} placeholder={`https://…`} />
                  </Field>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <SaveCta onClick={action} />
            </div>
          </div>
        )}

        {tab === 'website' && (
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business name">
                <TextInput value={form.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="Short name" hint='shown as "CBS"'>
                <TextInput value={form.shortName} onChange={(e) => set('shortName', e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Slogan">
                <TextInput value={form.slogan} onChange={(e) => set('slogan', e.target.value)} />
              </Field>
              <Field label="Powered by">
                <TextInput value={form.poweredBy} onChange={(e) => set('poweredBy', e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Session expiry" hint="hours — how long an admin login lasts">
                <TextInput type="number" value={String(form.sessionTtlHours)} onChange={(e) => setForm((f) => ({ ...f, sessionTtlHours: Math.max(1, Number(e.target.value)) }))} />
              </Field>
            </div>
            <div className="flex justify-end">
              <SaveCta onClick={action} />
            </div>
          </div>
        )}

        {tab === 'seo' && (
          <div className="grid gap-5">
            <Field label="SEO title" hint={`${form.seoTitle.length || 0} chars`}>
              <TextInput value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
            </Field>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 8px' }} className="rounded-md border border-navy-900/10 bg-paper p-4 text-sm">
                <span className="text-navy-900 font-medium">{form.seoTitle || 'Your SEO title'}</span>
                <span className="text-emerald-700">{typeof window !== 'undefined' ? window.location.hostname : 'your-domain.com'}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Live Google-style preview.</p>
            </div>
            <Field label="SEO description" hint={`${form.seoDescription.length || 0} chars — aim for under 160`}>
              <TextArea rows={3} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
            </Field>
            <div>
              <div className="rounded-md border border-navy-900/10 bg-paper p-4 text-sm leading-relaxed text-ink-600">{form.seoDescription}</div>
            </div>
            <Field label="SEO keywords" hint="comma separated">
              <TextInput value={form.seoKeywords} onChange={(e) => set('seoKeywords', e.target.value)} />
            </Field>
            <div className="flex justify-end">
              <SaveCta onClick={action} />
            </div>
          </div>
        )}

        {msg && <div className="mt-4"><Alert tone="success">{msg}</Alert></div>}
        {err && <div className="mt-4"><Alert tone="error">{err}</Alert></div>}
      </Card>
    </div>
  );
}

function SaveCta({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-hair text-navy-950 transition-colors hover:bg-gold-400"
    >
      Save Settings
    </button>
  );
}