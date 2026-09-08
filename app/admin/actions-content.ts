'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { run, get } from '@/lib/db';

export type SaveResult = { ok: boolean; error?: string };

export type SectionPayload = {
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  cta2Text: string;
  cta2Url: string;
  image: string;
};

function upsertSetting(key: string, value: string) {
  run(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value,
  );
}

export async function saveSection(
  sectionKey: string,
  payload: SectionPayload,
): Promise<SaveResult> {
  try {
    await requireUser();
    run(
      `INSERT INTO sections (section_key, heading, subheading, description, cta_text, cta_url, cta2_text, cta2_url, image, extra)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '')
       ON CONFLICT(section_key) DO UPDATE SET
         heading = excluded.heading,
         subheading = excluded.subheading,
         description = excluded.description,
         cta_text = excluded.cta_text,
         cta_url = excluded.cta_url,
         cta2_text = excluded.cta2_text,
         cta2_url = excluded.cta2_url,
         image = excluded.image`,
      sectionKey,
      payload.heading,
      payload.subheading,
      payload.description,
      payload.ctaText,
      payload.ctaUrl,
      payload.cta2Text,
      payload.cta2Url,
      payload.image,
    );
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to save.' };
  }
}

export type WhyValuePayload = { title: string; description: string; icon: string };

export async function saveWhyCbs(input: {
  heading: string;
  description: string;
  values: WhyValuePayload[];
}): Promise<SaveResult> {
  try {
    await requireUser();
    const values = input.values.filter((v) => v.title.trim() !== '');
    run(
      `INSERT INTO sections (section_key, heading, description, extra) VALUES ('why-cbs', ?, ?, ?)
       ON CONFLICT(section_key) DO UPDATE SET heading = excluded.heading, description = excluded.description, extra = excluded.extra`,
      input.heading,
      input.description,
      JSON.stringify(values),
    );
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to save.' };
  }
}

export async function saveSettings(fields: Record<string, string>): Promise<SaveResult> {
  try {
    await requireUser();

    const single: Record<string, string> = {
      site_name: fields.site_name ?? '',
      site_short_name: fields.site_short_name ?? '',
      slogan: fields.slogan ?? '',
      powered_by: fields.powered_by ?? '',
      phone_display: fields.phone_display ?? '',
      phone_number: fields.phone_number ?? '',
      whatsapp_number: fields.whatsapp_number ?? '',
      email: fields.email ?? '',
      location: fields.location ?? '',
      location_line: fields.location_line ?? '',
      business_description: fields.business_description ?? '',
      seo_title: fields.seo_title ?? '',
      seo_description: fields.seo_description ?? '',
      seo_keywords: fields.seo_keywords ?? '',
      session_ttl_hours: fields.session_ttl_hours ?? '120',
    };
    for (const [k, v] of Object.entries(single)) {
      upsertSetting(k, v);
    }

    const social = {
      facebook: fields.social_facebook ?? '',
      twitter: fields.social_twitter ?? '',
      linkedin: fields.social_linkedin ?? '',
      instagram: fields.social_instagram ?? '',
      youtube: fields.social_youtube ?? '',
    };
    upsertSetting('social', JSON.stringify(social));

    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to save.' };
  }
}

export async function getSettingValue(key: string): Promise<string> {
  await requireUser();
  const row = get<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
  return row?.value ?? '';
}