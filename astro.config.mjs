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
          '/search', '/wishlist', '/404',
          // Old blog URLs that have 301 redirects — only new versions should be in sitemap
          '/blog/zyn-vs-velo/',
          '/blog/strongest-nicotine-pouches/',
          '/blog/best-nicotine-pouches-for-beginners/',
        ];
        return !exclude.some((p) => page.includes(p));
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
