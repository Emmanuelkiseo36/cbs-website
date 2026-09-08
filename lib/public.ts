import { getPublicServices, getSection, getSettings } from './store';
import type { SectionContent, SiteSettings, PublicService } from './store';
import { splitWords } from './text';

export { splitWords };

export type WhyValue = { title: string; description: string; icon: string };

export type PageData = {
  settings: SiteSettings;
  hero: SectionContent;
  intro: SectionContent;
  servicesHeading: SectionContent;
  services: PublicService[];
  whyCbs: SectionContent & { values: WhyValue[] };
  cta: SectionContent;
};

export function getPageData(): PageData {
  const settings = getSettings();
  const hero = getSection('hero');
  const intro = getSection('intro');
  const servicesHeading = getSection('services-heading');
  const cta = getSection('cta');
  const why = getSection('why-cbs');

  let values: WhyValue[] = [];
  try {
    const parsed = JSON.parse(why.extra || '[]') as WhyValue[];
    if (Array.isArray(parsed)) values = parsed;
  } catch {
    values = [];
  }

  return {
    settings,
    hero,
    intro,
    servicesHeading,
    services: getPublicServices(),
    whyCbs: { ...why, values },
    cta,
  };
}