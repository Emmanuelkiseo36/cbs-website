import type { Metadata } from 'next';
import { Archivo, Manrope } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/data';
import { siteUrl } from '@/lib/site';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const siteTitle = 'CBS | Customs Brokerage Services Tanzania';
const description =
  'Customs Brokerage Services (CBS) — professional and reliable customs clearance, cargo declaration, HS code classification and international trade support in Dar es Salaam, Tanzania.';
const url = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: siteTitle,
    template: `%s | Customs Brokerage Services`,
  },
  description,
  applicationName: SITE.name,
  keywords: [
    'Customs Brokerage Services Tanzania',
    'Customs Clearance Tanzania',
    'Customs Broker Dar es Salaam',
    'Import Customs Clearance Tanzania',
    'Export Customs Clearance Tanzania',
    'Cargo Declaration Tanzania',
    'HS Code Classification Tanzania',
    'Customs Documentation Tanzania',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_TZ',
    url,
    siteName: SITE.name,
    title: siteTitle,
    description,
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Customs Brokerage Services — port operations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description,
    images: ['/images/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE.legalName,
  slogan: SITE.slogan,
  founder: { '@type': 'Person', name: SITE.poweredBy },
  email: SITE.email,
  telephone: '+255798106766',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dar es Salaam',
    addressCountry: 'TZ',
  },
  areaServed: 'Tanzania',
  knowsAbout: [
    'Customs clearance',
    'Import and export declarations',
    'HS code classification',
    'International trade documentation',
  ],
  description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}