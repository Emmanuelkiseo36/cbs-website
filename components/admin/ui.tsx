'use client';

import { useFormStatus } from 'react-dom';
import type { ReactNode, Ref, TextareaHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Upload } from 'lucide-react';

export const inputCls =
  'w-full rounded-md border border-navy-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-colors';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[0.7rem] font-bold uppercase tracking-hair text-navy-900">{label}</span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  return <textarea {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'outline' }) {
  const variants: Record<string, string> = {
    primary: 'bg-gold-500 text-navy-950 hover:bg-gold-400',
    outline: 'border border-navy-900/20 text-navy-900 hover:border-gold-500 hover:text-gold-700',
    ghost: 'text-navy-700 hover:bg-navy-900/5',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-hair transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  );
}

export function SubmitButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? 'Saving…' : children}
    </Button>
  );
}

export function Card({ title, description, children, action }: { title?: string; description?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-navy-900/10 bg-white shadow-[0_10px_30px_-18px_rgba(7,26,46,0.25)]">
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-navy-900/5 px-6 py-4">
          <div>
            {title && <h2 className="font-display text-base font-extrabold uppercase tracking-tight text-navy-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function PageHeader({ kicker, title, description, action }: { kicker: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[0.7rem] font-bold uppercase tracking-hair text-gold-700">{kicker}</p>
        <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'green' | 'red' | 'slate' }) {
  const tones: Record<string, string> = {
    gold: 'bg-gold-500/15 text-gold-700 border-gold-500/30',
    green: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    red: 'bg-red-500/10 text-red-600 border-red-500/30',
    slate: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-hair ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ${checked ? 'bg-gold-500' : 'bg-navy-900/20'}`}
    >
      <span className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

export function MediaPicker({ value, onChange, media }: { value: string; onChange: (v: string) => void; media: { id: number; url: string; filename: string }[] }) {
  if (media.length === 0) {
    return <div className="text-xs text-slate-400">No media yet — upload files in the Media section.</div>;
  }
  return (
    <div className="space-y-2">
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Set from library…</option>
        {media.map((m) => (
          <option key={m.id} value={m.url}>
            {m.filename}
          </option>
        ))}
      </Select>
      {value && (
        <div className="flex items-center gap-3 rounded-md bg-navy-900/[0.03] p-2">
          <MediaThumb url={value} small />
          <a href={value} target="_blank" rel="noreferrer" className="text-xs text-gold-700 underline">
            {value}
          </a>
        </div>
      )}
    </div>
  );
}

export function MediaThumb({ url, small }: { url: string; small?: boolean }) {
  const isVideo = url.match(/\.(mp4|webm)$/i);
  const cls = small ? 'h-10 w-14' : 'h-20 w-28';
  if (isVideo) {
    return (
      <video src={url} className={`${cls} rounded bg-navy-950 object-cover`} muted playsInline preload="metadata" controls={!small} />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={`${cls} rounded border border-navy-900/10 bg-navy-950 object-cover`} loading="lazy" />;
}

export function Alert({ tone, children }: { tone: 'error' | 'success' | 'info'; children: ReactNode }) {
  const tones = {
    error: 'border-red-300 bg-red-50 text-red-700',
    success: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    info: 'border-navy-200 bg-paper text-navy-900',
  };
  return (
    <p className={`rounded-md border px-4 py-3 text-sm ${tones[tone]}`} role={tone === 'error' ? 'alert' : undefined}>
      {children}
    </p>
  );
}

export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="/images/hero.jpg or /uploads/file.png" className="flex-1" />
      {value && <MediaThumb url={value} small />}
    </div>
  );
}

export function NewFileButton({ onFiles }: { onFiles: (files: FileList) => void }) {
  const { pending } = useFormStatus();
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-hair text-white transition-colors hover:bg-navy-800 disabled:opacity-50">
      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
      {pending ? 'Uploading…' : 'Upload'}&nbsp;&nbsp;
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm"
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
    </label>
  );
}