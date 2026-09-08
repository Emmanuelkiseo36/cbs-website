'use client';

import { AnimatePresence, motion, useScroll, useReducedMotion } from 'framer-motion';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { NAV_LINKS, SITE } from '@/lib/data';
import type { SiteSettings } from '@/lib/store';

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const s = settings;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: reduce ? 0 : -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-white/10' : 'bg-transparent'
        }`}
      >
        {/* scroll progress */}
        {!reduce && (
          <motion.span
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-gold-600 to-gold-300"
            style={{ scaleX: scrollYProgress }}
          />
        )}
        <nav
          className="container-site flex h-[4.5rem] items-center justify-between gap-6"
          aria-label="Primary"
        >
          <a
            href="#home"
            className="group flex items-center gap-3"
            aria-label={`${s.name} — home`}
            onClick={() => setOpen(false)}
          >
            <span className="relative flex">
              <Image
                src="/images/logo.jpeg"
                alt=""
                width={764}
                height={271}
                priority
                className="h-10 w-auto sm:h-11"
              />
              <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-gold-600 to-transparent group-hover:to-gold-300" />
            </span>
            <span className="hidden flex-col leading-tight md:flex">
              <span className="font-display text-[0.8rem] font-extrabold uppercase tracking-hair text-white">
                Customs Brokerage
              </span>
              <span className="text-[0.66rem] font-medium uppercase tracking-hair text-slate-400">
                Services · {s.location.split(',')[0] || 'Dar es Salaam'}
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`group relative px-3.5 py-2 text-[0.74rem] font-semibold uppercase tracking-hair transition-colors duration-300 ${
                      isActive ? 'text-gold-300' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-px bg-gold-400 transition-transform duration-300 ${
                        isActive
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      } origin-left`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${s.phoneNumber}`}
              className="hidden items-center gap-2 text-[0.74rem] font-semibold tracking-hair text-slate-300 transition-colors hover:text-gold-300 xl:flex"
            >
              <Phone className="h-4 w-4 text-gold-400" aria-hidden="true" />
              <span className="tabular-nums">{s.phoneDisplay}</span>
            </a>
            <a
              href="#contact"
              className="group hidden items-center gap-2 border border-gold-500/60 bg-gold-500/10 px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-hair text-gold-200 transition-all duration-300 hover:bg-gold-500 hover:text-navy-950 sm:inline-flex"
            >
              Get in Touch
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-gold-400 hover:text-gold-300 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col bg-navy-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-site flex flex-1 flex-col justify-center gap-1 pt-16">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-center justify-between border-b border-white/10 py-5"
                >
                  <span className="font-display text-3xl font-extrabold uppercase tracking-tight text-white transition-colors group-hover:text-gold-300 sm:text-4xl">
                    {link.label}
                  </span>
                  <span className="text-sm text-slate-500 tabular-nums">
                    0{i + 1}
                  </span>
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10"
              >
                <a
                  href={`tel:${s.phoneNumber}`}
                  className="mt-4 flex items-center gap-3 text-slate-300"
                >
                  <Phone className="h-5 w-5 text-gold-400" aria-hidden="true" />
                  <span className="text-lg font-semibold tracking-hair tabular-nums">
                    {s.phoneDisplay}
                  </span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}