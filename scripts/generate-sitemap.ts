/**
 * Sitemap generator — run at build time to produce a fresh sitemap.xml
 * Usage: bun run scripts/generate-sitemap.ts
 *
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY from .env.local
 * Writes public/sitemap.xml
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = 'https://snusfriend.co.uk';
const OUT = resolve(import.meta.dir, '../public/sitemap.xml');

// Load env — Bun reads .env.local automatically
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function url(loc: string, changefreq: string, priority: string, lastmod?: string) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod ?? new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const statics = [
    url('/', 'daily', '1.0', today),
    url('/nicotine-pouches', 'daily', '0.9', today),
    url('/nicotine-pouches?badge=new', 'daily', '0.8'),
    url('/nicotine-pouches?badge=popular', 'weekly', '0.8'),
    url('/nicotine-pouches?badge=newPrice', 'daily', '0.8'),
    url('/brands', 'weekly', '0.8'),
    url('/membership', 'monthly', '0.7'),
    url('/about', 'monthly', '0.5'),
    url('/contact', 'monthly', '0.5'),
    url('/faq', 'monthly', '0.6'),
    url('/shipping', 'monthly', '0.5'),
    url('/returns', 'monthly', '0.5'),
    url('/terms', 'monthly', '0.4'),
    url('/privacy', 'monthly', '0.4'),
    url('/cookies', 'monthly', '0.4'),
  ];

  // Products
  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('slug');

  if (pErr) {
    console.warn('Could not fetch products:', pErr.message);
  }

  const productUrls = (products ?? []).map((p) =>
    url(`/product/${p.slug}`, 'weekly', '0.7', p.updated_at?.split('T')[0])
  );

  // Brands
  const { data: brands, error: bErr } = await supabase
    .from('brands')
    .select('slug, updated_at')
    .order('slug');

  if (bErr) {
    console.warn('Could not fetch brands:', bErr.message);
  }

  const brandUrls = (brands ?? []).map((b) =>
    url(`/brand/${b.slug}`, 'weekly', '0.7', b.updated_at?.split('T')[0])
  );

  const allUrls = [...statics, ...productUrls, ...brandUrls].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls}
</urlset>
`;

  writeFileSync(OUT, xml);
  console.log(
    `Sitemap written to public/sitemap.xml — ${statics.length} static, ${productUrls.length} products, ${brandUrls.length} brands`
  );
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
