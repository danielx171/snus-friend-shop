# Code Quality & SEO Hardening Sprint — Design Spec

**Date:** 2026-04-08
**Branch:** astro-migration-clean
**Goal:** Eliminate recurring blog registry drift, fix build-time side effects, harden test suite, batch-apply meta title optimizations, and add AI citation blocks to top pages.

---

## 1. Test Suite Cleanup

Run `bun run test`. Fix any actual failures:
- `ReputationBadge.test.tsx` — if the `bg-gray` class assertion fails, update to match current class
- `setup.ts` — if Supabase storage error occurs, add minimal localStorage mock

If tests pass, skip.

## 2. Blog Auto-Registry

**Problem:** Blog index and RSS maintain separate hardcoded article arrays. They drift every time a new article is added.

**Solution:** Single source of truth in `src/data/blog-registry.ts`.

### New file: `src/data/blog-registry.ts`

```ts
export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
}

export const blogArticles: BlogArticle[] = [
  // All 73+ articles here
];
```

### Consumers

- `src/pages/blog/index.astro` — remove inline `articles` array, import from registry
- `src/pages/rss.xml.ts` — remove inline `articles` array, import from registry

### Build-time validation

Add to the end of the blog index frontmatter:

```ts
import { blogArticles } from '@/data/blog-registry';
import fs from 'node:fs';
import path from 'node:path';

const blogDir = path.resolve('./src/pages/blog');
const astroFiles = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.astro') && f !== 'index.astro')
  .map(f => f.replace('.astro', ''));
const registrySlugs = new Set(blogArticles.map(a => a.slug));
const missing = astroFiles.filter(f => !registrySlugs.has(f));
if (missing.length > 0) {
  throw new Error(`Blog registry missing entries for: ${missing.join(', ')}. Add them to src/data/blog-registry.ts`);
}
```

## 3. products.json Build Writes

Change `src/pages/nicotine-pouches.astro` from `writeProductsJson()` to `ensureProductsJson()`. The `/products` index page already calls `writeProductsJson()` — that's the only one that needs to force-overwrite.

## 4. Meta Title Batch Rewrites

Apply optimized titles from `cowork/content/audit-title-meta-tags.json` to blog articles with P0/P1 priority flags.

## 5. Already Done

content.config.ts throws on missing env vars (commit 506d74c3).

## 6. GEO Quick Answer Blocks

Add "Quick Answer" div to top 10 articles by GSC impressions, using the existing pattern:

```html
<div class="quick-answer" style="background: linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--card)) 100%); border: 1px solid hsl(var(--primary) / 0.15); border-radius: 12px; padding: 24px; margin: 24px 0;">
  <p style="font-size: 13px; font-weight: 700; color: hsl(var(--primary)); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Quick Answer</p>
  <p style="font-size: 16px; line-height: 1.6; margin: 0;">[2-3 sentence answer]</p>
</div>
```

Target articles: best-nicotine-pouches-2026, strongest-nicotine-pouches-ranked-2026, zyn-flavours-complete-guide, best-nicotine-pouches-for-beginners-2026, nicotine-pouches-vs-cigarettes, nicotine-pouches-vs-snus, how-to-use-nicotine-pouches, what-are-nicotine-pouches, are-nicotine-pouches-safe, how-to-choose-your-strength.
