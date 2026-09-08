'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MagneticButton } from './ui/MagneticButton';
import { SITE } from '@/lib/data';
import { splitWords } from '@/lib/text';

const ease = [0.22, 1, 0.36, 1] as const;

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export type HeroContent = {
  heading?: string;
  description?: string;
  primaryText?: string;
  primaryUrl?: string;
  secondaryText?: string;
  secondaryUrl?: string;
  image?: string;
};

export default function Hero({
  content,
  slogan,
  shortName,
}: {
  content?: HeroContent;
  slogan?: string;
  shortName?: string;
}) {
  const reduce = useReducedMotion();
  const headingLines = content?.heading ? splitWords(content.heading, 3) : [['Clearing', 'the way'], ['for global trade']];
  const description =
    content?.description ||
    'Customs Brokerage Services (CBS) provides professional and reliable customs brokerage solutions designed to make importing and exporting easier, faster, and more efficient.';
  const heroImage = content?.image || '/images/hero.jpg';
  const mounted = useMounted();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-navy-950"
    >
      {/* Background image + parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: reduce ? 0 : bgY, opacity: mounted ? fade : 1 }}
      >
        <motion.div
          className="relative h-[115%] w-full"
          initial={{ scale: 1.12 }}
          animate={{ scale: reduce ? 1 : 1.02 }}
          transition={{ duration: 2.4, ease }}
        >
          <Image
            src={heroImage || '/images/hero.jpg'}
            alt="Aerial view of a container terminal at a busy international port"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q=="
          />
        </motion.div>
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/55 to-navy-950/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-transparent to-navy-950/30" />
      <div
        className="absolute inset-0 grain"
        aria-hidden="true"
      />

      {/* Floating gold orbs */}
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.span
            className="absolute right-[8%] top-[22%] h-40 w-40 rounded-full bg-gold-500/15 blur-3xl"
            animate={{ y: [0, -26, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="absolute right-[22%] bottom-[18%] h-28 w-28 rounded-full bg-gold-300/10 blur-2xl"
            animate={{ y: [0, 22, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="container-site relative z-10 flex flex-1 flex-col justify-end pb-24 pt-40 lg:pb-20">
        <div className="max-w-[54rem]">
          {/* kicker row */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="flex items-center gap-4"
          >
            <span className="h-px w-12 bg-gold-400" aria-hidden="true" />
            <span className="text-[0.72rem] font-bold uppercase tracking-hair text-gold-200">
              {shortName || SITE.shortName} — {slogan || SITE.slogan}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="mt-7 font-display text-[clamp(2.6rem,8vw,6.2rem)] font-black uppercase leading-[0.98] tracking-tight text-white">
            {headingLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? { opacity: 0 } : { y: '115%' }}
                  animate={mounted ? { y: '0%', opacity: 1 } : {}}
                  transition={{ duration: 1.1, ease, delay: 0.5 + i * 0.16 }}
                >
                  {line.map((word, wi) => (
                    <span
                      key={wi}
                      className="inline-block mr-[0.32em] last:mr-0"
                    >
                      {word}
                    </span>
                  ))}
                  {i === headingLines.length - 1 && (
                    <span
                      className="mt-[0.14em] block h-[0.06em] w-full max-w-[26rem] bg-gradient-to-r from-gold-500 via-gold-300/80 to-transparent"
                      aria-hidden="true"
                    />
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Supporting */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 1.05 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 1.25 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <MagneticButton href={content?.primaryUrl || '#contact'}>
              {content?.primaryText || 'Request Customs Assistance'}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </MagneticButton>
            <MagneticButton href={content?.secondaryUrl || '#services'} variant="ghost">
              {content?.secondaryText || 'Explore Our Services'}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Trade lane line with moving pulse */}
      {!reduce && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-24 z-10 hidden lg:block"
          aria-hidden="true"
        >
          <div className="container-site">
            <div className="relative h-px w-full bg-white/10">
              <motion.span
                className="absolute top-1/2 h-[3px] w-24 -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
                animate={{ left: ['-5%', '105%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[0.62rem] font-semibold uppercase tracking-widehair text-slate-500">
              <span>Origin</span>
              <span className="text-gold-300">Dar es Salaam</span>
              <span>Port of entry</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={reduce ? false : { opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition-colors hover:text-gold-300"
        aria-label="Scroll to content"
      >
        <span className="text-[0.62rem] font-bold uppercase tracking-widehair">
          Scroll
        </span>
        <motion.span
          animate={reduce ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}