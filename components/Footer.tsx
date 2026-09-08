import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';
import Image from 'next/image';
import { NAV_LINKS, SERVICES, SITE } from '@/lib/data';
import type { SiteSettings, PublicService } from '@/lib/store';

export default function Footer({ settings, services }: { settings: SiteSettings; services?: PublicService[] }) {
  const s = settings;
  const svc = services && services.length ? services : SERVICES;
  return (
    <footer className="relative border-t border-white/10 bg-navy-950 pb-10 pt-20">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <a href="#home" className="flex items-center gap-3">
              <Image
                src="/images/logo.jpeg"
                alt="Customs Brokerage Services (CBS) logo"
                width={764}
                height={271}
                className="h-10 w-auto sm:h-12"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-[0.8rem] font-extrabold uppercase tracking-hair text-white">
                  Customs Brokerage
                </span>
                <span className="text-[0.66rem] font-medium uppercase tracking-hair text-slate-400">
                  Services · {s.location.split(',')[0]}
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate-400">
              &ldquo;{s.slogan}&rdquo; — professional customs clearance and international
              trade support for importers and exporters.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 border border-gold-500/30 bg-gold-500/5 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-hair text-gold-200">
              Powered by {s.poweredBy}
            </div>
          </div>

          {/* Nav */}
          <nav aria-label="Footer">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-hair text-slate-500">
              Navigate
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-hair text-slate-500">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {svc.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="text-sm text-slate-300 transition-colors hover:text-gold-300"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-hair text-slate-500">
              Contact
            </h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={s.phoneHref}
                  className="flex items-center gap-3 text-sm text-slate-300 transition-colors hover:text-gold-300"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                  <span className="tabular-nums">{s.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={s.emailHref}
                  className="flex items-center gap-3 text-sm break-all text-slate-300 transition-colors hover:text-gold-300"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                  <span>{s.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>{s.location}</span>
              </li>
              <li>
                <a
                  href={s.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-hair text-white transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  <MessageCircle className="h-4 w-4 text-gold-400" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <p className="text-xs uppercase tracking-hair text-slate-500">
            {SITE.slogan}
          </p>
        </div>
      </div>
    </footer>
  );
}