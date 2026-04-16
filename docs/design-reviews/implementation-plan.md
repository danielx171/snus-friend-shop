# SnusFriend Design Implementation Plan

> **Status:** Ready for review — waiting for Daniel to finish terminal work
> **Date:** 2026-03-29
> **Based on:** Full site audit of snusfriends.com (15 findings)
> **Reference mockup:** `docs/design-reviews/site-audit-mockup.html`

---

## Strategy: User Journey Sprints (not impact tiers)

Rather than grouping by priority (P1/P2/P3), this plan sequences work by **where the user is in the funnel**. Each sprint ships a complete layer of the experience so we can measure conversion impact incrementally.

---

## Sprint 1: The First 8 Seconds (Week 1)

**Goal:** A visitor who lands on the homepage should immediately see products, trust signals, and a reason to stay.

### 1A. Homepage Hero Overhaul
**Finding:** #1 — Hero is text-only, no product imagery
**Files to modify:**
- `src/pages/index.astro` (hero section, lines ~47-120)
- New: `src/components/astro/HeroProductCluster.astro` (CSS product can illustrations or real product images)

**What we build:**
- Split-layout hero with animated product images on the right (the 4 hero products already selected in index.astro lines 29-44 — `heroProducts` variable exists but only renders small thumbnails)
- Gradient glow background behind product cluster
- Keep the stats row (products count, brands count, free shipping) but make it punchier — large numbers with countUp animation on scroll
- Dual CTAs stay: "Shop All Pouches" (primary) + "Flavour Quiz" (secondary ghost)

**Effort:** 4-5 hours
**Risk:** Low — hero section is self-contained, no downstream dependencies

### 1B. Announcement Bar (already exists — enhance)
**Finding:** #13 — Announcement bar exists but could work harder
**Files to modify:**
- `src/components/astro/AnnouncementBar.astro`

**What we build:**
- Already has 3 rotating messages with CSS animation — this is actually decent
- Add: urgency message rotation ("Order in next 2h for same-day dispatch")
- Add: dismissible with cookie memory (currently not dismissible)
- Low effort, high polish

**Effort:** 1-2 hours
**Risk:** None

### 1C. Social Proof Strip (new component)
**Finding:** #4 — No Trustpilot, testimonials, or customer counts on homepage
**Files to create:**
- New: `src/components/astro/SocialProofStrip.astro`
- Add to: `src/pages/index.astro` (below hero, above best sellers)

**What we build:**
- Horizontal strip: Trustpilot score/stars (or placeholder until real reviews), "X,000+ orders shipped", "Same-day dispatch", EU flag + "EU warehouse"
- CSS-only, no React island needed — purely presentational
- Animated counters on scroll (IntersectionObserver in inline script)

**Effort:** 2-3 hours
**Risk:** None — additive component, no existing code touched

### Sprint 1 Total: ~8-10 hours

---

## Sprint 2: The Browse Loop (Week 1-2)

**Goal:** Once someone scrolls past the hero, the product grid and navigation should make comparison shopping effortless.

### 2A. Product Card Enhancement
**Finding:** #2 — Missing ratings, strength color coding, per-unit pricing
**Files to modify:**
- `src/components/astro/ProductCard.astro` (primary — SSG rendered)
- `src/components/react/ProductCard.tsx` (React island version — used in FilterableProductGrid)
- `src/components/react/CardAddToCart.tsx` (add to cart island)

**What we build:**
- **Strength color badge:** Color-coded dot/pill based on `strengthKey` (light=green, normal=blue, strong=orange, extra-strong=red, super-strong=purple). The data already exists — `strengthKey` and `nicotineContent` are already props.
- **Star ratings:** Display `ratings` as filled/empty stars. The prop already exists but rendering may be minimal.
- **Per-unit pricing:** Calculate and display "€X.XX/pouch" from pack price ÷ pouch count. Need to check if pouch count is in the data model.
- **Pack selector pills:** If product has multi-pack pricing (the `prices` prop is `Record<string, number>`), show 1-pack / 3-pack / 10-pack pills with per-unit savings

**Effort:** 5-6 hours (both Astro and React versions must stay in sync)
**Risk:** Medium — ProductCard is used everywhere. Must test across homepage, brand pages, search results, and category pages. Wrap with `React.memo` per CLAUDE.md convention.

### 2B. Curated Bestsellers (not alphabetical)
**Finding:** #6 — Homepage grid shows alphabetical products, not actual bestsellers
**Files to modify:**
- `src/pages/index.astro` (lines 11-21 — bestseller logic)

**What we build:**
- The logic already sorts by rating with brand diversity (max 2 per brand) — this is actually pretty good
- Real improvement: add section tabs — "Best Sellers" / "New Arrivals" / "Staff Picks"
- New Arrivals = sort by created_at desc
- Staff Picks = manual curated list (can use `badgeKeys` or a new field)
- Make this a React island for tab switching without page reload

**Effort:** 3-4 hours
**Risk:** Low — the data queries are straightforward, tabs are additive

### 2C. Navigation Mega Menu
**Finding:** #8 — Missing Strengths, Flavors, New Arrivals, Deals categories
**Files to modify:**
- `src/components/astro/Header.astro` (desktop nav)
- `src/components/react/MobileMenu.tsx` (mobile nav — already has By Strength and By Flavor sections!)

**What we build:**
- Desktop mega menu on hover for "Shop" link — 3-column dropdown:
  - Column 1: By Strength (Light, Normal, Strong, Extra Strong, Super Strong)
  - Column 2: By Flavor (Mint, Citrus, Berry, Coffee, Tobacco, etc.)
  - Column 3: Featured (New Arrivals, Bestsellers, Deals, All Products)
- MobileMenu.tsx already has this structure — desktop just needs to match
- Pure CSS hover dropdown (no React needed for desktop, keeps SSG performance)

**Effort:** 3-4 hours
**Risk:** Low — mobile version already exists as reference. Desktop is CSS/HTML only.

### 2D. Free Shipping Progress Bar (new component)
**Finding:** #5 — No shipping threshold indicator anywhere
**Files to create:**
- New: `src/components/react/ShippingProgressBar.tsx` (React island — needs cart state)
- Add to: `src/components/react/CartDrawer.tsx` (inside cart drawer)
- Optionally add to: `src/layouts/Shop.astro` (sticky mini-bar below header)

**What we build:**
- Progress bar showing "€X away from FREE shipping" with animated fill
- Reads from cart nanostore (`src/stores/cart.ts`)
- Threshold: €29 (from AnnouncementBar message "Free Shipping Over €29")
- When threshold met: "You've unlocked FREE shipping!" with confetti/check animation
- Color: forest green gradient matching theme

**Effort:** 3-4 hours
**Risk:** Low — reads from existing cart store, purely additive UI

### Sprint 2 Total: ~14-18 hours

---

## Sprint 3: The Conversion Page (Week 2)

**Goal:** When someone clicks into a product, the PDP should close the sale.

### 3A. PDP Redesign — Tabbed Content
**Finding:** #3 — Thin description, empty reviews section
**Files to modify:**
- `src/pages/products/[slug].astro` (main PDP page)
- Related: `src/components/product/ReviewSummaryCard.tsx` (AI review summary — already exists)

**What we build:**
- Tabbed content area below the main product info:
  - **Description** tab: Rich product description (pull from Nyehandel/Supabase data, or generate from attributes)
  - **Details** tab: Nicotine content, pouch count, weight, format, manufacturer, ingredients
  - **Reviews** tab: Star breakdown bar chart + individual reviews. `ReviewSummaryCard` already exists — integrate it here. If no reviews exist yet, show "Be the first to review" CTA.
- Sticky "Add to Cart" bar that appears when main CTA scrolls out of view (mobile especially)
- "Customers Also Bought" cross-sell section (3-4 related products from same flavor/strength)

**Effort:** 6-8 hours
**Risk:** Medium — PDP is conversion-critical. Need to preserve existing structured data (Product schema). Test with and without reviews data.

### 3B. Brand Page Identity
**Finding:** #7 — Brand pages use letter initial instead of visual identity
**Files to modify:**
- `src/pages/brands/[slug].astro` (or similar)
- `src/data/brand-overrides.ts` (already has real product data from NordicPouch CSV)

**What we build:**
- Brand hero banner with brand color gradient background
- Brand description (pull from `brand-overrides.ts` or add new field)
- Featured products from that brand (bestsellers within brand)
- Brand stat: "X products, Y flavors, nicotine range X-Xmg"

**Effort:** 3-4 hours
**Risk:** Low — brand data already exists in content layer

### Sprint 3 Total: ~9-12 hours

---

## Sprint 4: Polish & Trust (Week 2-3, background work)

### 4A. Enhanced Footer
**Finding:** #11 — Missing payment icons, trust badges
**Files:** `src/components/astro/Footer.astro`
**Build:** Payment method SVG icons (Visa, Mastercard, Klarna if available via Nyehandel), "Secure Checkout" badge, age verification notice, EU compliance note
**Effort:** 2 hours

### 4B. About Page
**Finding:** #12 — Generic, no team or story
**Files:** `src/pages/about.astro`
**Build:** Founder story, mission statement, EU warehouse photo/illustration, timeline of milestones. This is content work more than code.
**Effort:** 2-3 hours (design) + content writing time

### 4C. Blog Index Redesign
**Finding:** #14 — Flat list, no visual hierarchy
**Files:** `src/pages/blog/index.astro`
**Build:** Featured post hero at top, category tags, 2-column grid with thumbnails, reading time estimates
**Effort:** 3-4 hours

### 4D. Enhanced Search
**Finding:** #10 — Minimal search with no suggestions
**Files:** `src/components/react/SearchIsland.tsx` (or equivalent)
**Build:** Search suggestions dropdown, recent searches, popular searches, filter chips (strength, flavor, brand)
**Effort:** 4-5 hours

### 4E. Community Page
**Finding:** #9 — Nearly empty
**Recommendation:** **Deprioritize.** An empty community page is less damaging than a half-built one. Wait until there's real UGC or a review system generating content. For now, redirect `/community` to `/rewards` which has actual gamification content.
**Effort:** 30 minutes (redirect)

### 4F. Flavor Quiz Enhancement
**Finding:** #15 — Could be more engaging
**Files:** Flavor quiz component (need to locate exact file)
**Build:** Illustrated flavor icons, progress indicator, smooth transitions between steps, shareable results
**Effort:** 2-3 hours

### Sprint 4 Total: ~14-18 hours

---

## Summary

| Sprint | Focus | Hours | Key Metric |
|--------|-------|-------|------------|
| 1 | First 8 Seconds | 8-10 | Bounce rate |
| 2 | Browse Loop | 14-18 | Pages/session, add-to-cart rate |
| 3 | Conversion Page | 9-12 | Conversion rate |
| 4 | Polish & Trust | 14-18 | Return visits, brand perception |
| **Total** | | **45-58** | |

---

## Files That Need Creation (new components)

```
src/components/astro/HeroProductCluster.astro     (Sprint 1)
src/components/astro/SocialProofStrip.astro        (Sprint 1)
src/components/react/ShippingProgressBar.tsx        (Sprint 2)
src/components/react/HomepageTabs.tsx               (Sprint 2)
```

## Files That Need Modification (existing)

```
src/pages/index.astro                               (Sprint 1+2)
src/components/astro/AnnouncementBar.astro           (Sprint 1)
src/components/astro/ProductCard.astro               (Sprint 2)
src/components/react/ProductCard.tsx                  (Sprint 2)
src/components/react/CardAddToCart.tsx                (Sprint 2)
src/components/astro/Header.astro                    (Sprint 2)
src/components/react/MobileMenu.tsx                  (Sprint 2)
src/components/react/CartDrawer.tsx                   (Sprint 2)
src/pages/products/[slug].astro                      (Sprint 3)
src/pages/brands/[slug].astro                        (Sprint 3)
src/components/astro/Footer.astro                    (Sprint 4)
src/pages/about.astro                                (Sprint 4)
src/pages/blog/index.astro                           (Sprint 4)
```

## Architecture Rules (from CLAUDE.md)

- This is Astro 6 + React islands — NOT a SPA. New components should be `.astro` unless they need interactivity.
- React islands only where state/interactivity is needed (ShippingProgressBar needs cart store, HomepageTabs need click handlers)
- State via nanostores — cart store already exists at `src/stores/cart.ts`
- Wrap expensive list components with `React.memo`, handlers with `useCallback`
- SheetContent needs SheetTitle (sr-only if hidden)
- Quantity/icon buttons need aria-label
- Never hardcode colors — use CSS custom properties from theme
- Never edit `src/lib/cart-utils.ts` without permission

## Questions to Decide Together

1. **Trustpilot integration:** Do we have a Trustpilot account? If yes, we can pull real scores. If no, we use our own review aggregate.
2. **Payment methods:** Which payment methods does Nyehandel support? Need this for footer payment icons.
3. **Pouch count per product:** Is this in the database? Needed for per-unit pricing on cards.
4. **Staff Picks curation:** Do you want a manual list in `brand-overrides.ts` or a new `featured` badge in the DB?
5. **About page content:** Do you want to write the founder story yourself, or should I draft it?
6. **Blog thumbnails:** Do blog posts have featured images in the current data model?

---

## What I'll Do vs What You're Doing

**Me (when ready):** All code implementation — Astro components, React islands, CSS, structured data updates, testing across pages.

**You (terminal work now):** Whatever design work you're doing in the terminal. When you're done, we sync up, answer the questions above, and I start Sprint 1.
