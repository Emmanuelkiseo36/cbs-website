'use server';

import { run } from '@/lib/db';

export type SubmitInquiryState = { ok?: boolean; error?: string; emailHref?: string };

export async function submitInquiry(
  _prev: SubmitInquiryState,
  formData: FormData,
): Promise<SubmitInquiryState> {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const service = String(formData.get('service') ?? '').trim();
  const cargo = String(formData.get('cargo') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (name.length < 2) return { error: 'Please enter your full name.' };
  if (phone.length > 0 && !/^[+\d][\d\s()-]{5,20}$/.test(phone)) {
    return { error: 'Please enter a valid phone number or leave it empty.' };
  }
  if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address or leave it empty.' };
  }
  if (message.length < 5) return { error: 'Please describe how we can help.' };

  run(
    'INSERT INTO inquiries (name, phone, email, service, cargo, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    name,
    phone,
    email,
    service,
    cargo,
    message,
    'new',
  );

  return {
    ok: true,
    emailHref: email
      ? `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
          `Inquiry from ${name} — ${service || 'General'}`,
        )}&body=${encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nService: ${service}\nCargo: ${cargo}\n\n${message}`)}`
      : undefined,
  };
}