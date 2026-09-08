import { Reveal } from './Reveal';

export function SectionHeading({
  index,
  kicker,
  title,
  description,
  tone = 'dark',
  align = 'left',
}: {
  index?: string;
  kicker?: string;
  title: string;
  description?: string;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
}) {
  const dark = tone === 'dark';
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <Reveal>
        <div
          className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}
        >
          {index && (
            <span className="font-display text-sm font-extrabold text-gold-500 tabular-nums">
              {index}
            </span>
          )}
          <span className="h-px w-10 bg-gold-500/80" aria-hidden="true" />
          {kicker && (
            <span
              className={`text-[0.72rem] font-bold uppercase tracking-hair ${
                dark ? 'text-gold-300/90' : 'text-gold-700'
              }`}
            >
              {kicker}
            </span>
          )}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-6 font-display text-4xl font-black uppercase leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-6xl ${
            dark ? 'text-white' : 'text-navy-900'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${
              dark ? 'text-slate-300' : 'text-ink-600'
            } ${centered ? 'mx-auto' : ''}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}