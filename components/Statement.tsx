'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

const LINES = [
  { text: 'Your cargo.', gold: false },
  { text: 'Our expertise.', gold: false },
  { text: 'Your peace of mind.', gold: true },
];

export default function Statement({
  content,
}: {
  content?: { heading?: string; description?: string; primaryText?: string; primaryUrl?: string };
}) {
  const reduce = useReducedMotion();
  const lines = content?.heading
    ? content.heading.split(/\s+/).filter(Boolean).map((w, i, a) => ({
        text: a.slice(i, i + 3).join(' '),
        gold: false,
      })).filter((_, i, a) => i % 3 === 0)
    : LINES;
  const description = content?.description || 'Customs Brokerage Services — reliable, accurate and transparent handling of your import and export procedures from Tanzania.';

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy-950 py-28">
      {/* faint backdrop */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/vessel.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/70 to-navy-950" />
      </div>

      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="container-site relative text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease }}
          className="flex items-center justify-center gap-4 text-[0.72rem] font-bold uppercase tracking-hair text-gold-300/80"
        >
          <span className="h-px w-10 bg-gold-500/60" aria-hidden="true" />
          Our commitment
          <span className="h-px w-10 bg-gold-500/60" aria-hidden="true" />
        </motion.p>

        <h2 className="mt-12 font-display text-[clamp(2.4rem,7.5vw,6rem)] font-black uppercase leading-[1.02] tracking-tight">
          {LINES.map((line, i) => (
            <span key={line.text} className="block overflow-hidden">
              <motion.span
                className={`block ${line.gold ? 'text-gold-400' : 'text-white'}`}
                initial={reduce ? { opacity: 0 } : { y: '115%' }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, ease, delay: i * 0.18 }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease, delay: 0.7 }}
          className="mx-auto mt-12 max-w-xl text-sm leading-relaxed text-slate-400"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}