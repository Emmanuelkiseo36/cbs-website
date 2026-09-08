'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'gold' | 'ghost' | 'outline-dark' | 'ghost-dark';
  magnetic?: boolean;
  ariaLabel?: string;
  external?: boolean;
  className?: string;
};

export function MagneticButton({
  href,
  children,
  variant = 'gold',
  magnetic = true,
  ariaLabel,
  external,
  className = '',
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  function onMove(e: React.MouseEvent) {
    if (reduce || !magnetic || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: x * 0.18, y: y * 0.22 });
  }

  function onLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const styles: Record<string, string> = {
    gold: 'bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-[0_10px_40px_-12px_rgba(199,162,85,0.55)]',
    ghost:
      'border border-white/25 text-white hover:border-gold-400/70 hover:text-gold-200 hover:[&>svg]:translate-x-1',
    'outline-dark':
      'border border-navy-900/20 text-navy-900 hover:border-gold-600 hover:text-gold-700',
    'ghost-dark':
      'border border-navy-900/25 text-navy-900 hover:border-gold-600 hover:text-gold-700',
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group inline-flex items-center justify-center gap-3 rounded-sm px-7 py-4 text-[0.78rem] font-bold uppercase tracking-hair transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}