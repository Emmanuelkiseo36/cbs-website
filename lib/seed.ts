import { all, get, run } from './db';
import { hashPassword } from './password';
import { SITE, SERVICES, WHY_VALUES, SERVICE_OPTIONS } from './data';

export function ensureSeeded(): boolean {
  const count = get<{ c: number }>('SELECT COUNT(*) AS c FROM users');
  if (count && Number(count.c) > 0) return false;

  const now = new Date().toISOString();
  const seedSettings = new Map<string, string>([
    ['site_name', SITE.name],
    ['site_short_name', SITE.shortName],
    ['slogan', SITE.slogan],
    ['powered_by', SITE.poweredBy],
    ['phone_display', SITE.phoneDisplay],
    ['phone_number', '255798106766'],
    ['whatsapp_number', SITE.whatsappNumber],
    ['email', SITE.email],
    ['location', SITE.location],
    ['location_line', SITE.locationLine],
    ['business_description', ''],
    [
      'social',
      JSON.stringify({
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        youtube: '',
      }),
    ],
    ['seo_title', 'CBS | Customs Brokerage Services Tanzania'],
    [
      'seo_description',
      SITE.slogan +
        ' CBS is a professional customs brokerage company in Dar es Salaam, Tanzania offering customs clearance, cargo declaration, HS code classification and international trade support.',
    ],
    ['seo_keywords', 'Customs Brokerage Services Tanzania, Customs Clearance Tanzania'],
    ['service_options', JSON.stringify(SERVICE_OPTIONS)],
    ['session_ttl_hours', '120'],
  ]);

  for (const [key, value] of seedSettings) {
    run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', key, value);
  }

  const sections: [string, string, string, string, string, string, string, string, string][] = [
    [
      'hero',
      'Clearing the way for global trade',
      'Your cargo, cleared with confidence.',
      'Customs Brokerage Services (CBS) offers professional customs clearance and international trade support from Dar es Salaam, Tanzania.',
      'Start a Clearance',
      '#contact',
      'Explore Services',
      '#services',
      '/images/hero.jpg',
    ],
    [
      'intro',
      'Customs shouldn\'t slow your business down.',
      '',
      'We handle the paperwork, classifications, declarations and procedures — so your goods keep moving and your business stays focused on growth.',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      'services-heading',
      'Our Customs & Trade Services',
      '',
      'End-to-end support across the customs process — built for importers, exporters and anyone moving goods across borders.',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      'why-cbs',
      'Why Choose CBS?',
      '',
      'Trade goods without the guesswork. We combine professionalism, reliability and accuracy to make customs procedures easier for every client.',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      'cta',
      'Ready to move your cargo forward?',
      '',
      'Send us your requirements and we will guide you through the customs process — quickly, accurately and transparently.',
      'Start Your Clearance',
      '#contact',
      '',
      '',
      '/images/containers.jpg',
    ],
  ];

  for (const s of sections) {
    const [key, heading, sub, desc, cta, ctaUrl, cta2, cta2Url, image] = s;
    run(
      'INSERT OR IGNORE INTO sections (section_key, heading, subheading, description, cta_text, cta_url, cta2_text, cta2_url, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      key,
      heading,
      sub,
      desc,
      cta,
      ctaUrl,
      cta2,
      cta2Url,
      image,
    );
  }

  run(
  'UPDATE sections SET extra = ? WHERE section_key = ? AND (extra IS NULL OR extra = \'\')',
  JSON.stringify(WHY_VALUES),
  'why-cbs',
);

  SERVICES.forEach((svc, i) => {
    run(
      'INSERT OR IGNORE INTO services (title, slug, short_description, description, icon, image, alt, display_order, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      svc.title,
      svc.id,
      svc.description,
      svc.description,
      '',
      svc.image,
      svc.alt,
      i,
      1,
    );
  });

  const adminPasswordHash = hashPassword(process.env.CBS_ADMIN_PASSWORD || 'CBSadmin2026!');
  run(
    'INSERT OR IGNORE INTO users (name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    'CBS Admin',
    'eangleemarlian@gmail.com',
    adminPasswordHash,
    'admin',
    now,
    now,
  );

  const samplePosts: [string, string, string, string, string, string, string][] = [
    [
      'A Quick Guide to Import Customs Clearance in Tanzania',
      'import-customs-clearance-guide',
      'Understand the key documents and steps involved in clearing imported goods through Tanzanian customs.',
      '## What is customs clearance?\n\nCustoms clearance is the process of moving goods through customs control so they can be legally imported or exported. For imports into Tanzania, this means submitting the right documentation and declarations to the Tanzania Revenue Authority (TRA).\n\n## Core documents you may need\n\n- Commercial invoice\n- Bill of lading or air waybill\n- Packing list\n- Certificate of origin\n- Import declaration form (IDF)\n\n## How CBS helps\n\nA customs broker prepares and submits the declaration on your behalf, verifies the documentation, and follows the clearance through to release — helping your cargo keep moving.',
      'Import Clearance',
      'Customs Brokerage Services',
      'import-clearance,customs,imports',
    ],
    [
      'Why HS Code Classification Matters for Your Cargo',
      'why-hs-code-classification-matters',
      'Getting the right HS Code is one of the most important steps in a customs declaration. Here is why it matters.',
      '## What is an HS Code?\n\nThe Harmonized System (HS) is an internationally standardised system of names and numbers for classifying traded products. Every product that crosses a border is identified by an HS Code.\n\n## Why it matters\n\n- It determines the duty rate applied to your goods\n- It informs licensing and permits requirements\n- It affects how the declaration is processed\n\nAccurate classification reduces the risk of delays, penalties and rework at the port.',
      'HS Codes',
      'Customs Brokerage Services',
      'hs-code,customs,classification',
    ],
  ];

  samplePosts.forEach((p, i) => {
    const [title, slug, excerpt, content, category, author, tags] = p;
    run(
      'INSERT OR IGNORE INTO posts (title, slug, excerpt, content, category, author, tags, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      tags,
      'published',
      new Date(Date.now() - i * 86400000).toISOString(),
    );
  });

  return true;
}