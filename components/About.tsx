'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, MapPin, User, Quote } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { SITE } from '@/lib/data';

export default function About() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="relative overflow-hidden bg-white py-28 lg:py-40">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          {/* Visual */}
          <div className="relative order-1 lg:order-1">
            <Reveal>
              <div className="relative">
                <div
                  className="absolute -left-5 -top-5 h-full w-full border border-gold-500/50"
                  aria-hidden="true"
                />
                <motion.div
                  initial={reduce ? false : { scale: 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[4/5] overflow-hidden"
                >
                  <Image
                    src="/images/about.jpg"
                    alt="Container cranes working at a port in Dar es Salaam at dusk"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative -mt-16 ml-auto max-w-[16rem] border border-navy-900/10 bg-navy-900 p-5 shadow-[0_30px_60px_-30px_rgba(7,26,46,0.5)]">
                <div className="flex items-center gap-3 text-white">
                  <Quote className="h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
                  <p className="text-sm font-semibold leading-snug">
                    {SITE.slogan}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Content */}
          <div className="order-2 lg:order-2">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-gold-600" aria-hidden="true" />
                <span className="text-[0.72rem] font-bold uppercase tracking-hair text-gold-700">
                  05 — About CBS
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-4xl font-black uppercase leading-[1.02] tracking-tight text-navy-900 text-balance sm:text-5xl">
                Your Trusted Partner in Customs &amp; International Trade
              </h2>
            </Reveal>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-600">
              <Reveal delay={0.14}>
                <p>
                  Customs Brokerage <span className="font-semibold text-navy-900">(CBS)</span> is a
                  professional customs brokerage company dedicated to providing
                  reliable solutions for businesses and individuals involved in
                  import and export activities.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p>
                  Powered by <span className="font-semibold text-navy-900">Martin</span>,
                  CBS is committed to delivering services with professionalism,
                  accuracy, transparency and customer satisfaction.
                </p>
              </Reveal>
              <Reveal delay={0.26}>
                <p>
                  Our goal is simple: to make customs procedures easier for our
                  clients while helping their cargo move smoothly and
                  efficiently.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-navy-900/10 pt-6">
                <div className="flex items-center gap-2 text-sm text-navy-900">
                  <MapPin className="h-4 w-4 text-gold-600" aria-hidden="true" />
                  <span className="font-semibold">{SITE.location}</span>
                  <span className="text-ink-600">· Port of Dar es Salaam</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-navy-900">
                  <User className="h-4 w-4 text-gold-600" aria-hidden="true" />
                  <span className="font-semibold">Founded by {SITE.poweredBy}</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.34}>
              <a
                href="#services"
                className="group mt-10 inline-flex items-center gap-3 text-[0.78rem] font-bold uppercase tracking-hair text-gold-700 transition-colors hover:text-navy-900"
              >
                Explore our services
                <ArrowDownRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                  aria-hidden="true"
                />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}