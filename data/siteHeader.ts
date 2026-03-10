export type SiteNavItem = {
  href: '/' | '/about' | '/timeline';
  label: string;
};

export const siteBrandLabel = 'Kosei Port';

export const siteNavItems: SiteNavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/timeline', label: 'Timeline' },
];
