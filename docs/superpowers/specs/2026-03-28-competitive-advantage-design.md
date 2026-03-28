# SnusFriend Competitive Advantage Strategy

**Date:** 2026-03-28
**Author:** Claude + Daniel
**Status:** Draft — awaiting review

---

## Context

SnusFriend is a European nicotine pouch e-commerce site (snusfriends.com) built on Astro 6 with React islands. The site went live March 26, 2026 with 734 products from 57 brands. Google has indexed 5 of 925 pages. Organic search is the only acquisition channel — Google Ads bans nicotine advertising.

### Competitive Landscape

| Competitor | Monthly Organic Traffic | Content Volume | Unique Feature |
|-----------|----------------------|----------------|----------------|
| Nicokick (Haypp Group) | 328K | 85 articles | ZYN flavors pages (rank #1 for 60K keyword) |
| Northerner (Haypp Group) | 297K | 84 articles | Nicoleaks lab testing, guides hub |
| Haypp UK (Haypp Group) | Unknown | 181 articles (Nicopedia) | Pick & Mix builder, free samples |
| SnusDaddy | 109K | ~50 articles | "Best of" lists, comparison content |
| SnusDirect | 105K | ~50 articles | 8,740 Trustpilot reviews, 15 years history |
| **SnusFriend** | **0** | **19 articles** | Gamification (spin wheel, quests, points, avatars) |

Key insight: 3 of 5 top competitors are the same company (Haypp Group). The market is less competitive than it appears.

### Keyword Opportunities

| Keyword | Monthly Volume | Current Position | Content Exists? |
|---------|---------------|-----------------|----------------|
| nicotine pouches | 74,000 | Not indexed | /nicotine-pouches (exists) |
| ZYN flavors | 60,500 | None | No |
| nicotine pouches side effects | 15,000-22,000 | None | /blog/side-effects (exists, not indexed) |
| VELO flavors | 14,800 | None | No |
| what are nicotine pouches | 12,000-18,000 | None | /blog/what-are (exists, not indexed) |
| how to use nicotine pouches | 8,000-12,000 | None | No |
| best nicotine pouches | 9,900 | None | No |
| buy nicotine pouches online | 8,000-12,000 | None | /nicotine-pouches (exists) |
| ZYN vs VELO | 5,000-8,000 | None | /blog/zyn-vs-velo-2026 (exists, not indexed) |
| buy ZYN online | 5,400 | None | Brand page exists |
| nicotine pouches vs vaping | 3,600 | None | No |
| France nicotine pouch ban | 3,000-5,000 | None | No |
| nicotine pouch flavours | 4,000-6,000 | None | No |

Total addressable search volume from missing content: **~250,000 monthly searches**.

---

## Strategy: Three-Layer Competitive Advantage

### Layer 1: Content Gets the Traffic
### Layer 2: Tools Convert Visitors
### Layer 3: Community Keeps Them

Each layer feeds the next. Content attracts visitors who discover tools that make them buy, and the community creates switching costs that prevent them from leaving for a competitor.

---

## Phase 1: Traffic (Weeks 1-4) — "Be Found"

### 1A. Programmatic SEO Pages (Code — Claude builds)

Generate 170+ pages automatically from Supabase product data. These are template-driven pages that fill massive keyword gaps.

**Page types:**

| Template | Count | Target Keywords | Example |
|----------|-------|----------------|---------|
| `{Brand} Flavours` | 57 | "{brand} flavors", "{brand} flavours" | /brands/zyn/flavours |
| `{Brand} Strengths` | 57 | "{brand} strength guide", "{brand} nicotine levels" | /brands/zyn/strengths |
| `{Brand} Review` | 57 | "{brand} review", "{brand} nicotine pouches" | /brands/zyn/review |
| **Total** | **171** | | |

Each page is SSG (built at build time from Supabase data) with:
- Unique H1 with brand name + keyword
- Product grid filtered to that brand
- Dynamically generated comparison tables (strengths, flavours, prices)
- CollectionPage + ItemList JSON-LD
- Internal links to related blog posts and other brand pages
- 100-200 words of auto-generated intro (template + brand data)

**Why this works:** Nicokick gets 328K monthly visits largely from "{brand} flavors" pages. This is the single highest-ROI content play — 171 pages from data we already have.

### 1B. Editorial Content (Cowork writes, Claude integrates)

15-20 hand-written guides targeting the highest-volume keywords we're missing.

**Tier 1 — Highest volume (write first):**

| Article | Target Keyword | Volume |
|---------|---------------|--------|
| ZYN Flavours Complete Guide | zyn flavors | 60,500 |
| VELO Flavours Complete Guide | velo flavors | 14,800 |
| Best Nicotine Pouches 2026 | best nicotine pouches | 9,900 |
| How to Use Nicotine Pouches | how to use nicotine pouches | 10,000 |
| Nicotine Pouches vs Vaping | nicotine pouches vs vaping | 3,600 |

**Tier 2 — Trending + long-tail:**

| Article | Target Keyword | Volume |
|---------|---------------|--------|
| EU Regulation Country-by-Country Guide | nicotine pouches legal europe | 4,000 |
| Nicotine Pouch Flavour Guide (all brands) | nicotine pouch flavours | 5,000 |
| Pablo Brand Guide | pablo snus | 3,600 |
| Iceberg Brand Guide | iceberg nicotine pouches | 2,000 |
| Nicotine Pouches vs Gum vs Lozenges | nicotine pouch vs gum | 1,500 |

**Tier 3 — Country-specific landing pages:**

| Page | Target Keyword | Volume |
|------|---------------|--------|
| Nicotine Pouches Germany | nicotine pouches germany | 3,000 |
| Nicotine Pouches UK | nicotine pouches uk | 2,500 |
| Nicotine Pouches Sweden | nicotine pouches sweden | 2,000 |
| Nicotine Pouches Spain | nicotine pouches spain | 1,500 |
| Nicotine Pouches Italy | nicotine pouches italy | 1,500 |

**Content standard per article:**
- 1,500-2,500 words
- Key Takeaways box (AI snippet extraction)
- FAQ section with FAQPage JSON-LD (5 Q&As)
- BlogPosting JSON-LD with datePublished/dateModified
- 5+ internal links to product/brand pages
- 1-2 external authority links (EU regulation, health sources, manufacturer pages)
- Comparison tables where applicable

### 1C. Indexing Fixes (Claude does immediately)

- Flip snusfriends.com to primary domain (Vercel Dashboard — Daniel)
- Request indexing in GSC for all key pages
- Fix age gate: ensure meta description is not blocked by overlay
- Fix any Swedish-language product descriptions appearing in search
- Submit sitemap to GSC
- Add lastmod dates to sitemap entries

### 1D. Category Page Content (Cowork writes)

12 existing flavour/strength category pages need 100-200 words of intro copy each:
- /products/flavor/mint, /berry, /citrus, /coffee, /cola, /menthol, /wintergreen, /tropical, /fruit, /ice, /original
- /products/strength/mild, /normal, /strong, /extra-strong, /super-strong

---

## Phase 2: Conversion (Weeks 4-8) — "Be Chosen"

### 2A. Product Comparison Tool

An interactive side-by-side comparison page where users select 2-4 products and see them compared across: strength, flavour, format, price-per-pouch, brand, user rating.

- URL: /compare
- React island with shareable URL (query params encode selected products)
- No competitor has this
- Excellent for "ZYN vs VELO" type queries — the comparison page can outrank blog posts

### 2B. "Build Your Sampler" Mix Pack

Let users create custom sampler packs from any products in the catalog:
- Pick 5 or 10 cans from any brand/flavour
- See total price with bundle discount
- One-click add to cart
- Shareable link ("Here's what I'd recommend for a beginner")

Haypp has "Pick & Mix" — this is our version, better because it's cross-brand and recommendation-driven.

### 2C. Price-Per-Pouch Transparency

No competitor shows price-per-pouch. Add to every product card and filter:
- Price per pouch = (can price / pouches per can)
- Filter by price-per-pouch range
- "Best Value" badge for lowest-price-per-pouch products
- Sort by value in product grid

Data already exists in Supabase (portionsPerCan + price). Pure frontend feature.

### 2D. Enhanced Reviews

Current reviews are basic. Upgrade to:
- Multi-dimension ratings: Flavour (1-5), Strength accuracy (1-5), Duration (1-5), Comfort (1-5)
- Verified purchase badge (check orders table)
- "Was this review helpful?" voting
- Photo upload
- Filter reviews by strength preference ("show reviews from strong pouch users")
- Review summary AI-generated from all reviews per product

### 2E. Subscription / Auto-Reorder

No European competitor offers this. First-mover advantage.
- "Subscribe & Save 10%" on any product
- Delivery frequency: every 2, 4, or 8 weeks
- Pause/cancel anytime
- Manage via /account
- Nyehandel API supports recurring order creation

---

## Phase 3: Community Moat (Weeks 8-16) — "Be Irreplaceable"

### 3A. User Flavour Ratings

Separate from reviews — quick 1-tap star rating per dimension:
- Flavour accuracy, Strength accuracy, Duration, Comfort, Value
- Aggregated into a "Community Score" shown on every product card
- "Top Rated This Month" collection page
- Powers recommendation engine

### 3B. "What's In Your Rotation" Collections

Users create and share their current pouch rotation:
- Public profile showing their top 3-5 pouches
- Shareable link (social media, forums)
- "Browse Rotations" discovery page showing what experienced users prefer
- "Users who like {product} also like {product}" data from rotations

### 3C. Ambassador Program

- Apply to become a SnusFriend Ambassador
- Get unique referral code (10% off for friends, points for ambassador)
- Early access to new brands
- Featured rotation on homepage
- Creates organic word-of-mouth in a market where paid advertising is banned

### 3D. Content Contributions

- Users can submit "Quick Take" reviews (50-100 words)
- Best reviews featured on product pages
- Monthly "Reviewer of the Month" with prize
- UGC feeds the content engine — fresh content Google loves, zero editorial cost

### 3E. Community Leaderboard (already partially built)

- Expand existing gamification: quests, points, avatars
- Add: review count, helpful votes, rotation shares as point sources
- Monthly/all-time leaderboards
- Tier badges visible on profile and reviews

---

## Metrics / Success Criteria

### Phase 1 (4 weeks)
- 925+ pages indexed in GSC (up from 5)
- 1,000+ organic impressions/week
- 50+ organic clicks/week
- Ranking position < 20 for at least 10 target keywords
- 170+ programmatic pages live
- 30+ editorial articles published (19 existing + 10 new from Cowork)

### Phase 2 (8 weeks)
- 5,000+ organic visits/month
- Comparison tool generating 100+ shares/month
- Sampler pack orders > 5% of total orders
- Average review count per product > 2

### Phase 3 (16 weeks)
- 15,000+ organic visits/month
- 500+ registered users with rotations
- 100+ ambassador applications
- User-generated content > 20% of total site content
- Community score coverage on > 50% of products

---

## Architecture Notes

### Programmatic Pages

New Astro page templates at:
- `src/pages/brands/[slug]/flavours.astro` — SSG, uses getCollection('products') filtered by brand
- `src/pages/brands/[slug]/strengths.astro` — SSG, same data source
- `src/pages/brands/[slug]/review.astro` — SSG, aggregates product data + reviews

Each uses `getStaticPaths()` generating one page per brand (57 brands × 3 templates = 171 pages). Build time impact: minimal since data is already loaded by the Content Layer.

### Blog Content

New .astro files in `src/pages/blog/` for each editorial article. Same pattern as existing blog posts. Cowork delivers HTML + JSON-LD, Claude integrates.

### Country Pages

New `src/pages/countries/[slug].astro` — SSG pages for each target market (5-8 countries). Template with dynamic country data stored in a simple TypeScript map (no DB needed).

### Tools (Phase 2)

- /compare — React island with URL-encoded product selection
- /sampler — React island with cart integration via nanostores
- Reviews upgrade — extends existing ProductReviewsIsland
- Subscription — new Supabase tables + edge function for recurring orders

### Community (Phase 3)

- Rotation collections — new Supabase table `user_rotations`
- Ambassador program — new Supabase table `ambassadors` + referral tracking
- Enhanced leaderboard — extends existing gamification tables

---

## What We Don't Build

- Mobile app (web-first, PWA if needed later)
- Marketplace/third-party sellers (we're the retailer)
- AI chatbot (content + tools > chat for this audience)
- Multiple languages (English-first, entire EU reads English for niche products)
- Nicotine-free pouches category (too small, dilutes positioning)

---

## Execution Split

| Work | Who | Cadence |
|------|-----|---------|
| Programmatic SEO pages (code) | Claude | Sprint in Week 1 |
| Editorial articles (writing) | Cowork | 2-3 articles/day for 2 weeks |
| Editorial integration (code) | Claude | As Cowork delivers |
| Category page copy | Cowork | Batch with editorial |
| Comparison tool | Claude | Week 4-5 |
| Sampler builder | Claude | Week 5-6 |
| Price-per-pouch | Claude | Week 4 (small feature) |
| Reviews upgrade | Claude | Week 6-7 |
| Subscription | Claude | Week 7-8 |
| Community features | Claude | Weeks 8-16 |
| GSC monitoring + optimization | Claude | Weekly throughout |
| Content performance review | Claude + Daniel | Bi-weekly |
