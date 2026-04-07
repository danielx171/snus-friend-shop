# SEO Quick Wins Sprint — Design Spec

**Date:** 2026-04-07
**Branch:** astro-migration-clean
**Goal:** Capture existing search traffic by fixing discoverability issues, URL inconsistencies, and low CTR on pages that are already ranking.

---

## Context (from GSC data)

- 942 impressions/28 days, 2 clicks, 0.21% CTR, avg position 25.8
- `/blog/best-nicotine-pouches-2026` at position 9.2 with 279 impressions, 0 clicks
- `/blog/strongest-nicotine-pouches/` (trailing slash) at position 27.5 with 297 impressions
- `/blog/zyn-flavours-complete-guide` at position 34.4 with 231 impressions
- Trailing slash duplicates: `/shipping` vs `/shipping/`, `/terms` vs `/terms/`
- Blog index is hardcoded — 74 articles exist but only ~20 are linked from the index
- 11 new articles (6 comparison + 5 country guides) just added, not yet indexed

---

## 1. Blog Index Overhaul

**Current:** `src/pages/blog/index.astro` has a hardcoded `featuredArticles` array. New articles don't appear unless manually added.

**Target:** Static page with category sections, all 74 articles rendered in HTML.

### Structure

```
[BlogHero: "SnusFriend Blog — Guides, Reviews & Comparisons"]

[Featured Row: 3-4 manually curated articles as large cards]

[Section: "Brand Comparisons" — ZYN vs VELO, ZYN vs LOOP, etc.]
[Section: "Brand Guides" — ZYN complete guide, VELO guide, etc.]
[Section: "Country Buying Guides" — Austria, Denmark, Norway, etc.]
[Section: "Best-Of Lists" — best 2026, best mint, best strong, etc.]
[Section: "Guides & Knowledge" — how to use, safety, strength guide, etc.]
```

### Implementation Approach

Create a blog article registry — a single TypeScript object that maps every blog slug to its metadata (title, description, category, readTime). The blog index reads this registry and renders sections by category.

**File:** `src/data/blog-registry.ts`

```ts
export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  category: 'comparison' | 'brand-guide' | 'country-guide' | 'best-of' | 'guide';
  readTime: string;
  featured?: boolean;
}

export const blogArticles: BlogArticle[] = [
  // All 74 articles listed here
];
```

**Why a registry instead of glob/getCollection:** Blog articles don't use Astro content collections (they're plain .astro pages). Glob patterns can find files but can't extract metadata. A registry gives us typed, sortable, filterable article data without adding a content collection migration.

### Blog Index Page

- Import `blogArticles` from the registry
- Group by category
- Render featured articles first (large cards with description)
- Render each category section with article cards (title + readTime + category pill)
- All static HTML, no JavaScript, no pagination

---

## 2. Trailing Slash Audit & Fix

### Verify Astro behavior

First, check if Astro + Vercel adapter with `trailingSlash: 'never'` already handles 301 redirects for trailing slashes. If it does, no action needed.

### If not handled

Add a catch-all redirect in `vercel.json`:

```json
{
  "redirects": [
    { "source": "/(.*)/", "destination": "/$1", "permanent": true }
  ]
}
```

This strips trailing slashes from ALL URLs in one rule rather than listing individual pages.

### Verify GSC duplicates

After the fix is deployed, monitor these pairs in GSC:
- `/blog/strongest-nicotine-pouches/` → `/blog/strongest-nicotine-pouches`
- `/shipping/` → `/shipping`
- `/terms/` → `/terms`

---

## 3. Meta Title & Description Optimization

Rewrite titles and meta descriptions for the top 6 pages by impressions. Strategy: numbers + brackets + differentiation.

| Page | Current Title | New Title | New Meta Description |
|------|---------------|-----------|---------------------|
| `/blog/best-nicotine-pouches-2026` | Best Nicotine Pouches 2026 | 10 Best Nicotine Pouches 2026 (708 Products Tested) | We tested 708 nicotine pouches from 35+ brands. Here are the 10 best for flavour, strength, and value in 2026. Updated monthly. |
| `/blog/strongest-nicotine-pouches` | Strongest Nicotine Pouches Ranked 2026 | Strongest Nicotine Pouches 2026: 12mg to 50mg Ranked | From White Fox Full Charge to Siberia -80°C — every strong pouch ranked by mg/pouch. Includes beginner warnings and step-down guide. |
| `/blog/zyn-flavours-complete-guide` | ZYN Flavours Complete Guide | All 15+ ZYN Flavours Ranked (2026 Guide) | Every ZYN flavour ranked by taste, strength, and popularity. Cool Mint, Citrus, Espressino, and more — with prices and where to buy. |
| `/nicotine-pouches` | Nicotine Pouches | Buy Nicotine Pouches Online — 708 Products from 35+ Brands | Shop 708 nicotine pouches with free EU shipping over €29. ZYN, VELO, LOOP, Siberia, and more. Filter by strength, flavour, and brand. |
| `/faq` | FAQ | Nicotine Pouches FAQ: 30+ Questions Answered (2026) | Everything you need to know about nicotine pouches — safety, strength, flavours, how to use, and where to buy. Expert answers updated for 2026. |
| `/products` | Products | Buy Nicotine Pouches — 708 Products, Free EU Shipping | Browse 708 nicotine pouches from ZYN, VELO, LOOP, Siberia, and 30+ more brands. Free shipping on orders over €29. Same-day dispatch. |

---

## 4. Internal Linking Pass

Add contextual links from high-authority existing pages to the 11 new articles:

| From Page | Add Link To | Context |
|-----------|-------------|---------|
| `/blog/zyn-nicotine-pouches-complete-guide` | `/blog/zyn-vs-loop-2026`, `/blog/zyn-vs-skruf-2026` | "See how ZYN compares to..." section |
| `/blog/velo-nicotine-pouches-complete-guide` | `/blog/velo-vs-loop-2026` | "How does VELO stack up against..." |
| `/blog/white-fox-nicotine-pouches-complete-guide` | `/blog/white-fox-vs-siberia-2026` | "White Fox vs Siberia comparison" |
| `/blog/strongest-nicotine-pouches` | `/blog/white-fox-vs-siberia-2026` | "Compare the two strongest brands" |
| `/blog/klar-complete-guide` | `/blog/klar-vs-fumi-2026` | "KLAR vs FUMI comparison" |
| `/countries/austria` | `/blog/buying-nicotine-pouches-austria-2026` | "Read our full Austria buying guide" |
| `/countries/denmark` | `/blog/buying-nicotine-pouches-denmark-2026` | Same pattern |
| `/countries/norway` | `/blog/buying-nicotine-pouches-norway-2026` | Same pattern |
| `/countries/finland` | `/blog/buying-nicotine-pouches-finland-2026` | Same pattern |
| `/countries/poland` | `/blog/buying-nicotine-pouches-poland-2026` | Same pattern |

Each link is a 1-2 sentence contextual addition — not a footer link block.

---

## 5. Sitemap Resubmit

After deploy:
1. Build regenerates sitemap with 11 new articles (1,127 → ~1,140 URLs)
2. Resubmit sitemap-index.xml via GSC API
3. Verify new URLs appear in sitemap

---

## Execution Order

```
1. Blog registry + index overhaul (biggest impact)
2. Trailing slash audit + fix
3. Meta title/description optimization
4. Internal linking pass
5. Sitemap resubmit (after deploy)
```

---

## Success Criteria

- [ ] Blog index renders all 74 articles grouped by category
- [ ] No trailing slash duplicates in GSC (single canonical for each URL)
- [ ] Top 6 pages have optimized titles/descriptions with numbers and brackets
- [ ] 11 new articles each have at least 1 contextual internal link from an existing page
- [ ] Sitemap resubmitted with updated URL count
