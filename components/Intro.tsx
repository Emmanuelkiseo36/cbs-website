'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { splitWords } from '@/lib/text';

const ease = [0.22, 1, 0.36, 1] as const;
const STAGES = ['Origin', 'Documentation', 'Port of entry', 'Release'];

export default function Intro({ content }: { content?: { heading?: string; description?: string } }) {
  const reduce = useReducedMotion();
  const headingLines = content?.heading
    ? splitWords(content.heading, 4)
    : ["Customs shouldn't", 'slow your', 'business down.'];
  const description =
    content?.description ||
    'CBS helps businesses and individuals navigate customs procedures with confidence — from import and export clearance to cargo declaration, HS code classification and complete customs documentation.';
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 55%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="intro"
      className="relative overflow-hidden bg-paper py-28 lg:py-40"
      aria-label="Why CBS"
    >
      <div className="container-site">
        <div ref={ref}>
          <p className="flex items-center gap-4 text-[0.72rem] font-bold uppercase tracking-hair text-gold-700">
            <span className="h-px w-10 bg-gold-600" aria-hidden="true" />
            Your business shouldn&apos;t wait on paperwork
          </p>

          <h2 className="mt-8 max-w-5xl font-display text-[clamp(2rem,5.4vw,4.6rem)] font-black uppercase leading-[1.02] tracking-tight text-navy-900 text-balance">
            {headingLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? { opacity: 0 } : { y: '110%' }}
                  whileInView={{ y: '0%', opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease, delay: i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.4 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg"
          >
            {description}
          </motion.p>
        </div>

        {/* Cargo journey line */}
        <div className="mt-20 lg:mt-28">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-navy-900/10 lg:block" />
            <motion.div
              className="absolute inset-x-0 top-1/2 hidden h-px origin-left -translate-y-1/2 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 lg:block"
              style={{ scaleX: reduce ? 1 : lineScale }}
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
              {STAGES.map((stage, i) => (
                <motion.div
                  key={stage}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, ease, delay: i * 0.14 + 0.2 }}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <span className="relative flex h-10 w-10 items-center justify-center bg-paper">
                    <span className="absolute inline-flex h-10 w-10 rounded-full bg-gold-500/20" />
                    <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-gold-600 bg-paper">
                      <span className="h-2 w-2 rounded-full bg-gold-600" />
                    </span>
                  </span>
                  <span className="text-[0.7rem] font-bold uppercase tracking-hair text-navy-900">
                    {String(i + 1).padStart(2, '0')} — {stage}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}