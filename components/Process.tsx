'use client';

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import { PROCESS_STEPS } from '@/lib/data';
import { SectionHeading } from './ui/SectionHeading';

function Step({
  step,
  reduce,
}: {
  step: (typeof PROCESS_STEPS)[number];
  reduce: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const active = useInView(nodeRef, { amount: 0.6, margin: '-40px 0px' });

  return (
    <div className="relative pl-20 pb-20 last:pb-0 sm:pl-28" ref={nodeRef}>
      {/* ghost number */}
      <span
        className="pointer-events-none absolute -right-2 top-0 select-none font-display text-[7rem] font-black leading-none text-white/[0.03] sm:text-[10rem]"
        aria-hidden="true"
      >
        {step.step}
      </span>

      {/* node */}
      <div className="absolute left-0 top-1 sm:left-0" aria-hidden="true">
        <span
          className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 sm:h-11 sm:w-11 ${
            active
              ? 'border-gold-400 bg-gold-500/15 shadow-[0_0_30px_-6px_rgba(199,162,85,0.6)]'
              : 'border-white/20 bg-navy-950'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 sm:h-3 sm:w-3 ${
              active ? 'bg-gold-400' : 'bg-white/30'
            }`}
          />
        </span>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, x: 28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        <div className="flex items-baseline gap-4">
          <span className="font-display text-sm font-extrabold text-gold-500 tabular-nums">
            {step.step}
          </span>
          <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-white sm:text-2xl">
            {step.title}
          </h3>
        </div>
        <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-slate-400">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

export default function Process() {
  const reduce = useReducedMotion();
  const spineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start 75%', 'end 65%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const connectorScale = useTransform(scrollYProgress, [0.25, 0.75], [0, 1]);

  return (
    <section
      id="process"
      className="relative overflow-hidden bg-navy-950 py-28 lg:py-40"
    >
      {/* subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.35fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              index="02"
              kicker="How it works"
              title="From Cargo to Clearance"
              tone="dark"
            />
            <div className="mt-12 hidden lg:block">
              <div className="flex items-center gap-4 text-[0.68rem] font-bold uppercase tracking-hair text-slate-500">
                <span className="h-px w-8 bg-gold-500/60" aria-hidden="true" />
                A simplified CBS service journey
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
                Every shipment moves through the same disciplined path. We handle
                each step for you — accurately, transparently and on schedule.
              </p>
            </div>
          </div>

          <div ref={spineRef} className="relative">
            {/* spine rail + fill */}
            <div
              className="absolute bottom-0 left-4 top-1 w-px bg-white/10 sm:left-5"
              aria-hidden="true"
            />
            {!reduce && (
              <motion.div
                className="absolute bottom-0 left-4 top-1 w-px origin-top bg-gradient-to-b from-gold-500 via-gold-400 to-gold-600 sm:left-5"
                style={{ scaleY: lineScale }}
                aria-hidden="true"
              />
            )}
            {!reduce && (
              <motion.div
                className="absolute left-4 top-1 w-px origin-top bg-gold-500/50 sm:left-5"
                style={{ scaleY: connectorScale }}
                aria-hidden="true"
              />
            )}

            <div className="relative">
              {PROCESS_STEPS.map((step) => (
                <Step key={step.id} step={step} reduce={!!reduce} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}