import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
// PWA disabled — incompatible with output:'server' mode
// import AstroPWA from '@vite-pwa/astro';
import path from 'path';

export default defineConfig({
  site: 'https://snusfriends.com',
  output: 'server',
  adapter: vercel({
    // ISR disabled — causes 404 on SSR pages (known Astro+Vercel bug)
    // Static pages are still cached by Vercel's CDN via Cache-Control headers
    imageService: true,
    maxDuration: 10,
  }),
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', sv: 'sv' } },
    }),
    // PWA integration removed — incompatible with output:'server'
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sv'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // Exclude uninstalled legacy deps that _legacy/ files still import
      exclude: ['react-router-dom', 'react-helmet-async', 'next-themes'],
    },
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
