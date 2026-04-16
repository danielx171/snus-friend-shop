# Product Card Redesign — Implementation Spec

> For Claude Code implementation
> Mockup: `cowork/mockups/product-card-redesign.jsx`
> Audit: `cowork/audits/competitive-visual-audit-2026-04.md`

---

## Overview

Redesign both `ProductCard.tsx` (React) and `ProductCard.astro` (Astro) to match the "Premium Dark" variant in the mockup. The goal: replace the current `border-l-4` flavor border + strength strip approach with a more polished design using radial glow, pill badges, strength dots, and hover animations.

---

## Files to Modify

### 1. `src/components/react/ProductCard.tsx`

This is the React version used inside `FilterableProductGrid`. It needs the most changes.

**Remove:**
- Any `border-l-4` or `borderLeft` styling based on flavor color
- The 3px strength color strip between image and content areas
- The separate brand-color gradient on the image background (if present)

**Add/Change:**

#### Card container
```tsx
// Rounded corners, dark gradient background, hover lift
className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
style={{
  background: "linear-gradient(145deg, #1a1f2e 0%, #0f1219 100%)",
  boxShadow: isHovered
    ? `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${flavorColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`
    : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
}}
```

**Note:** Use `useState` for `isHovered` with `onMouseEnter`/`onMouseLeave`. On mobile, hover state should not persist — add `onTouchEnd={() => setIsHovered(false)}` or use CSS `@media (hover: hover)` instead of JS hover.

#### Badge (top-left)
If the product has a badge (bestseller, new, etc.), render:
```tsx
<div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold text-white"
  style={{ backgroundColor: badgeColor, boxShadow: `0 2px 8px ${badgeColor}40` }}>
  {badge}
</div>
```

Badge data: We may not have badge data on all products yet. If not available, skip rendering. This can be added later via a `badge` field on the product content or a hardcoded map of featured product slugs.

#### Wishlist heart (top-right)
```tsx
<button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
  aria-label={`Add ${product.name} to wishlist`}>
  <Heart className="w-4 h-4 text-white/60" />
</button>
```

Connect to the existing `wishlistStore` nanostore. If the product is already wishlisted, fill the heart (solid) and change color to red/pink.

#### Image area with radial glow
```tsx
<div className="relative h-48 flex items-center justify-center overflow-hidden">
  {/* Radial flavor glow */}
  <div className="absolute inset-0 transition-opacity duration-300"
    style={{
      background: `radial-gradient(circle at 50% 60%, ${flavorColor}60 0%, transparent 70%)`,
      opacity: isHovered ? 0.35 : 0.15,
    }}
  />

  {/* Product image */}
  <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden transition-transform duration-500"
    style={{
      transform: isHovered ? "scale(1.1) rotate(-3deg)" : "scale(1) rotate(0deg)",
      filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 0 12px ${flavorColor}20)`,
    }}>
    <img src={imageUrl} alt={name} className="w-full h-full object-contain" loading="lazy" />
  </div>

  {/* Subtle strength accent line at bottom of image area */}
  <div className="absolute bottom-0 left-0 right-0 h-1"
    style={{
      background: `linear-gradient(90deg, transparent, ${strengthColor}, transparent)`,
      opacity: 0.8,
    }}
  />
</div>
```

**Mobile consideration:** Disable `rotate(-3deg)` on mobile. The scale is fine, the rotation can look odd on touch. Use a CSS media query or just skip rotation on small screens.

#### Brand + strength dots row
```tsx
<div className="flex items-center justify-between mb-1.5">
  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: brandColor }}>
    {brand}
  </span>
  <StrengthBar dots={strengthDots} color={strengthColor} />
</div>
```

**StrengthBar component** (new, create as `src/components/react/StrengthBar.tsx`):
```tsx
interface StrengthBarProps {
  dots: number;
  maxDots?: number;
  color: string;
}

export function StrengthBar({ dots, maxDots = 5, color }: StrengthBarProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Strength ${dots} of ${maxDots}`}>
      {Array.from({ length: maxDots }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full transition-all"
          style={{
            backgroundColor: i < dots ? color : "rgba(255,255,255,0.15)",
            boxShadow: i < dots ? `0 0 4px ${color}40` : "none",
          }}
        />
      ))}
    </div>
  );
}
```

**Mapping strength to dots:** The existing `strengthMap` in ProductCard.tsx maps strength labels to 1-5. Reuse that mapping.

#### Star rating row
```tsx
<StarRating rating={product.averageRating} count={product.reviewCount} />
```

The existing `StarRating` component is already in use. Ensure it renders below the product name. If `averageRating` or `reviewCount` is not available on the product data, omit the row (don't show 0 stars — that looks bad).

**Data source:** Reviews live in the `product_reviews` table. At build time, Astro's content loader could pre-aggregate ratings per product. Alternatively, pass rating data through the product object. If this is too complex for the initial implementation, hardcode the rating display as hidden until the data pipeline exists.

#### Pill badges (flavor, mg, format)
```tsx
<div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
    style={{
      backgroundColor: `${flavorColor}20`,
      color: flavorColor,
      border: `1px solid ${flavorColor}30`,
    }}>
    {flavorLabel}
  </span>
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
    style={{
      backgroundColor: `${strengthColor}20`,
      color: strengthColor,
      border: `1px solid ${strengthColor}30`,
    }}>
    {mg}
  </span>
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
    {format} · {pouchCount}p
  </span>
</div>
```

These replace the old strength/flavor color indicators (the border + strip). The color information is the same — it just lives in the pill fills instead of card borders.

#### Price + CTA row
```tsx
<div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
  <div>
    <span className="text-lg font-bold text-white">€{price}</span>
    <span className="text-xs text-emerald-400/80 ml-1.5">+{points} pts</span>
  </div>
  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
    style={{
      background: `linear-gradient(135deg, ${flavorColor}, ${brandColor})`,
      boxShadow: isHovered ? `0 4px 12px ${flavorColor}40` : "none",
    }}
    aria-label={`Add ${product.name} to cart`}>
    <Plus className="w-4 h-4" />
    Add
  </button>
</div>
```

The gradient CTA button (flavor → brand color) gives each card a unique personality. Keep the existing `addToCart` logic from the current implementation.

---

### 2. `src/components/astro/ProductCard.astro`

Apply the same visual changes, but using Astro's template syntax instead of React. Key differences:

- No `useState` for hover — use CSS `:hover` pseudo-class for all hover effects
- Use `style` attributes for dynamic colors (these come from frontmatter/props)
- Wishlist heart should NOT be interactive in the Astro version (it's a static render). If wishlist interactivity is needed, convert the card heart to a React island or just link to the PDP.

**CSS-only hover approach for Astro:**
```astro
<style>
  .product-card {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .product-card:hover {
    transform: translateY(-4px);
  }
  .product-card:hover .product-glow {
    opacity: 0.35;
  }
  .product-card:hover .product-image {
    transform: scale(1.1);
  }
  .product-card:hover .cta-button {
    box-shadow: 0 4px 12px var(--flavor-glow);
  }
  @media (hover: none) {
    .product-card:hover {
      transform: none;
    }
    .product-card:hover .product-image {
      transform: none;
    }
  }
</style>
```

Pass `--flavor-color`, `--brand-color`, `--strength-color` as CSS custom properties via inline style on the card container, then reference them in the stylesheet.

---

### 3. `src/components/react/StrengthBar.tsx` (NEW FILE)

Small, focused component. See spec above. Used by both ProductCard.tsx and potentially the PDP.

---

### 4. `src/data/brand-colors.ts` (NO CHANGES)

The existing color system already has everything we need: `brandColors` (35 brands), `strengthColors` (5 tiers), `flavorColors` (11 flavors). No new colors required.

---

## Data Requirements

The redesigned card uses these fields per product:

| Field | Source | Status |
|-------|--------|--------|
| name, brand, price, image | Nyehandel catalog (content layer) | Already available |
| flavorColor, brandColor | `brand-colors.ts` mappings | Already available |
| strengthColor, strengthDots | `strengthColors` map + `strengthMap` | Already available |
| flavorLabel, mg, format, pouchCount | Product attributes from catalog | Should be available — verify |
| averageRating, reviewCount | `product_reviews` table (aggregate) | Exists in DB, needs query/pre-aggregation |
| badge, badgeColor | Not currently in product data | Defer — add later via manual map or admin flag |
| isWishlisted | `wishlistStore` nanostore | Already available (React only) |

**Rating data gap:** The biggest data requirement is surfacing aggregate review data on the card. Options:
1. Pre-aggregate at build time in content loader (cleanest)
2. Fetch client-side in FilterableProductGrid (adds a query but works immediately)
3. Hardcode for top 20 products initially, expand later

Recommend option 2 for React cards (client-side fetch is fine for interactive grids) and option 1 for Astro cards (build-time aggregation).

---

## Performance Notes

- **Wrap ProductCard with `React.memo`** — already required per UI conventions in CLAUDE.md
- **Lazy load images** — add `loading="lazy"` to all product card images
- **Avoid re-renders from hover** — the `isHovered` state triggers re-render on every enter/leave. Consider CSS-only hover for most effects and only use JS hover for the complex shadow calculation. Or use `useMemo` for the style objects.
- **Drop shadow filter** — `filter: drop-shadow(...)` is GPU-composited and performant, but avoid stacking more than 2 drop-shadow functions per element.

---

## Accessibility

- Wishlist button: `aria-label="Add {product name} to wishlist"` / `aria-label="Remove {product name} from wishlist"`
- Add to cart button: `aria-label="Add {product name} to cart"`
- Strength dots: `aria-label="Strength {n} of 5"`
- Star rating: `aria-label="Rated {n} out of 5 stars, {count} reviews"`
- Ensure color contrast: pill badge text on translucent background must meet WCAG AA (4.5:1 ratio). The lighter pill colors (green for light strength) may need a slightly darker text variant.

---

## Migration Path

1. **Phase 1:** Update `ProductCard.tsx` (React version) — this covers the main catalog grid and is the most visible change
2. **Phase 2:** Update `ProductCard.astro` — brings static pages (brand pages, blog product embeds) into alignment
3. **Phase 3:** Add review aggregation to cards — requires content loader or client-side query work
4. **Phase 4:** Add badge system — manual map or admin-driven flags for bestseller/new/etc.
