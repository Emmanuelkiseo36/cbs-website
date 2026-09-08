const DEFAULT_SITE_URL = 'https://cbs-customs-brokerage.onrender.com';

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  return (fromEnv || DEFAULT_SITE_URL).replace(/\/+$/, '');
}