export const SITE = {
  name: 'Customs Brokerage Services',
  shortName: 'CBS',
  legalName: 'Customs Brokerage Services (CBS)',
  slogan: 'Making Customs & International Trade Easier.',
  poweredBy: 'Martin',
  phoneDisplay: '+255 798 106 766',
  phoneHref: 'tel:+255798106766',
  whatsappNumber: '255798106766',
  whatsappHref:
    'https://wa.me/255798106766?text=' +
    encodeURIComponent(
      'Hello CBS, I would like to enquire about your customs brokerage services.'
    ),
  email: 'eangleemarlian@gmail.com',
  emailHref: 'mailto:eangleemarlian@gmail.com',
  location: 'Dar es Salaam, Tanzania',
  locationLine: 'Dar es Salaam, Tanzania',
};

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Why CBS', href: '#why-cbs' },
  { label: 'Contact', href: '#contact' },
];

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export const SERVICES: Service[] = [
  {
    id: 'import-clearance',
    title: 'Import Customs Clearance',
    description:
      'Professional assistance with customs procedures for imported goods, helping ensure required documentation and declarations are properly handled.',
    image: '/images/dock.jpg',
    alt: 'Import customs clearance documentation at the port',
  },
  {
    id: 'export-clearance',
    title: 'Export Customs Clearance',
    description:
      'Reliable support for exporters throughout the customs declaration and clearance process.',
    image: '/images/vessel.jpg',
    alt: 'Export cargo vessel loading at the port',
  },
  {
    id: 'cargo-declaration',
    title: 'Cargo Declaration',
    description:
      'Accurate import and export declaration services to help clients meet customs requirements.',
    image: '/images/port.jpg',
    alt: 'Cargo declarations processing at the port authority',
  },
  {
    id: 'hs-code',
    title: 'HS Code Classification',
    description:
      'Assistance with identifying appropriate HS Codes for goods to support accurate customs declarations.',
    image: '/images/containers.jpg',
    alt: 'Classifying goods for HS code determination',
  },
  {
    id: 'customs-documentation',
    title: 'Customs Documentation',
    description:
      'Support with preparing and processing essential customs and international trade documentation.',
    image: '/images/about.jpg',
    alt: 'Customs and trade documentation preparation',
  },
  {
    id: 'transit-processing',
    title: 'Transit & Cargo Processing',
    description:
      'Assistance with customs procedures related to transit cargo and movement of goods.',
    image: '/images/ship.jpg',
    alt: 'Transit cargo moving through port operations',
  },
  {
    id: 'trade-support',
    title: 'International Trade Support',
    description:
      'Professional guidance for businesses involved in importing and exporting goods.',
    image: '/images/dock.jpg',
    alt: 'International trade consultation at the harbour',
  },
];

export type ProcessStep = {
  id: string;
  step: string;
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'cargo-info',
    step: '01',
    title: 'Cargo Information',
    description:
      'We begin with the details of your cargo — goods, origin, destination, and transport route.',
  },
  {
    id: 'documentation',
    step: '02',
    title: 'Documentation',
    description:
      'Your commercial documents are collected, checked, and prepared against customs requirements.',
  },
  {
    id: 'hs-classification',
    step: '03',
    title: 'HS Code Classification',
    description:
      'Goods are classified under the correct HS Codes to support an accurate, compliant declaration.',
  },
  {
    id: 'declaration',
    step: '04',
    title: 'Customs Declaration',
    description:
      'A precise import or export declaration is prepared and submitted on your behalf.',
  },
  {
    id: 'clearance',
    step: '05',
    title: 'Clearance Processing',
    description:
      'Your declaration is processed and followed through until customs clearance is granted.',
  },
  {
    id: 'cargo-movement',
    step: '06',
    title: 'Cargo Movement',
    description:
      'Once cleared, your cargo is released and ready to move efficiently to its destination.',
  },
];

export type WhyValue = {
  title: string;
  description: string;
  icon: string;
};

export const WHY_VALUES: WhyValue[] = [
  {
    title: 'Professionalism',
    description: 'We approach every assignment with care and attention to detail.',
    icon: 'shield-check',
  },
  {
    title: 'Reliability',
    description: 'We are committed to providing dependable customs brokerage support.',
    icon: 'anchor',
  },
  {
    title: 'Accuracy',
    description: 'We focus on accurate declarations and documentation.',
    icon: 'target',
  },
  {
    title: 'Efficiency',
    description: 'We help simplify customs procedures and reduce unnecessary delays.',
    icon: 'gem',
  },
  {
    title: 'Customer Focus',
    description: 'Your business and cargo are important to us.',
    icon: 'heart-handshake',
  },
];

export const SERVICE_OPTIONS = [
  'Import Customs Clearance',
  'Export Customs Clearance',
  'Cargo Declaration',
  'HS Code Classification',
  'Customs Documentation',
  'Transit & Cargo Processing',
  'International Trade Support',
  'Other',
];

export const SEO_KEYWORDS = [
  'Customs Brokerage Services Tanzania',
  'Customs Clearance Tanzania',
  'Customs Broker Dar es Salaam',
  'Import Customs Clearance Tanzania',
  'Export Customs Clearance Tanzania',
  'Cargo Declaration Tanzania',
  'HS Code Classification Tanzania',
  'Customs Documentation Tanzania',
];