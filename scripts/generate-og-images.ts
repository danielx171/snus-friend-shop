#!/usr/bin/env bun
/**
 * Generate per-page Open Graph images (1200×630 PNG) into public/og/.
 *
 * Run:
 *   bun run scripts/generate-og-images.ts          # generate all
 *   bun run scripts/generate-og-images.ts --type=brand   # one type only
 *
 * Template set:
 *   - brand     : /brands/{slug}
 *   - category  : /nicotine-pouches, /flavors/*, /strength/*
 *   - article   : /blog/{slug}
 *   - gamification : /rewards, /community, /membership, /daily-drop
 *   - info      : everything else
 *
 * The images are committed to git so they ship with the rest of /public.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { createClient } from '@supabase/supabase-js';
import { brandColors, defaultBrandColor } from '../src/data/brand-colors';

const OUT_DIR = resolve(process.cwd(), 'public/og');
const FONTS_DIR = resolve(process.cwd(), 'public/fonts');
const interBold = readFileSync(resolve(FONTS_DIR, 'Inter-Bold.ttf'));
const interRegular = readFileSync(resolve(FONTS_DIR, 'Inter-Regular.ttf'));
const FONTS = [
  { name: 'Inter', data: interBold, weight: 700, style: 'normal' } as const,
  { name: 'Inter', data: interRegular, weight: 400, style: 'normal' } as const,
];

const SITE_NAME = 'SnusFriend';
const SITE_TAG = 'Europe\u2019s #1 Nicotine Pouch Shop';
const FOREST = '#0F6E56';
const DARK = '#0B1F16';

function typeFilter() {
  const arg = process.argv.find((a) => a.startsWith('--type='));
  return arg ? arg.slice('--type='.length) : null;
}

function getSupabase() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    '';
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// ── Template primitives (plain JSX-like VDOM — satori accepts this shape) ──

type Node = { type: string; props: Record<string, any>; children?: Node[] | string };

function el(type: string, props: Record<string, any> = {}, children?: Node[] | Node | string): Node {
  return {
    type,
    props,
    children: children == null ? undefined : Array.isArray(children) ? children : typeof children === 'string' ? children : [children],
  };
}

// Satori wants React-like elements. We build them as plain objects the library accepts.
type SatoriEl = any;
function e(type: string, props: Record<string, any>, ...children: any[]): SatoriEl {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
}

/** Common frame: dark forest background, ambient glow, SnusFriend wordmark top-right. */
function frame(accent: string, body: SatoriEl) {
  return e('div', {
    style: {
      width: 1200, height: 630, display: 'flex', flexDirection: 'column',
      background: `linear-gradient(135deg, ${DARK} 0%, #0D2A1E 45%, ${DARK} 100%)`,
      color: 'white', fontFamily: 'Inter', position: 'relative', overflow: 'hidden',
    },
  },
    // Accent glow (bottom-left)
    e('div', {
      style: {
        position: 'absolute', bottom: -120, left: -120, width: 600, height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}55 0%, transparent 60%)`,
        display: 'flex',
      },
    }),
    // Secondary accent (top-right)
    e('div', {
      style: {
        position: 'absolute', top: -80, right: -80, width: 400, height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${FOREST}40 0%, transparent 60%)`,
        display: 'flex',
      },
    }),
    // Wordmark
    e('div', {
      style: {
        position: 'absolute', top: 36, right: 48, display: 'flex', alignItems: 'center', gap: 12,
      },
    },
      e('div', {
        style: {
          width: 36, height: 36, borderRadius: 10, background: FOREST,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: 20,
        },
      }, 'S'),
      e('div', { style: { fontWeight: 800, fontSize: 22, letterSpacing: -0.5 } }, SITE_NAME),
    ),
    // Body
    e('div', {
      style: {
        position: 'relative', zIndex: 10, flex: 1, padding: 72,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      },
    }, body),
    // Bottom accent bar
    e('div', {
      style: {
        height: 8, background: `linear-gradient(90deg, ${FOREST} 0%, ${accent} 100%)`,
        display: 'flex',
      },
    }),
  );
}

function brandTemplate(opts: { name: string; slug: string; productCount: number; color: string }) {
  return frame(opts.color,
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      e('div', {
        style: {
          fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3,
          color: opts.color,
        },
      }, 'Brand'),
      e('div', { style: { fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 } }, opts.name),
      e('div', { style: { fontSize: 30, fontWeight: 400, opacity: 0.85, marginTop: 8 } },
        `${opts.productCount} products \u00b7 EU warehouse \u00b7 next-day shipping`,
      ),
    ),
  );
}

function categoryTemplate(opts: { title: string; subtitle: string; accent: string }) {
  return frame(opts.accent,
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      e('div', {
        style: {
          fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3,
          color: opts.accent,
        },
      }, 'Catalog'),
      e('div', { style: { fontSize: 82, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 } }, opts.title),
      e('div', { style: { fontSize: 30, fontWeight: 400, opacity: 0.85, marginTop: 8 } }, opts.subtitle),
    ),
  );
}

function articleTemplate(opts: { title: string; category: string; accent: string }) {
  return frame(opts.accent,
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      e('div', {
        style: {
          fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3,
          color: opts.accent,
        },
      }, opts.category),
      e('div', {
        style: {
          fontSize: 64, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1.5,
          // Wrap long titles
          display: 'flex',
        },
      }, opts.title),
      e('div', { style: { fontSize: 28, fontWeight: 400, opacity: 0.75, marginTop: 12 } }, SITE_TAG),
    ),
  );
}

function gamificationTemplate(opts: { title: string; stat: string; accent: string }) {
  return frame(opts.accent,
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      e('div', {
        style: {
          fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3,
          color: opts.accent,
        },
      }, 'Rewards'),
      e('div', { style: { fontSize: 82, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 } }, opts.title),
      e('div', { style: { fontSize: 30, fontWeight: 400, opacity: 0.9, marginTop: 8 } }, opts.stat),
    ),
  );
}

function infoTemplate(opts: { title: string; subtitle?: string }) {
  return frame(FOREST,
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      e('div', {
        style: {
          fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3,
          color: FOREST,
        },
      }, 'Info'),
      e('div', { style: { fontSize: 78, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.5 } }, opts.title),
      e('div', { style: { fontSize: 28, fontWeight: 400, opacity: 0.85, marginTop: 12 } }, opts.subtitle ?? SITE_TAG),
    ),
  );
}

// ── Render → PNG ─────────────────────────────────────────────────────────────

async function render(elDef: SatoriEl, outPath: string) {
  const svg = await satori(elDef, {
    width: 1200,
    height: 630,
    fonts: FONTS as any,
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(outPath, png);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const filter = typeFilter();
  const supa = getSupabase();

  if (!supa) {
    console.warn(
      '[og] SUPABASE env vars missing — skipping dynamic (brand/category/article) OG images. ' +
        'The static types (gamification, info) will still generate and everything else falls back to /og-default.png.'
    );
  }

  // BRANDS
  if (supa && (!filter || filter === 'brand')) {
    const { data: brands } = await supa.from('brands').select('slug, name');
    const { data: products } = await supa.from('products').select('brand_slug').eq('is_active', true);
    const countByBrand = new Map<string, number>();
    for (const p of products ?? []) countByBrand.set(p.brand_slug, (countByBrand.get(p.brand_slug) ?? 0) + 1);
    let ok = 0;
    for (const b of brands ?? []) {
      const color = (brandColors as Record<string, string>)[b.slug] ?? defaultBrandColor;
      const out = resolve(OUT_DIR, `brand-${b.slug}.png`);
      await render(brandTemplate({
        name: b.name,
        slug: b.slug,
        productCount: countByBrand.get(b.slug) ?? 0,
        color,
      }), out);
      ok++;
    }
    console.log(`[og] brand: ${ok} images`);
  }

  // CATEGORY (flavors + strengths + top landing) — static list, no DB needed
  if (!filter || filter === 'category') {
    const categories: { slug: string; title: string; subtitle: string; accent: string }[] = [
      { slug: 'nicotine-pouches', title: 'Nicotine Pouches', subtitle: '700+ products \u00b7 EU-stocked', accent: '#3b82f6' },
      { slug: 'flavor-mint', title: 'Mint Nicotine Pouches', subtitle: 'Every mint, every brand', accent: '#10b981' },
      { slug: 'flavor-berry', title: 'Berry Nicotine Pouches', subtitle: 'Red fruit and wild berries', accent: '#e11d48' },
      { slug: 'flavor-citrus', title: 'Citrus Nicotine Pouches', subtitle: 'Bright, bold, punchy', accent: '#f59e0b' },
      { slug: 'flavor-tropical', title: 'Tropical Nicotine Pouches', subtitle: 'Mango, passion, pineapple', accent: '#f97316' },
      { slug: 'strength-light', title: 'Light Nicotine Pouches', subtitle: 'Under 4 mg \u00b7 beginner-friendly', accent: '#22c55e' },
      { slug: 'strength-normal', title: 'Normal Strength Pouches', subtitle: '4\u20137 mg \u00b7 daily driver', accent: '#3b82f6' },
      { slug: 'strength-strong', title: 'Strong Nicotine Pouches', subtitle: '8\u201312 mg', accent: '#f97316' },
      { slug: 'strength-extra-strong', title: 'Extra Strong Pouches', subtitle: '12\u201318 mg', accent: '#ef4444' },
      { slug: 'strength-super-strong', title: 'Super Strong Pouches', subtitle: '18 mg and up', accent: '#a855f7' },
    ];
    for (const c of categories) {
      const out = resolve(OUT_DIR, `category-${c.slug}.png`);
      await render(categoryTemplate(c), out);
    }
    console.log(`[og] category: ${categories.length} images`);
  }

  // GAMIFICATION
  if (!filter || filter === 'gamification') {
    const pages: { slug: string; title: string; stat: string; accent: string }[] = [
      { slug: 'rewards', title: 'The Vault', stat: 'Earn SnusCoins on every order', accent: '#fbbf24' },
      { slug: 'community', title: 'The Circle', stat: 'Real reviews. Real flavor notes.', accent: '#10b981' },
      { slug: 'membership', title: 'Membership', stat: 'Climb tiers. Unlock perks.', accent: '#a855f7' },
      { slug: 'daily-drop', title: 'Daily Drop', stat: 'New rewards every 24 hours', accent: '#ec4899' },
    ];
    for (const p of pages) {
      const out = resolve(OUT_DIR, `page-${p.slug}.png`);
      await render(gamificationTemplate(p), out);
    }
    console.log(`[og] gamification: ${pages.length} images`);
  }

  // INFO
  if (!filter || filter === 'info') {
    const pages: { slug: string; title: string; subtitle?: string }[] = [
      { slug: 'about', title: 'About SnusFriend', subtitle: 'Built by the pouch-curious, for the pouch-curious.' },
      { slug: 'faq', title: 'Frequently Asked Questions', subtitle: 'Everything on shipping, legal, products.' },
      { slug: 'shipping', title: 'Shipping', subtitle: 'EU warehouse \u00b7 Next-day to most of Europe.' },
      { slug: 'terms', title: 'Terms of Service' },
      { slug: 'privacy', title: 'Privacy Policy' },
    ];
    for (const p of pages) {
      const out = resolve(OUT_DIR, `page-${p.slug}.png`);
      await render(infoTemplate(p), out);
    }
    console.log(`[og] info: ${pages.length} images`);
  }

  // ARTICLE (blog)
  if (!filter || filter === 'article') {
    const blogDir = resolve(process.cwd(), 'src/pages/blog');
    const fs = await import('node:fs');
    const articles = fs.readdirSync(blogDir)
      .filter((f) => f.endsWith('.astro') && f !== 'index.astro')
      .map((f) => f.replace(/\.astro$/, ''));
    // Extract title from each article's frontmatter — cheap regex, good enough
    const categoryMap: Record<string, { accent: string; label: string }> = {
      'Health & Safety': { accent: '#C62828', label: 'Health & Safety' },
      'Brand Spotlight': { accent: '#2E7D32', label: 'Brand Spotlight' },
      'Comparison': { accent: '#1565C0', label: 'Comparison' },
      'Buying Guide': { accent: '#BF360C', label: 'Buying Guide' },
      'Guide': { accent: '#2E7D32', label: 'Guide' },
      'Ranking': { accent: '#6A1B9A', label: 'Ranking' },
      'Flavour Guide': { accent: '#00838F', label: 'Flavour Guide' },
      'FAQ': { accent: '#37474F', label: 'FAQ' },
    };
    let ok = 0;
    for (const slug of articles) {
      const src = fs.readFileSync(resolve(blogDir, `${slug}.astro`), 'utf-8');
      const titleMatch = src.match(/(?:^const\s+title\s*=\s*|title=)['"`]([^'"`\n]+)['"`]/m);
      const categoryMatch = src.match(/category=['"]([^'"]+)['"]/);
      const title = titleMatch?.[1]?.replace(/ \| SnusFriend.*/, '') ?? slug.replace(/-/g, ' ');
      const cat = categoryMap[categoryMatch?.[1] ?? 'Guide'] ?? { accent: FOREST, label: 'Guide' };
      const out = resolve(OUT_DIR, `article-${slug}.png`);
      await render(articleTemplate({ title, category: cat.label, accent: cat.accent }), out);
      ok++;
    }
    console.log(`[og] article: ${ok} images`);
  }

  console.log(`[og] done \u2192 ${OUT_DIR}`);
}

main().catch((err) => {
  console.error('[og] error:', err);
  process.exit(1);
});
