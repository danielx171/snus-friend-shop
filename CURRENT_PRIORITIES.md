# Current Priorities

Last updated: 2026-04-10

## Site Status: Soft Launch (Preview)

Live at snusfriends.com. Checkout functional but not actively selling yet.

## Current State

- **Products:** 708 active, 55 brands
- **Blog:** 80 articles, 87 registry entries (includes redirected slugs)
- **Quick Answers:** 58/80 articles have Quick Answer blocks
- **BlogPosting schema:** 80/80
- **FAQPage schema:** 80/80 articles + brand pages + catalog + rewards
- **Performance:** /nicotine-pouches at 92 (was 61), CLS 0
- **Cart:** Cross-island sync v4 deployed, needs Codex verification
- **Rewards:** Canonical config at `src/config/rewards.ts` — 1 SnusCoin/€1
- **Gamification:** The Vault, SnusCoins, Circles, Missions, Badges, Daily Drop, The Board
- **Version:** 1.6.1

## Completed (April 8-10 Sprint)

### SEO/Schema
- [x] BlogPosting schema on all 80 articles
- [x] Product aggregateRating + mpn on all 708 products
- [x] Organization schema with PostalAddress + social sameAs
- [x] FAQPage on /nicotine-pouches (9 questions) + all brand pages (3 each)
- [x] Strength redirects 301 (/mild→/light, /regular→/normal)
- [x] Sitemap lastmod differentiation (3 distinct dates)
- [x] RSS autodiscovery link
- [x] Preconnect to Nyehandel image CDN
- [x] hreflang x-default + en tags
- [x] IndexNow key verification file
- [x] Author page updated with Cowork bio + Person schema
- [x] Author credential consistency (Master's in Public Health)
- [x] Meta-length fixes (3 pages)
- [x] Brand meta descriptions fixed (no more "..." truncation)

### Content
- [x] "According to SnusFriend" attribution in top 10 articles
- [x] Commercial bridge sections in 10 articles
- [x] Quick Answer blocks added to 38→58 articles
- [x] Internal links added to 12+ articles
- [x] Blog card date + author line on index page
- [x] Dynamic editorial facts helper (no hardcoded counts)
- [x] dateModified updated on 10 modified articles

### Performance
- [x] /nicotine-pouches inline productsJson (eliminates fetch waterfall)
- [x] ProductCard 3D tilt removed (CLS fix)
- [x] Skeleton count matched to ITEMS_PER_PAGE
- [x] min-height on grid wrapper

### Gamification
- [x] Full naming overhaul (33 files): The Vault, SnusCoins, Circles, Missions, etc.
- [x] Logged-out preview layers on rewards, community, membership
- [x] SnusCoin teasers on PDP, cart drawer, order confirmation
- [x] Canonical rewards config (src/config/rewards.ts)
- [x] DB triggers fixed: 1 coin/€1 (was 10), review rewards 40/25
- [x] Rewards page expanded to 800+ words
- [x] Brand pages: visible descriptions + mini-FAQ + SEO meta
- [x] Gamification DB migration applied (tiers + quests + achievements)

### Conversion/UX
- [x] Brand page hero: enlarged mosaic, removed monogram, brand glow
- [x] Flavour quiz results → real ProductCards with add-to-cart
- [x] BlogProductCard strength dots
- [x] PDP suggestion rows (same flavour + similar strength)
- [x] Membership page aspirational "The Circles" heading
- [x] Verified vs community review badges + sort (DB + UI)
- [x] Display name priority chain
- [x] Leaderboard monthly/alltime toggle
- [x] Step-down suggestions on high-strength PDPs

### Trust
- [x] Physical address in footer (Nordic Express AB, Göteborg)
- [x] Soft-launch preview note in footer
- [x] Theme toggle fix
- [x] What's New page updated (v1.6.1)
- [x] FAQ tail section layout fix
- [x] Entity naming consistency

## Remaining

### HIGH — Needs Codex/Cowork
- [ ] Cart verification (Codex browser test — v4 sync deployed)
- [ ] Quick Answers for remaining 22 articles (Cowork batch 4)
- [ ] Finland/Norway legal content reconciliation (Cowork legal review)
- [ ] Medical reviewer persona for YMYL articles (Cowork)
- [ ] Full-tool audit: PageSpeed ×10 pages, GSC index status, Sentry errors

### MEDIUM
- [ ] Phase 2 SSR product grid (only if /nicotine-pouches < 85 after measurement)
- [ ] Brand page real logos (need assets)
- [ ] OG images per page type (Cowork design specs)
- [ ] products.json further optimization (marginal gain)

### LOW
- [ ] compare.astro → React island (large scope)
- [ ] hreflang for DE/SV translations (future)
- [ ] Screaming Frog full crawl analysis

## Key Reference Files

| File | Purpose |
|------|---------|
| `ROADMAP.md` | Delivery sequence, Steps 1-56 |
| `src/config/rewards.ts` | Canonical rewards config (single source of truth) |
| `src/data/editorial-facts.ts` | Dynamic product/brand counts |
| `docs/superpowers/specs/2026-04-10-wave2-seo-conversion-design.md` | Wave 2 spec |
| `docs/superpowers/specs/2026-04-10-wave3-community-moat-design.md` | Wave 3 spec |
| `docs/superpowers/specs/2026-04-09-ssr-product-grid-design.md` | SSR product grid spec |
| `cowork/content/codex-rewards-and-blog-credibility-audit-apr10.md` | Codex trust audit |
