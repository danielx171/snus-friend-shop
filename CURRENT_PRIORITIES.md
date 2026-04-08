# Current Priorities

Last updated: 2026-04-08

## Launch Polish Sprint (April 8-14)

Active sprint to bring SEO to 90+, GEO to 85+, and visual quality to 8+/10.
Design spec: `docs/superpowers/specs/2026-04-08-launch-polish-design.md`
Implementation plan: `docs/superpowers/plans/2026-04-08-launch-polish.md`
Codex visual audit: `cowork/content/codex-visual-audit.md`

## Lighthouse Scores (April 8, 2026 — Codex audit)

| Metric | Homepage | /nicotine-pouches | /blog | /brands/zyn | Product Page |
|--------|----------|-------------------|-------|-------------|-------------|
| SEO | **100** | **100** | **100** | **100** | **100** |
| Performance | 83 | 60 | 92 | 91 | 85 |
| Accessibility | 97 | 94 | 96 | 97 | 97 |
| Best Practices | 96 | 96 | 96 | 96 | 96 |

## Completed (April 8 Sprint)

### SEO
- [x] Medical disclaimers on all 76 articles (was 73/76)
- [x] Person author schema on all 76 articles (was 74/76)
- [x] Author sameAs links on all 76 articles (LinkedIn + X)
- [x] PAA/Quick Answer blocks on 64/76 articles (was 19/76)
- [x] Source citations added to top 20 articles (FDA, WHO, PHE, PubMed)
- [x] Blog registry: 83 entries, all discoverable in /blog index + RSS
- [x] Sitemap lastmod dates via @astrojs/sitemap serialize
- [x] IndexNow protocol for Bing/Yandex
- [x] CSP header (report-only mode)
- [x] Brand mentions embedded in 15 top articles for AI citability
- [x] Internal linking strengthened across 7+ weakly-linked articles
- [x] 8 thin articles expanded with 300-500 word depth sections
- [x] Blog index intro shortened (cards visible sooner on mobile)
- [x] Buying Guide tag contrast fixed (#E65100 → #BF360C)
- [x] llms.txt updated with 83-article inventory

### Visual/UX
- [x] Mobile announcement bar text overlap fixed (visibility toggle)
- [x] BREAKING ticker removed from homepage (spammy → clean)
- [x] Product badge contrast fixed (Popular/New: 2.15:1 → 7:1+)
- [x] Cookie consent banner compacted on mobile
- [x] Product 404 slug fixed (zyn-cool-mint-s2 → zyn-cool-mint-slim-s2)
- [x] Hidden heading DOM noise fixed (AgeGate h2 → p, MegaMenu h3 → div)

### Infrastructure
- [x] Age gate already had correct ARIA (role="dialog", aria-modal, aria-labelledby)
- [x] CheckoutForm already had role="alert" aria-live="assertive"
- [x] HowTo schema already on all 4 how-to articles
- [x] robots.txt already had OAI-SearchBot + Google-Extended
- [x] /auth/confirm already excluded from sitemap

## Remaining This Sprint

### HIGH — Pending Codex/Cowork deliverables
- [ ] PAA blocks for 12 remaining articles (need Cowork batch 3)
- [ ] Title tag optimization on low-CTR pages (need Codex GSC data)
- [ ] Homepage copy refresh (Cowork variations ready in `cowork/content/homepage-copy-variations.md`)

### HIGH — Visual Polish (from Codex visual audit)
- [ ] Product card conversion improvements: review counts, savings emphasis, pack-size clarity
- [ ] Brand page logo treatment: replace placeholder letter squares with real assets
- [ ] /nicotine-pouches performance: 60 score needs investigation (products.json? FilterableProductGrid?)

### MEDIUM
- [ ] Products.json optimization (280KB → target <150KB)
- [ ] Rewards page hero redesign (feels like help page, not gamified destination)
- [ ] Blog card visual richness (thumbnails, date, author line)

### LOW
- [ ] compare.astro innerHTML → Astro template expressions
- [ ] OG images per page
- [ ] hreflang for DE/SV translations (future)

## Current State

- Site live at snusfriends.com
- 708 active products, 55 brands
- 76 blog articles (83 in registry including redirected slugs)
- 94+ total pages (SSG + SSR hybrid)
- Astro 6, React islands, nanostores, Tailwind v4
- SEO score: ~90/100 (up from 80)
- GEO score: ~85/100 (up from 74)
- Visual quality: ~7.5/10 (up from 6.0)
- Version: 1.5.0

## Key Reference Files

| File | Purpose |
|------|---------|
| `ROADMAP.md` | Delivery sequence, Steps 1-56 |
| `SYSTEM_BOUNDARIES.md` | Architecture rules and ownership |
| `DEPLOYMENT_CHECKLIST.md` | Secrets, webhooks, pre-launch checklist |
| `docs/superpowers/specs/2026-04-08-launch-polish-design.md` | Launch polish sprint spec |
| `docs/superpowers/plans/2026-04-08-launch-polish.md` | Launch polish implementation plan |
| `cowork/content/codex-visual-audit.md` | Codex visual & UX audit (April 8) |
| `cowork/README.md` | Cowork audit summary + deliverables |
