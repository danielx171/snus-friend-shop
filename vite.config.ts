import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vike from "vike/plugin";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import pkg from "./package.json" with { type: "json" };
// https://vitejs.dev/config/
export default defineConfig(() => ({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().split('T')[0]),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    vike(),
    visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true }),
    VitePWA({
      devOptions: { enabled: false },
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "favicon.ico", "robots.txt", "apple-touch-icon-180x180.png"],
      manifest: {
        name: "SnusFriend | Premium Nicotine Pouches",
        short_name: "SnusFriend",
        description: "Shop 700+ nicotine pouches from 91 brands. Fast EU delivery.",
        theme_color: "#121620",
        background_color: "#121620",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/ops\//, /^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url, request }: { url: URL; request: Request }) =>
              /^https:\/\/.*\.supabase\.co\/functions\/v1\/.*/.test(url.href) &&
              request.method === 'GET',
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "product-images-cache",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/nycdn\.nyehandel\.se\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "nyehandel-images-cache",
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          // recharts pulls in a large d3 sub-tree — isolate it
          if (id.includes('recharts') || id.includes('/d3-') || id.includes('/d3/')) return 'charts';
          // Supabase client + realtime/postgrest deps
          if (id.includes('@supabase/')) return 'supabase';
          // All Radix UI primitives
          if (id.includes('@radix-ui/')) return 'radix';
          // Icon set (tree-shaken at import but still sizeable)
          if (id.includes('lucide-react')) return 'icons';
          // Everything else (react, react-dom, router, query, …)
          return 'vendor';
        },
      },
    },
  },
}));
