'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  Anchor,
  Crosshair,
  Gem,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react';
import { WHY_VALUES } from '@/lib/data';
import type { WhyValue } from '@/lib/public';
import { SectionHeading } from './ui/SectionHeading';

const ICONS: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  anchor: Anchor,
  target: Crosshair,
  gem: Gem,
  'heart-handshake': HeartHandshake,
};

export default function WhyCbs({ heading, description, values }: { heading?: string; description?: string; values?: WhyValue[] }) {
  const reduce = useReducedMotion();
  const items = values && values.length ? values : WHY_VALUES;
  const body = description || 'Customs brokerage is a matter of trust. When you hand us your cargo, you are handing us your business — we treat it that way.';

  return (
    <section
      id="why-cbs"
      className="relative bg-paper py-28 lg:py-40"
    >
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.4fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              index="03"
              kicker="The CBS standard"
              title={heading || 'Why Choose CBS?'}
              tone="light"
            />
            <p className="mt-8 max-w-md text-base leading-relaxed text-ink-600">
              {body}
            </p>
            <div className="mt-10 hidden lg:flex items-center gap-4">
              <span className="font-display text-6xl font-black text-navy-900/5">
                CBS
              </span>
              <span className="h-px w-16 bg-gold-600" aria-hidden="true" />
            </div>
          </div>

          <div className="border-t border-navy-900/10">
            {items.map((value, i) => {
              const Icon = ICONS[value.icon] ?? ShieldCheck;
              return (
                <motion.div
                  key={value.title}
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: (i % 5) * 0.06,
                  }}
                  className="group relative flex items-start gap-6 border-b border-navy-900/10 py-8 sm:gap-10 sm:py-10"
                >
                  <span className="pt-1 font-display text-xs font-extrabold text-gold-600/70 tabular-nums sm:text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center border border-navy-900/15 text-navy-900 transition-all duration-500 group-hover:border-gold-600 group-hover:text-gold-700 group-hover:scale-105 sm:h-14 sm:w-14"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-navy-900 sm:text-xl">
                      {value.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-ink-600">
                      {value.description}
                    </p>
                  </div>
                  <span
                    className="hidden h-px w-0 shrink-0 self-center bg-gold-600 transition-all duration-500 group-hover:w-14 sm:block"
                    aria-hidden="true"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}