import process from 'node:process';

export const DEFAULT_GSC_SYNC_DAYS = 28;
export const DEFAULT_RANK_LIMIT = 20;
export const DEFAULT_PAGESPEED_PATHS = [
  '/',
  '/nicotine-pouches',
  '/brands',
  '/brands/zyn',
  '/brands/velo',
  '/blog/best-nicotine-pouches-2026',
  '/blog/best-nicotine-pouches-germany-2026',
  '/blog/best-nicotine-pouches-netherlands-2026',
  '/blog/best-nicotine-pouches-sensitive-gums',
  '/blog/zyn-vs-nordic-spirit',
];

export const getSiteBaseUrl = () => {
  const base =
    process.env.PUBLIC_SITE_URL?.trim() ||
    process.env.VITE_SITE_URL?.trim() ||
    'https://snusfriends.com';

  return base.endsWith('/') ? base : `${base}/`;
};

export const toAbsoluteUrl = (pathname: string) => {
  const normalizedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  return new URL(normalizedPath, getSiteBaseUrl()).toString();
};
