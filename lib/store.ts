import { all, get } from './db';

export type SiteSettings = {
  name: string;
  shortName: string;
  slogan: string;
  poweredBy: string;
  phoneDisplay: string;
  phoneNumber: string;
  phoneHref: string;
  whatsappNumber: string;
  whatsappHref: string;
  email: string;
  emailHref: string;
  location: string;
  locationLine: string;
  businessDescription: string;
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  serviceOptions: string[];
  sessionTtlHours: number;
};

export type SectionContent = {
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  cta2Text: string;
  cta2Url: string;
  image: string;
  extra: string;
};

export type PublicService = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type AdminService = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  alt: string;
  displayOrder: number;
  published: number;
};

export type PublicPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
  publishedAt: string;
};

export type AdminPost = PublicPost & {
  seoTitle: string;
  seoDescription: string;
  status: string;
  tagsRaw: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaRow = {
  id: number;
  filename: string;
  originalName: string;
  type: string;
  ext: string;
  size: number;
  url: string;
  createdAt: string;
};

export type InquiryRow = {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  cargo: string;
  message: string;
  status: string;
  createdAt: string;
};

export type AdminUserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

function settingsValue(key: string, fallback = ''): string {
  const row = get<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
  return row?.value ?? fallback;
}

export function getSettings(): SiteSettings {
  const phoneNumber = settingsValue('phone_number', '255798106766');
  const whatsappNumber = settingsValue('whatsapp_number', '255798106766');
  const email = settingsValue('email', 'eangleemarlian@gmail.com');
  const location = settingsValue('location', 'Dar es Salaam, Tanzania');

  let social = { facebook: '', twitter: '', linkedin: '', instagram: '', youtube: '' };
  try {
    social = JSON.parse(settingsValue('social', '{}'));
  } catch {
    social = { facebook: '', twitter: '', linkedin: '', instagram: '', youtube: '' };
  }

  let serviceOptions: string[] = [];
  try {
    serviceOptions = JSON.parse(settingsValue('service_options', '[]'));
  } catch {
    serviceOptions = [];
  }

  return {
    name: settingsValue('site_name', 'Customs Brokerage Services'),
    shortName: settingsValue('site_short_name', 'CBS'),
    slogan: settingsValue('slogan', 'Making Customs & International Trade Easier.'),
    poweredBy: settingsValue('powered_by', 'Martin'),
    phoneDisplay: settingsValue('phone_display', '+255 798 106 766'),
    phoneNumber,
    phoneHref: `tel:+${phoneNumber.replace(/\D/g, '')}`,
    whatsappNumber,
    whatsappHref: `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
      'Hello CBS, I would like to enquire about your customs brokerage services.',
    )}`,
    email,
    emailHref: `mailto:${email}`,
    location,
    locationLine: settingsValue('location_line', location),
    businessDescription: settingsValue('business_description', ''),
    social,
    seoTitle: settingsValue('seo_title', 'CBS | Customs Brokerage Services Tanzania'),
    seoDescription: settingsValue(
      'seo_description',
      'Customs Brokerage Services (CBS) — professional customs clearance and international trade support from Dar es Salaam, Tanzania.',
    ),
    seoKeywords: settingsValue('seo_keywords', ''),
    serviceOptions,
    sessionTtlHours: Number(settingsValue('session_ttl_hours', '120')),
  };
}

const EMPTY_SECTION: SectionContent = {
  heading: '',
  subheading: '',
  description: '',
  ctaText: '',
  ctaUrl: '',
  cta2Text: '',
  cta2Url: '',
  image: '',
  extra: '',
};

export function getSections(): Record<string, SectionContent> {
  const rows = all<{
    section_key: string;
    heading: string;
    subheading: string;
    description: string;
    cta_text: string;
    cta_url: string;
    cta2_text: string;
    cta2_url: string;
    image: string;
    extra: string;
  }>('SELECT section_key, heading, subheading, description, cta_text, cta_url, cta2_text, cta2_url, image, extra FROM sections');

  const out: Record<string, SectionContent> = {};
  for (const r of rows) {
    out[r.section_key] = {
      heading: r.heading,
      subheading: r.subheading,
      description: r.description,
      ctaText: r.cta_text,
      ctaUrl: r.cta_url,
      cta2Text: r.cta2_text,
      cta2Url: r.cta2_url,
      image: r.image,
      extra: r.extra,
    };
  }
  return out;
}

export function getSection(key: string): SectionContent {
  return getSections()[key] ?? EMPTY_SECTION;
}

function mapServiceRow(r: {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string;
  image: string;
  alt: string;
  display_order: number;
  published: number;
}): AdminService {
  return {
    id: Number(r.id),
    title: r.title,
    slug: r.slug,
    shortDescription: r.short_description,
    description: r.description,
    icon: r.icon,
    image: r.image,
    alt: r.alt,
    displayOrder: Number(r.display_order),
    published: Number(r.published),
  };
}

export function getAdminServices(): AdminService[] {
  const rows = all<Parameters<typeof mapServiceRow>[0]>(
    'SELECT id, title, slug, short_description, description, icon, image, alt, display_order, published FROM services ORDER BY display_order ASC, id ASC',
  );
  return rows.map(mapServiceRow);
}

export function getPublicServices(): PublicService[] {
  return getAdminServices()
    .filter((s) => s.published === 1)
    .map((s) => ({
      id: s.slug,
      title: s.title,
      description: s.description,
      image: s.image || '/images/dock.jpg',
      alt: s.alt || s.title,
    }));
}

function mapPostRow(r: Record<string, unknown>): AdminPost {
  return {
    id: Number(r.id),
    title: String(r.title),
    slug: String(r.slug),
    excerpt: String(r.excerpt ?? ''),
    content: String(r.content ?? ''),
    category: String(r.category ?? ''),
    author: String(r.author ?? 'CBS'),
    image: String(r.image ?? ''),
    tags: String(r.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    tagsRaw: String(r.tags ?? ''),
    seoTitle: String(r.seo_title ?? ''),
    seoDescription: String(r.seo_description ?? ''),
    status: String(r.status ?? 'draft'),
    publishedAt: r.published_at ? String(r.published_at) : '',
    createdAt: String(r.created_at ?? ''),
    updatedAt: String(r.updated_at ?? ''),
  };
}

export function getAdminPosts(): AdminPost[] {
  const rows = all(
    'SELECT id, title, slug, excerpt, content, category, author, image, tags, seo_title, seo_description, status, published_at, created_at, updated_at FROM posts ORDER BY COALESCE(published_at, created_at) DESC',
  );
  return rows.map(mapPostRow);
}

export function getPublicPosts(): PublicPost[] {
  return getAdminPosts()
    .filter((p) => p.status === 'published')
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      author: p.author,
      image: p.image,
      tags: p.tags,
      publishedAt: p.publishedAt,
    }));
}

export function getPostBySlug(slug: string): PublicPost | null {
  const row = get(
    'SELECT id, title, slug, excerpt, content, category, author, image, tags, seo_title, seo_description, status, published_at, created_at, updated_at FROM posts WHERE slug = ?',
    slug,
  );
  if (!row) return null;
  const p = mapPostRow(row);
  if (p.status !== 'published') return null;
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    author: p.author,
    image: p.image,
    tags: p.tags,
    publishedAt: p.publishedAt,
  };
}

export function getPostById(id: number | string): AdminPost | null {
  const row = get(
    'SELECT id, title, slug, excerpt, content, category, author, image, tags, seo_title, seo_description, status, published_at, created_at, updated_at FROM posts WHERE id = ?',
    Number(id),
  );
  return row ? mapPostRow(row) : null;
}

export function getMedia(): MediaRow[] {
  return all<MediaRow>('SELECT id, filename, original_name, type, ext, size, url, created_at FROM media ORDER BY id DESC');
}

export function getInquiries(): InquiryRow[] {
  return all<InquiryRow>('SELECT id, name, phone, email, service, cargo, message, status, created_at FROM inquiries ORDER BY id DESC');
}

export function getNewInquiryCount(): number {
  const row = get<{ c: number }>('SELECT COUNT(*) AS c FROM inquiries WHERE status = ?', 'new');
  return Number(row?.c ?? 0);
}

export function getAdminUsers(): AdminUserRecord[] {
  return all<AdminUserRecord>('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC');
}

export function getDashboardStats() {
  const publishedPosts = get<{ c: number }>('SELECT COUNT(*) AS c FROM posts WHERE status = ?', 'published');
  const draftPosts = get<{ c: number }>('SELECT COUNT(*) AS c FROM posts WHERE status = ?', 'draft');
  const services = get<{ c: number }>('SELECT COUNT(*) AS c FROM services');
  const mediaCount = get<{ c: number }>('SELECT COUNT(*) AS c FROM media');
  const inquiries = get<{ c: number }>('SELECT COUNT(*) AS c FROM inquiries');
  const newInquiries = getNewInquiryCount();
  return {
    publishedPosts: Number(publishedPosts?.c ?? 0),
    draftPosts: Number(draftPosts?.c ?? 0),
    services: Number(services?.c ?? 0),
    media: Number(mediaCount?.c ?? 0),
    inquiries: Number(inquiries?.c ?? 0),
    newInquiries,
  };
}