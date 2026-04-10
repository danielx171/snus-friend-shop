import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import path from 'path';

export default defineConfig({
  site: 'https://snusfriends.com',
  output: 'server',
  trailingSlash: 'never',
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'nycdn.nyehandel.se' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  adapter: vercel({
    // ISR disabled — causes 404 on SSR pages (known Astro+Vercel bug)
    // Static pages are still cached by Vercel's CDN via Cache-Control headers
    imageService: true,
    maxDuration: 10,
  }),
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const exclude = [
          '/account', '/cart', '/checkout', '/login', '/register',
          '/forgot-password', '/update-password', '/order-confirmation',
          '/search', '/wishlist', '/404', '/auth/confirm',
          // Old blog URLs that have 301 redirects — only new versions should be in sitemap
          '/blog/zyn-vs-velo/',
          '/blog/strongest-nicotine-pouches/',
          '/blog/best-nicotine-pouches-for-beginners/',
        ];
        return !exclude.some((p) => page.includes(p));
      },
      serialize: (item) => {
        const url = item.url;
        // Blog articles modified in the April 8-10 sprint
        const aprilModified = [
          'best-nicotine-pouches-2026', 'are-nicotine-pouches-safe',
          'zyn-nicotine-pouches-complete-guide', 'strongest-nicotine-pouches-ranked-2026',
          'how-to-use-nicotine-pouches', 'nicotine-pouches-vs-cigarettes',
          'best-nicotine-pouches-for-beginners-2026', 'zyn-flavours-complete-guide',
          'nicotine-pouch-side-effects', 'what-are-nicotine-pouches',
          'best-berry-nicotine-pouches', 'best-citrus-nicotine-pouches',
          'best-coffee-nicotine-pouches', 'best-mint-nicotine-pouches-2026',
          'best-nicotine-pouches-germany-2026', 'best-nicotine-pouches-netherlands-2026',
          'best-nicotine-pouches-uk-2026', 'best-value-nicotine-pouches-2026',
          'best-nicotine-pouches-gym-sports', 'best-nicotine-pouches-sensitive-gums',
          'best-nicotine-pouches-under-2-euros', 'best-nicotine-pouches-by-occasion',
          'nicotine-pouches-vs-snus', 'switching-from-cigarettes-to-nicotine-pouches',
          'loop-nicotine-pouches-complete-guide', 'velo-nicotine-pouches-complete-guide',
          'zyn-nicotine-pouches-complete-guide', 'top-10-mint-flavours',
        ];
        if (url.includes('/blog/')) {
          const slug = url.split('/blog/')[1]?.replace(/\/$/, '');
          item.lastmod = aprilModified.includes(slug) ? '2026-04-10' : '2026-03-28';
        } else if (url.includes('/products/') || url.includes('/brands/')) {
          item.lastmod = '2026-04-09';
        } else {
          item.lastmod = new Date().toISOString().split('T')[0];
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    ssr: {
      noExternal: [/^@radix-ui/],
    },
    define: {
      __APP_VERSION__: JSON.stringify('1.5.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString().split('T')[0]),
    },
  },
});
