# Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform SnusFriend from "well-built template" to "trusted European brand" through 6 visual improvements — logo, trust bar, hero, product cards, brand headers, PDP.

**Architecture:** All changes are Astro components and CSS — zero client-side JavaScript increase. Cowork delivered production-ready HTML/Tailwind in blog-drafts/ which we adapt to existing component patterns. Each task is independently deployable.

**Tech Stack:** Astro 6, Tailwind v4, Space Grotesk + Inter fonts, SVG, CSS animations

---

## File Map

### New files
- `src/components/astro/Logo.astro` — SVG wordmark component (Concept 2: Nordic Mark)
- `src/components/astro/AnnouncementBar.astro` — Trust + shipping bar (Option C: rotating)
- `src/components/astro/Hero.astro` — Split hero with product images (Concept C)
- `src/data/brand-colors.ts` — Brand color map for product cards and brand headers

### Modified files
- `src/components/astro/Header.astro` — Replace text with Logo component
- `src/components/astro/Footer.astro` — Replace text with Logo component
- `src/layouts/Base.astro` — Replace shipping banner with AnnouncementBar
- `src/pages/index.astro` — Replace hero section with Hero component
- `src/components/astro/ProductCard.astro` — Strength colors, brand tints, savings badge, hide empty stars
- `src/pages/brands/[slug].astro` — Colored banner header, metadata row, sub-nav
- `src/pages/products/[slug].astro` — Image zoom, savings callout, related products, hide empty reviews

### Replaced files
- `public/favicon.png` — New icon mark
- `public/og-default.png` — Updated with new wordmark

---

## Task 1: Logo Component

**Files:**
- Create: `src/components/astro/Logo.astro`
- Modify: `src/components/astro/Header.astro`
- Modify: `src/components/astro/Footer.astro`
- Replace: `public/favicon.png`

Using Concept 2 (Nordic Mark) — Inter Bold wordmark with diamond/leaf mark. Clean, Nordic, works at all sizes.

- [ ] **Step 1: Create Logo.astro**

Read the SVG from `blog-drafts/LOGO_CONCEPTS.md` Concept 2 and create the component with variant props.

- [ ] **Step 2: Replace header text with Logo**

In `Header.astro`, replace `{tenant.name}` text link with `<Logo variant="full" />`.

- [ ] **Step 3: Replace footer text with Logo**

In `Footer.astro`, replace `{tenant.name}` text with `<Logo variant="full" color="light" />`.

- [ ] **Step 4: Generate new favicon**

Use Playwright to render the favicon SVG to PNG at 32x32 and replace `public/favicon.png`.

- [ ] **Step 5: Regenerate og-default.png**

Update the OG image generator HTML to use the new wordmark, render with Playwright.

- [ ] **Step 6: Build and verify**

Run: `bun run build`

- [ ] **Step 7: Commit**

```bash
git add src/components/astro/Logo.astro src/components/astro/Header.astro src/components/astro/Footer.astro public/favicon.png public/og-default.png
git commit -m "feat: add SnusFriend logo — Nordic Mark wordmark with leaf icon"
```

---

## Task 2: Announcement Bar

**Files:**
- Create: `src/components/astro/AnnouncementBar.astro`
- Modify: `src/layouts/Base.astro` or `src/layouts/Shop.astro`

Using Option C (rotating) — cycles between trust, shipping, and catalog messages.

- [ ] **Step 1: Create AnnouncementBar.astro**

Read the HTML from `blog-drafts/TRUST_BAR_DESIGNS.md` Option C and adapt to our layout pattern.

- [ ] **Step 2: Replace current shipping banner**

Find and replace the existing shipping banner in the layout with the new component.

- [ ] **Step 3: Build and verify**

- [ ] **Step 4: Commit**

---

## Task 3: Homepage Hero

**Files:**
- Create: `src/components/astro/Hero.astro`
- Modify: `src/pages/index.astro`

Using Concept C (Split Hero with Stats) — dark forest gradient left with headline/stats/CTAs, product images right.

- [ ] **Step 1: Create Hero.astro**

Read `blog-drafts/HERO_CONCEPTS.md` Concept C, adapt to use real product data from Content Layer. Pull 4 bestseller product images at build time.

- [ ] **Step 2: Replace homepage hero**

Remove current hero section in index.astro, insert Hero component. Also remove the "Trust Signals" section (absorbed into hero stats).

- [ ] **Step 3: Build and verify**

- [ ] **Step 4: Commit**

---

## Task 4: Product Card Improvements

**Files:**
- Create: `src/data/brand-colors.ts`
- Modify: `src/components/astro/ProductCard.astro`

- [ ] **Step 1: Create brand-colors.ts**

Map of brand slug → hex color for the top 15 brands.

- [ ] **Step 2: Update ProductCard**

Add strength color dot, brand-tinted image background, savings badge, hide empty stars.

- [ ] **Step 3: Build and verify**

- [ ] **Step 4: Commit**

---

## Task 5: Brand Page Headers

**Files:**
- Modify: `src/pages/brands/[slug].astro`
- Uses: `src/data/brand-colors.ts` from Task 4

- [ ] **Step 1: Redesign brand header**

Replace gray avatar with colored gradient banner, logo/text, metadata row, sub-page nav pills.

- [ ] **Step 2: Build and verify**

- [ ] **Step 3: Commit**

---

## Task 6: PDP Upgrades

**Files:**
- Modify: `src/pages/products/[slug].astro`

- [ ] **Step 1: Add image zoom**

CSS hover zoom with mouse tracking.

- [ ] **Step 2: Add savings callout to pack pricing**

Calculate and display savings percentage per tier.

- [ ] **Step 3: Hide empty reviews**

If 0 reviews, show "Be the first to review" CTA instead of empty chart.

- [ ] **Step 4: Add related products**

Product card row "More from {brand}" using Content Layer data.

- [ ] **Step 5: Build, verify, commit**

---

## Phase 2 (deferred)
- Blog hero images
- Blog table of contents
- Inline product cards in articles
- Filter UX improvements (search, price range, active chips)
- Mobile-specific optimizations
