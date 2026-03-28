---
name: snusfriend-design-system
description: "SnusFriend's complete design system for building e-commerce UI components. Use this skill whenever creating, modifying, or reviewing any SnusFriend frontend component, page, or design. Triggers on: 'design system', 'brand colors', 'component', 'product card', 'cart drawer', 'strength badge', 'pack selector', 'UI component', or any request to build/style SnusFriend frontend elements. Also use when reviewing designs for brand consistency."
---

# SnusFriend Design System

The complete design system for snusfriends.com — Europe's friendliest nicotine pouch marketplace.

## Brand Identity

- **Who:** Europe's #1 nicotine pouch marketplace — 2200+ products, 139 brands
- **Tone:** Premium but approachable. The pouch sommelier — knowledgeable, trustworthy, never clinical
- **Positioning:** Between a curated specialty shop and a trusted friend who knows their stuff

## Color System

### Core Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#FAFAF8` | Main background (warm off-white) |
| `--bg-dark` | `#1A1A2E` | Header, footer, dark sections, cart drawer |
| `--bg-surface` | `#FFFFFF` | Cards on light background |
| `--bg-dark-surface` | `#252538` | Cards on dark background |
| `--accent-primary` | `#0F6E56` | CTAs, links, active states (teal) |
| `--accent-hover` | `#0D5C48` | Hover state for teal elements |
| `--text-primary` | `#1A1A2E` | Body text on light |
| `--text-secondary` | `#4A4A5A` | Secondary text on light |
| `--text-on-dark` | `#F5F5F5` | Text on dark backgrounds |

### Strength System (CRITICAL — never color alone, always include text label)
| Strength | Color | Label | Range |
|----------|-------|-------|-------|
| Mild | `#22C55E` (green) | MILD | 1-4mg |
| Regular | `#EAB308` (yellow) | REGULAR | 5-8mg |
| Strong | `#F97316` (orange) | STRONG | 9-14mg |
| Extra Strong | `#EF4444` (red) | EXTRA STRONG | 15mg+ |

Always render as: colored badge + text label. 8% of males are red/green colorblind — text labels are mandatory for WCAG compliance.

### Flavor Accents (product card borders/glows)
| Flavor | Color | Hex |
|--------|-------|-----|
| Mint/Cool | Blue-teal | `#06B6D4` |
| Fruit/Tropical | Warm orange | `#FB923C` |
| Berry | Purple/magenta | `#A855F7` |
| Citrus | Yellow/lime | `#84CC16` |
| Coffee/Tobacco | Warm brown | `#92400E` |

## Typography

| Role | Font | Weight | Size | Tracking |
|------|------|--------|------|----------|
| Display/Headings | Satoshi | 700-900 | 32-48px | -0.02em |
| Body/UI | Plus Jakarta Sans | 400-600 | 14-16px | 0em |
| Price/Numbers | Inter Tight | 500-700 | tabular | 0em |
| Fallback | system-ui, -apple-system, sans-serif | — | — | — |

Alternative pairings (for different themes):
- **Clean Ritual**: Cabinet Grotesk (headings) + Plus Jakarta Sans (body)
- **Neon Pouch**: Outfit (headings) + Switzer (body)
- **Editorial**: Playfair Display (headings) + General Sans (body)

## Spacing & Layout

- **Base grid:** 8px — all spacing multiples of 8
- **Border radius:** 8px cards, 6px buttons, 999px pills/badges
- **Shadows:** `0 2px 8px rgba(26,26,46,0.08)` (subtle, warm-toned)
- **Homepage/Hero:** Generous whitespace (Ritual-level: 80-120px between sections)
- **Product grids:** Controlled density (24-32px gap, 3-column preferred)

## Signature UX Patterns

### 1. Color-Coded Strength Badges
Every product shows its nicotine strength with a colored badge + text label.
```tsx
<span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
  style={{ backgroundColor: strengthColor + '20', color: strengthColor }}>
  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: strengthColor }} />
  {strengthLabel}
</span>
```

### 2. Pack Selector Pills
Inline pack quantity selector with dynamic pricing. Our competitive advantage — 86% of e-commerce sites don't show price-per-unit (Baymard Institute).
```tsx
<div className="flex gap-2">
  {[1, 3, 5, 10].map(qty => (
    <button className={cn(
      "rounded-full px-3 py-1.5 text-sm font-medium border transition-all",
      selected === qty
        ? "bg-[#0F6E56] text-white border-[#0F6E56]"
        : "bg-transparent text-current border-current/20 hover:border-[#0F6E56]"
    )}>
      {qty}{qty > 1 && <span className="text-xs ml-1">SAVE {qty * 2}%</span>}
    </button>
  ))}
</div>
```

### 3. Free Shipping Progress Bar
Shown in cart drawer. Drives 7.9-20% AOV lift.
```tsx
<div className="w-full bg-white/10 rounded-full h-2">
  <div className="bg-[#0F6E56] h-2 rounded-full transition-all duration-500"
    style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }} />
</div>
<p className="text-sm mt-1">
  {remaining > 0 ? `Add €${remaining.toFixed(2)} more for FREE shipping!` : '🎉 Free shipping unlocked!'}
</p>
```

### 4. Flavor-Coded Card Borders
Left border or glow on product cards matching the flavor family.
```tsx
<div className={cn("border-l-4 rounded-lg", flavorBorderClass)}>
  {/* card content */}
</div>
```

### 5. Trust Bar
Shown on homepage below hero. Builds credibility immediately.
```
139 Brands | Same-Day Shipping | Rewards Program | Lab-Tested
```

## Theme Usage Guide

| Page Type | Theme | Background | Rationale |
|-----------|-------|------------|-----------|
| Homepage | B (Clean Ritual) | `#FAFAF8` | First impression = trust |
| PLP/Category | B (Clean Ritual) | `#FAFAF8` | Better scanning for 50+ products |
| PDP | A (Midnight Teal) | `#1A1A2E` | Product images pop on dark |
| Cart Drawer | A (Midnight Teal) | `#1A1A2E` | Dark overlay feels natural |
| Header/Footer | A (Midnight Teal) | `#1A1A2E` | Premium framing |
| Brand Pages | C (Neon Pouch) | `#0A0A0A` | Energy + per-brand accent colors |
| Promos | C (Neon Pouch) | `#0A0A0A` | Bold, attention-grabbing |

## Anti-Patterns

- **Never** use color alone for strength — always include text label
- **Never** hardcode colors inline — use CSS custom properties
- **Never** use 4+ column grids — 3 columns max for comfortable browsing
- **Never** use stock photos — product imagery or abstract only
- **Never** add countdown timers or artificial scarcity
- **Never** skip the pack selector on product cards — it's our competitive advantage
- **Never** omit per-unit pricing — it drives bulk buying behavior

## Component Reference

For production-ready component implementations, see:
- `docs/design-reviews/components/ProductCard.tsx` — Full product card with all patterns
- `docs/design-reviews/components/HomepageHero.tsx` — Light theme homepage hero
- `docs/design-reviews/components/CartDrawer.tsx` — Dark theme cart drawer

For micro-interaction specifications, see:
- `docs/design-reviews/micro-interactions-research.md`
