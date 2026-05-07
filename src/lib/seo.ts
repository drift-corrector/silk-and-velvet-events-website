const SITE_URL = (import.meta.env.PUBLIC_SITE_URL as string | undefined) ?? 'https://silkandvelvetevents.com';

export function canonical(path: string): string {
  const trimmed = path.startsWith('/') ? path : `/${path}`;
  const withSlash = trimmed.endsWith('/') || trimmed.includes('.') ? trimmed : `${trimmed}/`;
  return new URL(withSlash, SITE_URL).toString();
}

export function ogImage(slug?: string): string {
  return new URL(slug ? `/og/${slug}.png` : '/og-default.png', SITE_URL).toString();
}

export interface Crumb {
  label: string;
  href: string;
}

export function breadcrumbsFor(pathname: string): Crumb[] {
  const trimmed = pathname.replace(/\/$/, '');
  if (!trimmed) return [];
  const segments = trimmed.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ label: 'Home', href: '/' }];
  let acc = '';
  for (const seg of segments) {
    acc += `/${seg}`;
    crumbs.push({
      label: seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `${acc}/`,
    });
  }
  return crumbs;
}

export const ORG = {
  name: 'Silk & Velvet Events',
  legalName: 'Silk & Velvet Events and Design',
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  founded: '2018',
  founder: 'Sofiya',
  telephone: '+1-646-820-8418',
  email: 'silk.and.velvet.events1@gmail.com',
  priceRange: '$$-$$$$',
  sameAs: [
    'https://instagram.com/silkandvelvet_events',
    'https://facebook.com/SilkandVelvetEvents',
  ],
  address: {
    addressLocality: 'New York',
    addressRegion: 'NY',
    addressCountry: 'US',
  },
  serviceArea: ['New York City', 'Long Island', 'New Jersey'] as string[],
};

export { SITE_URL };
