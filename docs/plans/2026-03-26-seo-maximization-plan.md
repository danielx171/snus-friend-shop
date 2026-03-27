# SEO Maximization & Remaining Work Plan

**Date:** 2026-03-26
**Branch:** astro-migration-clean
**Status:** Site live on snusfriends.com, Astro 6 deployed

---

## Lighthouse Baseline (March 26, 2026 — Mobile)

| Metric | Homepage | Product Page | Brands Page |
|--------|----------|-------------|-------------|
| LCP | 173ms | 119ms | 113ms |
| CLS | 0.00 | 0.00 | 0.00 |
| SEO | **100** | **100** | **100** |
| Best Practices | 96 | 100 | 100 |
| Accessibility | 83 | 89 | 95 |

**Verdict:** Performance is exceptional. SEO score is perfect. Accessibility is the main gap.

---

## Phase 1: Fix Critical Issues (Blocks Crawling)

### 1A. Create `/nicotine-pouches` redirect or page
**Problem:** Sitemap lists `/nicotine-pouches` with priority 0.9, but no page exists → 404 for Google.
**Options:**
- **(Recommended)** Create `src/pages/nicotine-pouches.astro` as the primary catalog page (SEO keyword target: "nicotine pouches") — can redirect or be a styled wrapper around the products page
- OR add Vercel redirect `/nicotine-pouches` → `/products`
**SEO value:** "nicotine pouches" is the #1 money keyword. Having a dedicated page with unique H1 + intro copy is significantly better than a redirect.

### 1B. Audit sitemap vs actual routes
**Problem:** Sitemap was generated from old SPA routes. Badge query-param URLs (`?badge=new`, `?badge=popular`) may not resolve.
**Action:** Regenerate sitemap from actual Astro pages using `@astrojs/sitemap` integration. Remove stale URLs.

### 1C. Fix React hydration errors (#418, #423)
**Problem:** ProductCard islands on homepage cause hydration mismatch → React re-renders from scratch.
**Action:** Apply the mounted-state pattern to any remaining islands that read from persistentAtom stores on first render.

---

## Phase 2: Accessibility Fixes (Lighthouse 83→95+)

### 2A. Color contrast — navy on dark navy
**Problem:** `text-primary` (#00328a) on dark backgrounds has 1.4:1 contrast ratio (need 4.5:1).
**Action:** Add a `--primary-foreground-on-dark` CSS variable (lighter blue/white) for text on dark backgrounds. Update header, footer, brand links.

### 2B. Strength indicator ARIA
**Problem:** `<div aria-label="Strength 2 of 5">` without a role.
**Action:** Add `role="img"` to strength indicator divs.

### 2C. Login link label mismatch
**Problem:** `aria-label="Sign in"` but visible text says "Login".
**Action:** Change aria-label to "Login" (match visible text).

### 2D. Progressbar accessible names
**Problem:** Review rating progressbars lack `aria-label`.
**Action:** Add `aria-label="N star reviews"` to each bar.

### 2E. Product card link names
**Problem:** Wrapper `<a>` on product cards has no accessible text.
**Action:** Add `aria-label` with product name, or remove redundant wrapper link.

### 2F. Touch targets
**Problem:** Brand name links in cards are 16px tall (need 24px minimum).
**Action:** Add vertical padding to brand-name links.

---

## Phase 3: SEO Structured Data Enhancement

### 3A. FAQPage schema on /faq
**Action:** Add JSON-LD `FAQPage` schema with all Q&A pairs. Google shows FAQ rich results for e-commerce.
**Template:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

### 3B. BreadcrumbList JSON-LD (already have microdata)
**Status:** Breadcrumb.astro already outputs BreadcrumbList microdata. ✅
**Enhancement:** Optionally add JSON-LD version too (Google prefers JSON-LD). Low priority since microdata works.

### 3C. WebSite + SearchAction schema on homepage
**Action:** Add `WebSite` schema with `SearchAction` — enables Google sitelinks search box.
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://snusfriends.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://snusfriends.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 3D. CollectionPage schema on category pages
**Action:** Add `CollectionPage` schema to `/products/flavor/[key]` and `/products/strength/[key]` pages with product count and description.

### 3E. Brand schema on `/brands/[slug]`
**Action:** Add `Brand` schema with logo, description, and link to manufacturer.

---

## Phase 4: GEO (Generative Engine Optimization)

**Goal:** Make content optimally consumable by AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended) which are already allowed in robots.txt.

### 4A. Semantic HTML structure
**Status:** Astro SSG already outputs clean semantic HTML. ✅
**Enhancement:** Ensure every page has:
- Single `<h1>` (verified ✅)
- Logical heading hierarchy (h1→h2→h3)
- `<article>` wrapper on product detail pages
- `<section>` with descriptive `aria-label` for major page sections

### 4B. Unique, authoritative content per page
**Action:** Add intro copy to category/filter pages. Currently they're just product grids.
- `/products/flavor/mint` → 150-word intro: "What makes mint nicotine pouches popular..."
- `/products/strength/strong` → 150-word intro: "Strong nicotine pouches (8-12mg)..."
- Each flavor/strength page gets unique copy → AI models cite pages with depth

### 4C. Structured data completeness (feeds AI knowledge graphs)
- Product schema with `brand`, `offers`, `aggregateRating` ✅ already done
- FAQ schema (Phase 3A) — AI models heavily cite FAQ content
- Add `HowTo` schema for educational content ("How to use nicotine pouches")

### 4D. Internal linking strategy
**Action:** Add contextual cross-links:
- Product pages → related flavor category
- Category pages → related strength levels
- FAQ → relevant product pages
- Blog posts → category/product pages
**Why:** AI models follow link structure to build topic authority graphs.

### 4E. llms.txt file
**Action:** Create `/public/llms.txt` — a plain-text file describing the site for AI crawlers.
```
# SnusFriend
> Europe's largest online nicotine pouch store with 700+ products from 91 brands.

## About
SnusFriend sells tobacco-free nicotine pouches...

## Key Pages
- /products — Full catalog (700+ products)
- /brands — 91 brands
- /faq — Common questions about nicotine pouches
- /products/flavor/mint — Mint flavored pouches
...
```

### 4F. Content freshness signals
**Action:** Add `dateModified` to product schema (from Supabase `updated_at`). AI models prefer fresh content.

---

## Phase 5: Content & Copy

### 5A. Category page intro copy (12 pages)
Each flavor and strength page needs 100-200 words of unique content above the product grid. This is the single highest-ROI SEO action — turns thin filter pages into rankable content pages.

### 5B. `/nicotine-pouches` landing page copy
500-word authoritative piece: "Buy Nicotine Pouches Online — 700+ Products from 91 Brands". This is the money page.

### 5C. Blog seed content (3-5 posts)
- "What Are Nicotine Pouches? Complete Guide"
- "How to Choose the Right Nicotine Strength"
- "Top 10 Mint Nicotine Pouches 2026"
- "ZYN vs VELO vs LOOP: Brand Comparison"
**SEO value:** Long-tail keyword capture, internal link anchors, AI citation targets.

### 5D. Legal pages (needs solicitor sign-off)
Draft content for Terms, Privacy Policy, Cookie Policy covering:
- 18+ age requirement, nicotine products
- GDPR, EU e-commerce regulations
- Nyehandel as payment processor
- Supabase as data processor

---

## Phase 6: Technical SEO Polish

### 6A. Hreflang alternates
i18n is configured (en/sv) but no hreflang links in `<head>`. Add:
```html
<link rel="alternate" hreflang="en" href="https://snusfriends.com/..." />
<link rel="alternate" hreflang="sv" href="https://snusfriends.com/sv/..." />
<link rel="alternate" hreflang="x-default" href="https://snusfriends.com/..." />
```
**Note:** Only add if Swedish pages actually exist. If not, remove i18n from sitemap config.

### 6B. Image optimization
- Add explicit `width` and `height` to product images (prevents CLS, helps LCP)
- Use Astro `<Image>` component for automatic WebP/AVIF conversion
- Add `loading="lazy"` on below-fold images (already done for most ✅)

### 6C. Remove legacy dependencies
Still in package.json: `react-router-dom`, `react-helmet-async`, `next-themes`.
Dead weight — remove to shrink bundle.

### 6D. Canonical URL audit
Ensure no duplicate content issues:
- `/products` vs `/nicotine-pouches` (if both exist, one must canonical to the other)
- Query param pages (`?badge=new`) should have `rel="canonical"` pointing to the base URL

### 6E. Open Graph images
Create per-page OG images:
- Product pages: product image + brand + price
- Category pages: category name + product count
- Homepage: branded hero image

---

## Phase 7: Monitoring & Iteration

### 7A. Submit sitemap to Google Search Console
Verify snusfriends.com in GSC, submit regenerated sitemap.

### 7B. Monitor indexing
Check GSC coverage report weekly — ensure all product pages are indexed.

### 7C. Track rankings
Use GSC + DataForSEO to track:
- "nicotine pouches" (primary keyword)
- "buy nicotine pouches online"
- "best [flavor] nicotine pouches"
- Brand + product name queries

### 7D. A/B test meta descriptions
Once indexed, experiment with CTAs in meta descriptions to improve click-through rates.

---

## Execution Priority (Recommended Order)

```
IMMEDIATE (today):
├── 1A: Create /nicotine-pouches page (SEO critical)
├── 1B: Regenerate sitemap
├── 1C: Fix hydration errors
└── 2A-2F: Accessibility fixes (all quick)

THIS WEEK:
├── 3A: FAQPage schema
├── 3C: WebSite + SearchAction schema
├── 4E: llms.txt
├── 5B: /nicotine-pouches landing copy
└── 6C: Remove legacy deps

NEXT WEEK:
├── 4B: Category page intro copy (12 pages)
├── 3D-3E: CollectionPage + Brand schemas
├── 5C: Blog seed content
├── 6A: Hreflang (if Swedish pages exist)
└── 6D: Canonical audit

ONGOING:
├── 5A: Write unique copy for all filter pages
├── 6E: OG images
├── 7A-7D: Monitoring
└── 5D: Legal pages (when solicitor ready)
```

---

## Gamification (Parked — Resume After SEO)

Per the Phase 3 plan, these features are built but need backend wiring:
- A0: Spin wheel (missing DB tables)
- A1: Order → quest progress triggers
- A2: Quest → avatar unlock chains
- C1-C2: Points redemption
- C3: Membership tiers
- C4: Transactional email (Resend)

Resume after SEO foundation is solid and site is indexing properly.
