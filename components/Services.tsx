'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useState } from 'react';
import { SERVICES } from '@/lib/data';
import type { PublicService } from '@/lib/store';
import { SectionHeading } from './ui/SectionHeading';

type ServiceRowData = Pick<PublicService, 'id' | 'title' | 'description' | 'image'>;

function ServiceRow({
  service,
  index,
  expanded,
  onToggle,
  reduce,
}: {
  service: ServiceRowData;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  reduce: boolean;
}) {
const bgImage = service.image || '/images/port.jpg';
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.06 }}
      className="relative"
    >
      <h3 className="m-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="group relative block w-full overflow-hidden border-b border-white/10 text-left"
      >
        {/* bg image reveal */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={bgImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-0 transition-all duration-700 group-hover:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/40" />
        </div>

        <div className="relative flex items-center gap-6 px-2 py-8 transition-all duration-500 sm:gap-10 lg:px-4 lg:py-10">
          <span className="w-10 shrink-0 font-display text-sm font-extrabold text-gold-500/70 tabular-nums transition-colors duration-300 group-hover:text-gold-300 sm:text-base">
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-6">
              <span className="font-display text-xl font-extrabold uppercase leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-gold-200 sm:text-2xl lg:text-[1.75rem]">
                {service.title}
              </span>
              <span
                className={`hidden h-10 w-10 shrink-0 items-center justify-center border transition-all duration-500 sm:flex ${
                  expanded
                    ? 'rotate-45 border-gold-400 text-gold-300'
                    : 'border-white/20 text-white/60 group-hover:border-gold-400 group-hover:text-gold-300'
                }`}
                aria-hidden="true"
              >
                <ArrowDownRight className="h-4 w-4" />
              </span>
            </div>

            {/* expanding description */}
            <div className={`desc-collapse ${expanded ? 'open' : ''}`}>
              <div>
                <p className="max-w-2xl pt-4 text-[0.95rem] leading-relaxed text-slate-300">
                  {service.description}
                </p>
              </div>
            </div>

            <span
              className={`mt-4 block h-px w-0 bg-gradient-to-r from-gold-400 to-gold-500 transition-all duration-500 group-hover:w-24 ${
                expanded ? 'w-24' : 'group-hover:w-24'
              }`}
              aria-hidden="true"
            />
          </div>
        </div>
      </button>
    </h3>
    </motion.div>
  );
}

export default function Services({
  services,
  heading,
}: {
  services: ServiceRowData[];
  heading?: string;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const items = services.length ? services : SERVICES;

  return (
    <section
      id="services"
      className="relative bg-navy-900 py-28 lg:py-40"
    >
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="container-site relative">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            index="01"
            kicker="What we do"
            title={heading || 'Our Customs & Trade Services'}
            tone="dark"
          />
          <p className="max-w-sm text-sm leading-relaxed text-slate-400 lg:pb-3">
            End-to-end support across the customs process — built for importers,
            exporters and anyone moving goods across borders.
          </p>
        </div>

        <div className="mt-16 border-t border-white/10 lg:mt-20">
          {items.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={i}
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
              reduce={!!reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}