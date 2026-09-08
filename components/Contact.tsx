'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Globe2,
} from 'lucide-react';
import { useState, useActionState } from 'react';
import { SITE, SERVICE_OPTIONS } from '@/lib/data';
import { submitInquiry } from '@/app/actions/inquiries';
import type { SubmitInquiryState } from '@/app/actions/inquiries';
import type { SiteSettings } from '@/lib/store';
import { Reveal } from './ui/Reveal';

const inputClass =
  'w-full border border-navy-900/15 bg-white px-4 py-3.5 text-[0.95rem] text-navy-900 placeholder:text-slate-500/70 transition-colors focus:border-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500/25';

type FormData = {
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  cargo: string;
  message: string;
};

const initialData: FormData = {
  name: '',
  company: '',
  phone: '',
  email: '',
  service: '',
  cargo: '',
  message: '',
};

export default function Contact({
  content,
  serviceOptions,
  settings,
}: {
  content?: { heading?: string; description?: string };
  serviceOptions?: string[];
  settings: SiteSettings;
}) {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [serverState, formAction, pending] = useActionState<SubmitInquiryState, globalThis.FormData>(
    (_prev, fd) => submitInquiry(_prev, fd),
    { ok: false },
  );

  const phoneHref = `tel:${settings.phoneNumber}`;
  const emailHref = `mailto:${settings.email}`;
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}`;
  const options = serviceOptions && serviceOptions.length ? serviceOptions : SERVICE_OPTIONS;

  function update(field: keyof FormData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim()) next.name = 'Please enter your full name.';
    if (!data.service) next.service = 'Please select a service.';
    if (!data.message.trim()) next.message = 'Please describe your enquiry.';
    const contactProvided = data.phone.trim() || data.email.trim();
    if (!contactProvided)
      next.phone = 'Please provide a phone number or email.';
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      next.email = 'Please enter a valid email address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    fd.append('name', data.name.trim());
    fd.append('company', data.company.trim());
    fd.append('phone', data.phone.trim());
    fd.append('email', data.email.trim());
    fd.append('service', data.service);
    fd.append('cargo', data.cargo.trim());
    fd.append('message', data.message.trim());
    formAction(fd);
  }

  return (
    <section id="contact" className="relative bg-paper py-28 lg:py-40">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Info panel */}
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-gold-600" aria-hidden="true" />
                <span className="text-[0.72rem] font-bold uppercase tracking-hair text-gold-700">
                  06 — Contact
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-4xl font-black uppercase leading-[1.02] tracking-tight text-navy-900 text-balance sm:text-5xl">
                {content?.heading || 'Ready to Move Your Cargo Forward?'}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-600">
                {content?.description ||
                  'Whether you are importing, exporting, or need assistance with cargo declaration and customs documentation, CBS is ready to serve you.'}
              </p>
            </Reveal>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Reveal delay={0.2}>
                <a
                  href={phoneHref}
                  className="group inline-flex items-center justify-center gap-3 bg-navy-900 px-7 py-4 text-[0.78rem] font-bold uppercase tracking-hair text-white transition-colors duration-300 hover:bg-navy-800"
                >
                  <Phone className="h-4 w-4 text-gold-400" aria-hidden="true" />
                  Contact CBS
                </a>
              </Reveal>
              <Reveal delay={0.26}>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 border border-navy-900/20 bg-navy-900/5 px-7 py-4 text-[0.78rem] font-bold uppercase tracking-hair text-navy-900 transition-all duration-300 hover:border-gold-600 hover:text-gold-700"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp Us
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <div className="mt-12 space-y-5 border-t border-navy-900/10 pt-8">
                <a
                  href={phoneHref}
                  className="group flex items-center gap-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center border border-navy-900/15 text-navy-900 transition-colors group-hover:border-gold-600 group-hover:text-gold-700">
                    <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-hair text-slate-500">
                      Phone / WhatsApp
                    </span>
                    <span className="text-[0.95rem] font-semibold text-navy-900 tabular-nums">
                      {settings.phoneDisplay}
                    </span>
                  </span>
                </a>
                <a
                  href={emailHref}
                  className="group flex items-center gap-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center border border-navy-900/15 text-navy-900 transition-colors group-hover:border-gold-600 group-hover:text-gold-700">
                    <Mail className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-hair text-slate-500">
                      Email
                    </span>
                    <span className="text-[0.95rem] font-semibold text-navy-900">
                      {settings.email}
                    </span>
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center border border-navy-900/15 text-navy-900">
                    <MapPin className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-hair text-slate-500">
                      Location
                    </span>
                    <span className="text-[0.95rem] font-semibold text-navy-900">
                      {settings.location}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center border border-navy-900/15 text-navy-900">
                    <Globe2 className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-hair text-slate-500">
                      Service area
                    </span>
                    <span className="text-[0.95rem] font-semibold text-navy-900">
                      Port operations across Tanzania
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.12}>
            <div className="border-t-2 border-gold-500 bg-white p-7 shadow-[0_40px_80px_-50px_rgba(7,26,46,0.35)] sm:p-10">
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-navy-900">
                Request Customs Assistance
              </h3>
              <p className="mt-2 text-sm text-ink-600">
                Tell us about your cargo — we&apos;ll respond promptly.
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={data.name}
                      onChange={(e) => update('name', e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'err-name' : undefined}
                      className={inputClass}
                      placeholder="Jane Doe"
                    />
                    {errors.name && (
                      <p id="err-name" className="mt-1.5 text-xs text-red-600" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900"
                    >
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      value={data.company}
                      onChange={(e) => update('company', e.target.value)}
                      className={inputClass}
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900"
                    >
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={data.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'err-phone' : undefined}
                      className={inputClass}
                      placeholder="+255 7xx xxx xxx"
                    />
                    {errors.phone && (
                      <p id="err-phone" className="mt-1.5 text-xs text-red-600" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => update('email', e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'err-email' : undefined}
                      className={inputClass}
                      placeholder="you@company.com"
                    />
                    {errors.email && (
                      <p id="err-email" className="mt-1.5 text-xs text-red-600" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="service"
                      className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900"
                    >
                      Service Required *
                    </label>
                    <select
                      id="service"
                      value={data.service}
                      onChange={(e) => update('service', e.target.value)}
                      aria-invalid={!!errors.service}
                      aria-describedby={errors.service ? 'err-service' : undefined}
                      className={inputClass}
                    >
                      <option value="">Select a service…</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p id="err-service" className="mt-1.5 text-xs text-red-600" role="alert">
                        {errors.service}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="cargo"
                      className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900"
                    >
                      Cargo Type
                    </label>
                    <input
                      id="cargo"
                      type="text"
                      value={data.cargo}
                      onChange={(e) => update('cargo', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. General, electronics, textiles…"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-hair text-navy-900"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={data.message}
                    onChange={(e) => update('message', e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'err-message' : undefined}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your cargo, route, and what you need…"
                  />
                  {errors.message && (
                    <p id="err-message" className="mt-1.5 text-xs text-red-600" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={pending}
                    className="group inline-flex w-full items-center justify-center gap-3 bg-gold-500 px-7 py-4 text-[0.78rem] font-bold uppercase tracking-hair text-navy-950 transition-colors duration-300 hover:bg-gold-400 disabled:opacity-50 sm:w-auto"
                  >
                    {pending ? 'Sending…' : 'Send Inquiry'}
                    <Send
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {serverState?.ok
                      ? 'Thank you — your inquiry has been received. We will respond promptly.'
                      : serverState?.error
                        ? `Submission failed: ${serverState.error}`
                        : 'Your inquiry is sent straight to our database. We respond promptly.'}
                  </p>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}