# Current Priorities

Last updated: 2026-04-15

## Site Status: Live

Live at snusfriends.com. Launch Polish Sprint (Apr 8–12) shipped in full.

## Current State

- **Products:** 708 active, 55 brands
- **Blog:** 81 articles (registry in sync at 81 slugs)
- **Quick Answers:** 81/81 articles ✅
- **PAA blocks:** 81/81 articles ✅
- **BlogPosting + FAQPage schema:** 81/81 articles + brand pages + catalog + rewards
- **Tests:** 54 passing (cart, email regex, checkout/NYE line items, auth schemas, components, hooks)
- **Performance:** `/nicotine-pouches` 92, PDPs 94, homepage 82 (LCP ~4s — next optimization target)
- **OG images:** Satori pipeline generating per-page PNGs; blog posts auto-resolve to `/og/article-{slug}.png`
- **Rewards:** Canonical config at `src/config/rewards.ts` — **10 SnusCoins per €1** (aligned with DB trigger)
- **Gamification:** The Vault, SnusCoins, Circles, Missions, Badges, Daily Drop, The Board
- **Version:** 1.6.1
- **Audit tooling:** Search Console + GA4 read scripts live; PageSpeed CLI is implemented but still blocked locally by `API_KEY_HTTP_REFERRER_BLOCKED`; rank tracking is implemented but blocked by Google Custom Search JSON API access

## Today’s Setup Pass

- [x] ProductCard controls consolidated into one `client:visible` island and stale tilt JS removed.
- [x] Header compare/rewards/cart cluster consolidated into one `client:idle` island.
- [x] Base layout font preload corrected to the actual default sans family.
- [x] Repo-local Codex MCP config added for Context7, Sentry, and GitHub in `.codex/config.toml`.
- [x] Shared `JsonLd` helper now covers the long-tail page sweep too; `astro check` hints dropped from 252 to 128.
- [ ] Standalone follow-up still pending on `src/pages/blog/index.astro`.
- [x] `pagefind` removed entirely; search remains JSON-driven and the extra indexing scripts are gone.
- [x] Skills updated/created for future audits and Astro-first polish:
  - `snusfriend-design-system`
  - `web-quality-audit`
  - `astro-island-budget`
  - `snusfriend-audit-runbook`
  - `trust-sensitive-editorial`
- [ ] Still blocked: PageSpeed CLI auth and Google rank backend.
- [ ] Next implementation targets: finish `blog/index` JSON-LD, replace repeated inline form handlers, further storefront island consolidation.

## Remaining

> **Open work lives in [`BACKLOG.md`](./BACKLOG.md)** — single source of truth with P0–P3 tiers and ownership tags (🧠/👤/✍️/🔌). The sections below are kept for archival continuity.

### HIGH — Schema debt + blocked on external deliverables

- [x] **Subscriptions table migration** — retroactive migration added (`20260413000100_subscriptions.sql`) matching live DB state incl. RLS policies, CHECK constraints, partial index on active rows.
- [x] **Shopify schema residue dropped** — `product_variants.shopify_variant_id` + `sku_mappings.shopify_sku` removed via `20260413000000_drop_shopify_residue.sql`; types.ts updated.
- [x] **Phantom code cleanup** — orphan `QuestComplete.tsx` + `browsing-history.ts` deleted; `search.astro` switched to `writeProductsJson`; dead `ensureProductsJson` helper removed.
- [x] 2026-04-12 Codex 🔴 items verified resolved: `process-subscriptions:128` idempotency (no double-credit — only ops_alert inserted, points flow through NYE order trigger), `manage-subscription:102` `discount_pct` (column present), `register.astro:98` resend (JSON fetch handler at line 351 matches `sendMagicLink` accept mode).

### HIGH — Blocked on external deliverables

- [ ] Finland/Norway legal content reconciliation (Cowork legal review)
- [ ] Medical reviewer persona for YMYL articles (Cowork)
- [x] Homepage proof-led copy refresh shipped on hero + guide grid (further Cowork variations optional)
- [x] First CTR refresh shipped on `/blog/best-nicotine-pouches-netherlands-2026`, `/blog/best-nicotine-pouches-germany-2026`, `/blog/best-nicotine-pouches-sensitive-gums`, `/blog/buying-nicotine-pouches-norway-2026`, `/blog/zyn-vs-nordic-spirit`, and `/blog/best-nicotine-pouches-2026`
- [ ] Klaviyo wiring (5 template IDs exist; needs Klaviyo UI setup + events from `create-nyehandel-checkout`)
- [ ] Trustpilot business profile + footer widget (20 min account creation)
- [ ] Cart verification via Codex browser test (v4 BroadcastChannel sync deployed)
- [ ] Full-tool audit follow-up: switch rank tracking away from Google Custom Search JSON API (or use a grandfathered project) so `seo_rank_tracking` can run end-to-end

### MEDIUM

- [ ] Homepage LCP optimization (82 → 90+, LCP ~4s → <2.5s). Profile element, defer non-critical islands.
- [ ] Finish the standalone `blog/index.astro` JSON-LD follow-up
- [ ] Monitor the refreshed CTR pages in Search Console for 14 days and iterate on snippets/internal links based on impressions + CTR.
- [ ] Brand page real logos (still placeholder for brands without `logoUrl` — monogram tile is the fallback)
- [ ] `products.json` aggressive slim (236KB → ≤150KB target; would need gzip or dropping more fields)
- [ ] Blog read-time field on cards (registry schema supports it, not populated)

### LOW — Future

- [ ] hreflang for DE/SV translations
- [ ] Screaming Frog full crawl analysis
- [ ] Figma MCP integration (next visual sprint)
- [ ] Ahrefs / Brand Radar MCP (AI citation + backlink tracking)
- [ ] `alert-manager` + `rank-tracker` configuration
- [ ] `memory-management` skill activation

## Completed in Apr 8–12 Launch Polish Sprint

### SEO / Schema
- [x] BlogPosting + FAQPage schema on all 81 articles
- [x] Quick Answer blocks: 38 → 80/80
- [x] PAA blocks: 68 → 80/80
- [x] Product aggregateRating + mpn on all 708 products
- [x] Organization schema with PostalAddress + social sameAs
- [x] Strength redirects (/mild→/light, /regular→/normal)
- [x] Sitemap lastmod differentiation + RSS autodiscovery
- [x] hreflang x-default + en tags, preconnect to Nyehandel CDN
- [x] IndexNow key verification file
- [x] Meta descriptions: length + "..." truncation fixed across brands
- [x] Satori per-page OG pipeline (`/og/article-{slug}.png`, brand, category, gamification templates)
- [x] 64 blog posts: stripped SVG `ogImage` overrides — each now inherits Satori PNG

### Content
- [x] Dynamic editorial-facts helper (no hardcoded counts)
- [x] Author page: Cowork bio + Person schema + credential consistency
- [x] `dateModified` + blog card date/author line
- [x] Internal links in 12+ articles + commercial bridges in 10
- [x] "According to SnusFriend" attribution in top 10 articles

### Performance
- [x] `/nicotine-pouches` 61 → 92 (URL variant for products.json, `client:idle` grid)
- [x] `writeProductsJson` replaces `ensureProductsJson` — prevents stale JSON across rebuilds
- [x] ProductCard 3D tilt removed, skeleton count matched, grid min-height set
- [x] Excessive `backdrop-blur-sm` reduced (79 → 1 occurrence)
- [x] Homepage consolidated from 13 → ~9 sections

### Conversion / UX
- [x] ProductCard conversion polish — review count, compare price + savings %, per-pouch cost, SnusCoin earn line
- [x] Rewards page: gamified hero (destination feel, live-balance slot, CTA row)
- [x] Blog cards: magazine-style thumbnails (OG as hero), author + date line, category accent
- [x] Brand page monogram tile fallback when `logoUrl` missing
- [x] `compare.astro` → `CompareIsland` React island (CLAUDE.md XSS debt closed)
- [x] Homepage trust bar + rewards strip above-fold + newsletter CTAs on top 5 blog posts
- [x] Mobile bottom nav, cross-island cart sync v4 (BroadcastChannel)
- [x] Verified vs community review badges, leaderboard toggle, step-down PDP suggestions
- [x] Hover smudge, live coins, subscribe breakdown, register flow — polish pass

### Gamification
- [x] Full naming overhaul (33 files): The Vault, SnusCoins, Circles, Missions
- [x] DB triggers aligned: **10 SnusCoins per €1** (was mismatched 1 client / 10 DB)
- [x] Review rewards 40/25, logged-out preview layers, PDP SnusCoin teasers
- [x] Canonical `src/config/rewards.ts` as single source of truth
- [x] Rewards page expanded to 800+ words

### Design Polish
- [x] Global CSS utilities: `text-gradient-primary`, `glow-breathe`, `ring-pulse`, `shimmer-sweep`, `tier-line-gradient`
- [x] Rewards + membership + community pages: CSS effects respect `prefers-reduced-motion`
- [x] Brand colors: missing rabbit/nois/+6 added; `defaultBrandColor` darkened for WCAG text contrast
- [x] Product badges: white-on-bright → dark-on-light (2.15:1 → 7:1)
- [x] Heading DOM noise cleaned (AgeGate h2, MegaMenu h3)

### Testing / Quality
- [x] 43 new tests: cart operations, email regex, checkout/NYE line items, auth schemas (ROADMAP Step 55)
- [x] Mix-discount regression test (nanostores computed args bug)
- [x] Email regex guards against `.includes('@')` substitution

### Trust / Legal
- [x] Physical address in footer (Nordic Express AB, Göteborg)
- [x] Legal disclaimers + Norway framing accuracy, Netherlands contradiction fix
- [x] Age gate full-screen with localStorage persistence
- [x] Theme toggle fix, entity naming consistency

## Key Reference Files

| File | Purpose |
|------|---------|
| `ROADMAP.md` | Delivery sequence, Steps 1–56 done |
| `src/config/rewards.ts` | Canonical rewards config |
| `src/data/editorial-facts.ts` | Dynamic product/brand counts |
| `src/data/blog-registry.ts` | Blog index metadata (81 entries) |
| `src/lib/product-json.ts` | Slim products.json generator |
| `scripts/generate-og-images.ts` | Satori OG PNG pipeline |
| `src/components/astro/SEO.astro` | Per-page OG + hreflang + canonical |
| `src/components/react/CompareIsland.tsx` | Compare flow (replaces inline IIFE) |
