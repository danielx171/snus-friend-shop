import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
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
