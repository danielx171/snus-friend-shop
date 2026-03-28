# SnusFriend Design Philosophy

**Created:** 2026-03-27 — 8-Hour Design Marathon, Phase 1C

---

## Brand Identity

- **Who we are:** Europe's friendliest nicotine pouch marketplace — 2200+ products, 139 brands, one curated destination
- **Tone:** Premium but approachable. Not clinical like a pharmacy, not streetwear like a hype drop — the sweet spot between a well-curated specialty shop and a trusted friend who knows their stuff
- **Feeling:** Walking into a beautifully lit specialty store where every product is arranged with intention, the staff actually knows what they're recommending, and bulk buying feels like smart shopping, not compromise
- **Positioning:** The pouch sommelier — we know every brand, every strength, every flavor, so you don't have to

## Visual Direction

### Color System
- **Primary background:** Off-white (#FAFAF8) — makes colorful product cans pop, communicates premium trust
- **Dark surfaces:** Charcoal navy (#1A1A2E) — header, footer, feature sections, creates contrast rhythm
- **Brand accent:** Teal (#0F6E56) — CTAs, links, active states — trust + freshness + premium
- **Strength system (CRITICAL — never rely on color alone):**
  - Green (#22C55E) + "MILD" label → 1-4mg
  - Yellow (#EAB308) + "REGULAR" label → 5-8mg
  - Orange (#F97316) + "STRONG" label → 9-14mg
  - Red (#EF4444) + "EXTRA STRONG" label → 15mg+
- **Flavor accents (product card borders/glows):**
  - Mint/Cool → Blue-teal (#06B6D4)
  - Fruit/Tropical → Warm orange (#FB923C)
  - Berry → Purple/magenta (#A855F7)
  - Citrus → Yellow/lime (#84CC16)
  - Coffee/Tobacco → Warm brown (#92400E)

### Typography
- **Display/Headings:** Satoshi (700-900) — geometric sans with personality, NOT generic
- **Body/UI:** Plus Jakarta Sans (400-600) — highly readable, warm character
- **Price/Numbers:** Inter Tight tabular — monospaced numerals for aligned pricing
- **Fallback stack:** system-ui, -apple-system, sans-serif

### Spacing & Layout
- **Generous whitespace** on homepage and hero sections (Ritual-level breathing room)
- **Controlled density** on product grids and PLPs (Nicokick-level information efficiency)
- **8px base grid** — all spacing multiples of 8
- **Border radius:** 8px cards, 6px buttons, 999px pills/badges
- **Shadows:** Subtle, warm-toned (0 2px 8px rgba(26,26,46,0.08))

## Key Principles

### 1. Products Are the Hero
Every UI decision should make the cans look gorgeous. Dark cards make colorful packaging pop. White cards make the design feel premium. The product image is always the largest element on any card.

### 2. Strength at a Glance
The color-coded strength system is the store's signature UX pattern. A returning customer should be able to scan a grid of 50 products and instantly spot the extra-strong options. Always include text labels alongside color (WCAG compliance + 8% of males are red/green colorblind).

### 3. Bulk Buying Made Effortless
Pack selector pills (1/5/10/30) visible on every product card — no detail page needed. Per-unit pricing updates dynamically. This is our competitive advantage: 86% of e-commerce sites don't show price-per-unit (Baymard Institute). We do.

### 4. Trust Through Transparency
Lab-tested badges, tobacco-free callouts, ingredient clarity, honest reviews. Premium brands earn trust through information, not mystique. Every claim is backed by visible proof.

### 5. Speed is a Feature
73% of e-commerce happens on mobile. LCP under 200ms. No layout shifts. Progressive image loading. The store should feel instant — not just fast.

## Anti-Patterns (What We Are NOT)

- NOT a dark-mode-only site — rhythm of light and dark sections creates visual interest
- NOT a generic Shopify template — every component should feel designed, not assembled
- NOT a medical/clinical site — we're not selling supplements with anxiety
- NOT a hype/streetwear drop — no countdown timers, no artificial scarcity
- NOT a wall of text — imagery and interaction over explanation
