# SnusFriend Visual Upgrade — Design Spec

**Date:** 2026-03-28
**Author:** Claude + Daniel
**Status:** Approved

---

## Context

SnusFriend's technical foundation is strong (Astro 6, Lighthouse 100/100/100, 1,117 pages, 43 blog articles) but the visual design reads as "well-built template" rather than "trusted brand." A comprehensive visual audit identified three credibility killers and page-specific issues that prevent visitors from trusting the site with their credit card.

### The Three Credibility Killers

1. **Text-only hero** — white background, centered text, no imagery. Looks like the site hasn't launched.
2. **No logo** — plain "SnusFriend" in Inter text. Signals side project.
3. **No social proof** — no trust badges, no review counts, no Trustpilot in the header.

### Design Decision: Forest Green IS the Brand

The default forest green theme (`#1a2e1a` to `#2d3b2d`) is SnusFriend's brand identity. The hero, logo, trust bar, and all brand elements are designed for forest green specifically. The theme switcher stays as a feature but forest green is what defines the brand. Haypp is teal. Northerner is dark blue. SnusFriend is forest green.

---

## Section 1: Hero (Homepage)

### Layout

Split hero, full-width. 500px tall on desktop, 400px on mobile.

**Left side (60%):**
- Background: dark forest gradient (`#1a2e1a` → `#0f1f0f`)
- Headline: "Europe's Nicotine Pouch Shop" — Space Grotesk Bold, ~48px, cream/off-white (`#f5f3ef`)
- Subtitle: "731+ products from 57 brands. Fast EU delivery, loyalty rewards, and the best prices online." — Inter Regular, ~18px, muted green (`#a8c0a0`)
- Stat row: three items in a horizontal flex — "731+ Products", "57 Brands", "Free EU Shipping" — each with a large number and small label
- Two CTAs: primary filled button ("Shop All Pouches" → /nicotine-pouches), secondary outline button ("Take the Flavour Quiz" → /flavor-quiz)

**Right side (40%):**
- 3-4 product can images from Nyehandel CDN, selected at build time from bestsellers
- Images float at slight angles (CSS transforms: rotate(-5deg), rotate(3deg), etc.) with soft box-shadows
- Background: slightly lighter green gradient to create depth separation
- Products to feature: ZYN Cool Mint (green can), VELO Mighty Peppermint (blue), Siberia (red), LOOP (orange) — chosen for color variety

**Mobile (< 768px):**
- Stacks vertically: hero text block on top (padding 48px), product images below as a horizontal strip with overflow-x scroll and snap points
- CTAs stack full-width
- Stat row wraps to 3-column grid

### Trust Badge Row

Full-width bar immediately below the hero:
- Background: slightly lighter than hero (`#2d3b2d`)
- Content: "★★★★★ Trusted by EU customers | Free Shipping Over €29 | Same-Day Dispatch Before 2pm CET"
- Text: small, cream colored, center-aligned
- Dividers: muted vertical bars or bullet dots
- Mobile: same content, smaller text, wraps naturally

### Files to Modify
- `src/pages/index.astro` — replace current hero section with new component
- Create `src/components/astro/Hero.astro` — the hero component
- Create `src/components/astro/TrustBar.astro` — reusable trust bar

### What Replaces What
The current homepage structure is: shipping banner → header → age gate → hero (text only) → best sellers → trust signals → why snusfriend → shop by brand → CTA.

New structure: shipping+trust banner → header → age gate → **split hero with stats + product images** → best sellers → why snusfriend → shop by brand → CTA.

The current "Trust Signals" section (Free Shipping / 731+ Products / Fast EU Delivery / Verified Reviews) is absorbed into the hero stat row and the trust bar, so it can be removed.

---

## Section 2: Logo/Wordmark

### Design

- **Typeface:** Space Grotesk Bold (already loaded as `SpaceGrotesk-Variable.woff2`)
- **Treatment:** "SnusFriend" with tight letter-spacing (-0.02em). The "S" and "F" use weight 800, rest uses 700 — subtle emphasis on the initials
- **Color:** Forest green (`#1a2e1a`) on light backgrounds, cream (`#f5f3ef`) on dark backgrounds (hero, footer)
- **Icon mark:** A simple stylized leaf/pouch abstract shape, ~24x24px, forest green fill. Works standalone at favicon size.

### Implementation

- Create `src/components/astro/Logo.astro` — inline SVG component with props for `variant` ("full" = icon + wordmark, "mark" = icon only) and `color` ("dark" | "light")
- Replace the current `<a>` text "SnusFriend" in `Header.astro` with `<Logo variant="full" color="dark" />`
- In the footer, use `<Logo variant="full" color="light" />`
- In the hero, use `<Logo />` is not needed (hero has its own headline)
- Update `public/favicon.png` with the new mark
- Update `public/og-default.png` to include the new wordmark

### Files to Create/Modify
- Create `src/components/astro/Logo.astro`
- Modify `src/components/astro/Header.astro` — replace text with Logo component
- Modify `src/components/astro/Footer.astro` — replace text with Logo component
- Replace `public/favicon.png`
- Regenerate `public/og-default.png`

---

## Section 3: Trust/Social Proof Bar

### Design

Replace the current shipping-only announcement bar with a dual-purpose trust + shipping bar.

- **Background:** Forest green (`#1a2e1a`), same as the hero top
- **Content (desktop):** "★★★★★ Trusted by EU customers • Free Shipping Over €29 • Same-Day Dispatch Before 2pm CET"
- **Content (mobile):** Rotates every 4 seconds between: "★★★★★ Trusted by EU customers", "Free EU Shipping Over €29", "Same-Day Dispatch Before 2pm CET"
- **Text:** cream/off-white, 13px Inter, center-aligned
- **Height:** 36px desktop, 32px mobile
- **Position:** Above the header, not sticky (scrolls away)

### Implementation

- Create `src/components/astro/AnnouncementBar.astro` — replaces the current shipping banner
- Mobile rotation uses CSS animation (keyframes cycling opacity) with 3 `<span>` elements — no JavaScript needed
- Modify `src/layouts/Shop.astro` to use the new component

### Files to Create/Modify
- Create `src/components/astro/AnnouncementBar.astro`
- Modify `src/layouts/Shop.astro` or `src/layouts/Base.astro` — replace current banner

---

## Section 4: Product Card Improvements

### Strength Color Coding

Replace the current monochrome strength dots with colored indicators:

| Strength Key | Color | Hex |
|-------------|-------|-----|
| light | Green | `#22c55e` |
| normal | Blue | `#3b82f6` |
| strong | Orange | `#f97316` |
| extra-strong | Red | `#ef4444` |
| super-strong | Purple | `#a855f7` |

Implementation: a small colored circle (8px) next to the strength label text. The current 5-dot system is replaced with a single colored dot + the strength label text.

### Brand-Tinted Image Background

Each product card's image container gets a subtle gradient background tinted to the brand's identity color. This creates visual rhythm in the product grid instead of the current uniform white.

Implementation: add a `brandColor` field to the content layer schema (hex string, optional). Fallback: muted green (`#e8f0e8`). Apply as `background: linear-gradient(135deg, {brandColor}10, {brandColor}05)` on the image container.

For the initial implementation, hardcode the top 10 brand colors in a TypeScript map rather than adding a DB field:
```typescript
const brandColors: Record<string, string> = {
  zyn: '#4CAF50',
  velo: '#1565C0',
  loop: '#FF6F00',
  siberia: '#D32F2F',
  skruf: '#1B5E20',
  'white-fox': '#0D47A1',
  pablo: '#B71C1C',
  'nordic-spirit': '#37474F',
  klar: '#004D40',
  fumi: '#6A1B9A',
};
```

### Savings Badge

When the 10-can price is >10% less per can than the 1-can price, show a small badge in the top-right: "Save X%" in a green pill. Calculated at build time from existing pricing data.

### Empty Review Handling

If `ratings === 0`, hide the star rating row on the product card entirely. Currently shows empty gray stars which communicates "nobody buys this."

### Files to Modify
- `src/components/astro/ProductCard.astro` — strength colors, brand tint, savings badge, empty review handling
- Create `src/data/brand-colors.ts` — brand color map

---

## Section 5: Product Detail Page Upgrades

### Image Zoom

CSS-based hover zoom on the product image. No library.
- Container: `overflow: hidden`, `cursor: zoom-in`
- On hover: image `transform: scale(2)`, `transform-origin` follows mouse position via a small inline `<script>`
- Mobile: tap to zoom (toggles a zoomed state)

### Pack Pricing Savings

Each row in the pack pricing table shows the savings percentage vs single-can price:
- "1 can: €4.42"
- "3 cans: €12.59 (€4.20/can — Save 5%)"
- "5 cans: €19.88 (€3.98/can — Save 10%)"
- "10 cans: €37.55 (€3.76/can — **Save 15%** ← Best Value)"

The "Best Value" tier gets a highlighted border or background.

### Description Cleanup

Replace the single SEO paragraph with structured sections:
- **Overview:** Clean 2-3 sentence description (keep the auto-generated SEO description but clean up the worst examples)
- **Details grid:** A compact 2-column grid showing: Nicotine, Portions/Can, Format, Brand, Manufacturer, Strength Level
- Implementation: read product data fields that already exist, display in a structured `<dl>` or table

### Hide Empty Reviews

If review count is 0:
- Hide the star rating breakdown chart
- Show instead: a card with "Be the first to review this product" and a "Write a Review" button
- This is more inviting than 5 bars showing zeros

### Related Products

Add a horizontal product card row at the bottom of the PDP:
- "More from {brand}" — 4 products from the same brand, filtered from Content Layer
- Uses the standard ProductCard component
- Horizontal scroll on mobile with snap points

### Files to Modify
- `src/pages/products/[slug].astro` — image zoom, pricing, description, reviews, related products
- May need to modify `src/components/react/ProductReviewsIsland.tsx` for the empty state change

---

## Section 6: Brand Page Headers

### Colored Brand Banner

Replace the current gray circle avatar with a full-width colored banner:
- Height: 180px desktop, 140px mobile
- Background: CSS gradient using the brand's primary color (from `brand-colors.ts`)
- Content: brand logo image (from `logoUrl` field) displayed in white/light treatment. If no logo, display brand name in Space Grotesk Bold, white, ~48px
- Fallback gradient for brands without a mapped color: forest green

### Metadata Row

Below the banner, a horizontal row of compact info chips:
- Country flag (emoji) + origin country
- "by {manufacturer}" if manufacturer is set
- "{count} products"
- "{minMg}–{maxMg} mg range"

Uses existing data — country codes are in the brands collection (we added `countryCode`), manufacturer and product counts are already computed.

### Collapsible Description

Show first 2 lines of the brand description (CSS `line-clamp-2`), with a "Read more" button that expands to full text. Pure CSS using `<details>/<summary>` or a small inline script.

### Sub-Page Navigation

A row of pill-style links below the description:
- "All Products" → `/brands/{slug}`
- "Flavours" → `/brands/{slug}/flavours`
- "Strengths" → `/brands/{slug}/strengths`
- "Review" → `/brands/{slug}/review`

Current page is highlighted with filled background. Others are outline style.

### Files to Modify
- `src/pages/brands/[slug].astro` — complete header redesign
- Uses `src/data/brand-colors.ts` from Section 4

---

## What We Don't Change

- **Navigation structure** — already updated today with /nicotine-pouches in header, restructured footer
- **Blog layout** — content is strong, visual improvements (hero images, TOC, inline products) are Phase 2
- **Filter sidebar UX** — search within filters, price range slider, active chips are Phase 2 (conversion features)
- **Mobile menu** — functionally fine, visual polish can wait
- **Theme switcher** — stays in footer, works as-is
- **Gamification UI** — spin wheel, quests, avatars — already unique, don't touch

---

## Implementation Order

1. **Logo** — affects header and footer on every page, do first
2. **Announcement bar** — replaces shipping banner, affects every page
3. **Hero** — highest visual impact, homepage only
4. **Product card improvements** — strength colors, brand tints, savings badges
5. **Brand page headers** — colored banners, metadata, sub-nav
6. **PDP upgrades** — image zoom, pricing, description, related products

Each is independently deployable. Ship after each one.

---

## Success Criteria

- First-time visitor can identify SnusFriend as a legitimate e-commerce store within 3 seconds
- The homepage communicates "premium European nicotine pouch shop" not "template"
- Product cards are visually scannable — you can identify strength level at a glance by color
- Brand pages feel like they belong to the brand — ZYN page feels green, VELO feels blue
- No regression in Lighthouse scores (maintain 100/100/100 on key pages)
- No increase in client-side JavaScript (all improvements are Astro components / CSS)
