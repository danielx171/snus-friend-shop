# Brand Page Header Redesign

**Date:** 2026-03-28
**Status:** Design & Code Ready
**Component:** `src/components/BrandPageHeader.astro` + `src/components/BrandPageHeader.tsx` (React island)

---

## Overview

Replaces the gray circle + basic layout with a branded, information-rich header that:
- Showcases each brand's signature color with a gradient banner
- Displays key brand metadata at a glance (origin, products, strength range)
- Includes an expandable brand description
- Provides quick-filter chips for product discovery
- Is fully responsive (desktop/mobile) and semantically accessible

---

## Design Specification

### 1. Brand-Colored Header Banner

**Desktop:**
- Height: 200px
- Full width, spans viewport
- Background: Brand color → lighter gradient (50% opacity on right edge)
- Subtle diagonal line pattern overlay (3% opacity, angle 45°)

**Mobile:**
- Height: 160px
- Same gradient + pattern

**Example gradients:**
```
ZYN:     linear-gradient(135deg, #00A651 0%, #33B873 100%)
VELO:    linear-gradient(135deg, #1a73e8 0%, #4A8FED 100%)
Siberia: linear-gradient(135deg, #C41E3A 0%, #D64558 100%)
```

### 2. Brand Logo/Name Section

**Position:** Absolutely positioned, left-aligned within banner, vertically centered

**Text:**
- Font: Space Grotesk, 36px (desktop) / 28px (mobile)
- Weight: Bold (700)
- Color: White, 100% opacity
- Text shadow: `0 2px 8px rgba(0,0,0,0.15)` (subtle depth)
- Line height: 1.1

**Optional decorative first letter:**
- If brand has no image logo, use first letter as a large decorative element
- Font size: 60px (desktop) / 48px (mobile)
- Semi-transparent white, positioned to the right of the name

**Layout:**
```
┌─────────────────────────────────┐
│  [Z]  ZYN                       │  Brand name + optional letter
│                                 │  Vertically centered
└─────────────────────────────────┘
```

### 3. Metadata Row (Below Banner)

**White card with subtle shadow:**
- Background: `#ffffff`
- Box shadow: `0 1px 3px rgba(0,0,0,0.08)`
- Padding: 16px (mobile), 24px (desktop)
- Margin: -8px 16px 0 16px (overlaps banner slightly for depth)

**Metadata items (horizontal on desktop, 3 items per row on mobile):**

1. **Country + Origin**
   - Format: "🇸🇪 Sweden"
   - Font: Inter, 14px, 500 weight
   - Color: `#1a2e1a` (primary)

2. **Founded Year**
   - Format: "Est. 2016"
   - Font: Inter, 14px, 500 weight
   - Color: `#1a2e1a`

3. **Product Count**
   - Format: "52 products"
   - Font: Inter, 14px, 500 weight
   - Color: `#1a2e1a`

4. **Strength Range**
   - Format: "3-12 mg/pouch"
   - Font: Inter, 14px, 500 weight
   - Color: `#1a2e1a`

5. **Most Popular Flavor**
   - Icon + text: "🌿 Cool Mint" (emoji icon representing flavor)
   - Font: Inter, 14px, 500 weight
   - Color: `#1a2e1a`

**Separators:**
- Thin vertical dividers (1px, `#e5e5e5`) between items
- Hidden on mobile (items stack in 3-column grid)

**Desktop layout:**
```
🇸🇪 Sweden  |  Est. 2016  |  52 products  |  3-12 mg/pouch  |  🌿 Cool Mint
```

**Mobile layout (2 rows, 3 columns):**
```
🇸🇪 Sweden      Est. 2016      52 products
3-12 mg/pouch   🌿 Cool Mint
```

### 4. Collapsible Brand Description

**Container:**
- White background (same as metadata card, no gap)
- Padding: 16px (mobile), 24px (desktop)
- Border-top: 1px solid `#e5e5e5`

**Text:**
- Font: Inter, 14px (15px on desktop)
- Color: `#666666` (muted)
- Line-height: 1.5
- Show 2 lines by default (`line-clamp: 2` or `-webkit-line-clamp: 2`)

**Expand/Collapse:**
- "Read more" / "Read less" link on the same line as text or below
- Font: 13px, weight 500, color: brand color (e.g., `#00A651` for ZYN)
- Smooth CSS animation: `max-height: 2.8em` → `max-height: 100%`
- Transition: `max-height 0.3s ease-in-out`

**Implementation:**
- Use `<details>/<summary>` for semantic HTML
- OR use checkbox + label hack with CSS animations
- OR use React island if dynamic state is needed

**Example text:**

**ZYN:**
> "ZYN is the world's leading tobacco-free nicotine pouch brand, created by Swedish Match. Available in multiple strengths and flavors, ZYN pouches deliver consistent nicotine without tobacco leaf. Trusted by millions globally for discretion and convenience."

**VELO:**
> "VELO (formerly LYFT) is British American Tobacco's flagship nicotine pouch brand. Known for premium taste and consistent quality, VELO offers a wide range of flavors and strengths designed for the modern nicotine user."

**Siberia:**
> "Siberia is legendary in the snus world for producing some of the strongest nicotine pouches available. Crafted for experienced users seeking maximum strength, Siberia pouches are renowned for intense flavor and potent nicotine delivery."

### 5. Quick Filter Chips

**Container:**
- White background (same card)
- Padding: 16px (mobile), 24px (desktop)
- Border-top: 1px solid `#e5e5e5`
- Horizontally scrollable on mobile (`overflow-x: auto`, `-webkit-overflow-scrolling: touch`)

**Chip styling:**
- Background: transparent
- Border: 2px solid brand color (e.g., `#00A651` for ZYN)
- Color: brand color
- Border-radius: 24px (pill shape)
- Padding: 8px 16px
- Font: Inter, 13px, weight 500
- Cursor: pointer
- Transition: `background-color 0.2s ease, color 0.2s ease`

**States:**
- **Default:** border only, transparent bg
- **Hover:** brand color bg, white text
- **Active:** brand color bg, white text (also add `aria-pressed="true"`)
- **Mobile:** snap to left edge on scroll (`scroll-snap-type: x mandatory`)

**Filter options per brand:**

**ZYN:**
- All Products
- Cool Mint
- Spearmint
- Citrus
- Coffee
- Espresso
- (Dynamically generated from product data)

**VELO:**
- All Products
- Ice Cool
- Berry Frost
- Polar Mint
- Tropic Breeze
- (Dynamically generated from product data)

**Siberia:**
- All Products
- Brown
- White Dry
- Slim
- (Dynamically generated from product data)

---

## Component Code

### Astro Component: `src/components/BrandPageHeader.astro`

```astro
---
import type { Brand } from '@/integrations/supabase/types';
import BrandPageHeaderClient from './BrandPageHeaderClient';

interface Props {
  brand: Brand;
  productCount: number;
  strengthRange: string;
  popularFlavor?: string;
  flavors: string[];
  description: string;
}

const {
  brand,
  productCount,
  strengthRange,
  flavors,
  popularFlavor = 'Classic',
  description,
} = Astro.props;

// Brand color mapping
const brandColors: Record<string, { primary: string; gradient: string }> = {
  zyn: { primary: '#00A651', gradient: 'from-[#00A651] to-[#33B873]' },
  velo: { primary: '#1a73e8', gradient: 'from-[#1a73e8] to-[#4A8FED]' },
  siberia: { primary: '#C41E3A', gradient: 'from-[#C41E3A] to-[#D64558]' },
  // Add more brands as needed
};

const brandData = brandColors[brand.slug?.toLowerCase()] || {
  primary: '#4a6741',
  gradient: 'from-[#4a6741] to-[#6b8e5f]',
};

const countryEmoji = brand.country_emoji || '🌍';
const foundedYear = brand.founded_year || 'N/A';
---

<div class="w-full">
  {/* Brand Header Banner */}
  <div
    class={`relative w-full bg-gradient-to-r ${brandData.gradient} overflow-hidden`}
    style={{ height: '200px' }}
  >
    {/* Subtle diagonal pattern overlay */}
    <div
      class="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent, transparent 2px, #ffffff 2px, #ffffff 4px)',
      }}
    />

    {/* Brand name */}
    <div class="relative flex items-center h-full px-6 md:px-12 lg:px-16">
      <div class="flex items-center gap-2">
        <span
          class="text-white text-5xl md:text-6xl font-bold font-space-grotesk"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          {brand.name}
        </span>
      </div>
    </div>
  </div>

  {/* Metadata Row */}
  <div class="mx-4 md:mx-8 lg:mx-16 -mt-2 bg-white rounded-lg shadow-sm">
    <div class="px-6 md:px-8 py-5">
      {/* Desktop metadata grid */}
      <div class="hidden md:flex items-center justify-start gap-6">
        <div class="flex items-center text-sm font-medium text-primary">
          <span class="mr-2">{countryEmoji}</span>
          {brand.country || 'Unknown'}
        </div>

        <div class="w-px h-6 bg-gray-200" />

        <div class="text-sm font-medium text-primary">
          Est. {foundedYear}
        </div>

        <div class="w-px h-6 bg-gray-200" />

        <div class="text-sm font-medium text-primary">
          {productCount} products
        </div>

        <div class="w-px h-6 bg-gray-200" />

        <div class="text-sm font-medium text-primary">
          {strengthRange} mg/pouch
        </div>

        <div class="w-px h-6 bg-gray-200" />

        <div class="text-sm font-medium text-primary">
          <span class="mr-1">🌿</span>
          {popularFlavor}
        </div>
      </div>

      {/* Mobile metadata grid (3 columns) */}
      <div class="md:hidden grid grid-cols-3 gap-4 text-center">
        <div class="text-xs font-medium text-primary">
          <div>{countryEmoji}</div>
          <div>{brand.country || 'Unknown'}</div>
        </div>

        <div class="text-xs font-medium text-primary">
          <div>Est.</div>
          <div>{foundedYear}</div>
        </div>

        <div class="text-xs font-medium text-primary">
          <div>{productCount}</div>
          <div>products</div>
        </div>

        <div class="text-xs font-medium text-primary col-span-2">
          <div>{strengthRange}</div>
          <div>mg/pouch</div>
        </div>

        <div class="text-xs font-medium text-primary">
          <div>🌿</div>
          <div>{popularFlavor}</div>
        </div>
      </div>
    </div>

    {/* Collapsible Description */}
    <div class="border-t border-gray-200 px-6 md:px-8 py-5">
      <details class="group">
        <summary class="cursor-pointer text-sm text-muted-foreground leading-relaxed">
          <span class="line-clamp-2">
            {description}
          </span>
          <span class="block mt-2 text-xs font-medium transition-colors group-open:hidden"
            style={{ color: brandData.primary }}>
            Read more →
          </span>
        </summary>

        <div class="mt-4 text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-300">
          {description}
          <span
            class="block mt-2 text-xs font-medium cursor-pointer"
            style={{ color: brandData.primary }}>
            ← Read less
          </span>
        </div>
      </details>
    </div>

    {/* Quick Filter Chips */}
    <div class="border-t border-gray-200 px-6 md:px-8 py-5">
      <div class="flex gap-3 overflow-x-auto pb-2 -mb-2 snap-x snap-mandatory">
        {['All Products', ...flavors].map((flavor, idx) => (
          <button
            key={idx}
            class="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all snap-start"
            style={{
              borderColor: brandData.primary,
              borderWidth: '2px',
              color: brandData.primary,
              backgroundColor: idx === 0 ? brandData.primary : 'transparent',
              color: idx === 0 ? '#ffffff' : brandData.primary,
            }}
            aria-pressed={idx === 0}
          >
            {flavor}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>
```

### React Client Component: `src/components/BrandPageHeaderClient.tsx` (Optional)

If filters need to be interactive and update the product grid:

```tsx
import { useCallback, useState } from 'react';

interface BrandPageHeaderClientProps {
  brandName: string;
  primaryColor: string;
  flavors: string[];
  onFilterChange: (flavor: string) => void;
}

export default function BrandPageHeaderClient({
  brandName,
  primaryColor,
  flavors,
  onFilterChange,
}: BrandPageHeaderClientProps) {
  const [activeFilter, setActiveFilter] = useState('All Products');

  const handleFilterClick = useCallback(
    (flavor: string) => {
      setActiveFilter(flavor);
      onFilterChange(flavor);
    },
    [onFilterChange],
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mb-2 snap-x snap-mandatory">
      {['All Products', ...flavors].map((flavor) => (
        <button
          key={flavor}
          onClick={() => handleFilterClick(flavor)}
          className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all snap-start"
          style={{
            borderColor: primaryColor,
            borderWidth: '2px',
            backgroundColor: activeFilter === flavor ? primaryColor : 'transparent',
            color: activeFilter === flavor ? '#ffffff' : primaryColor,
          }}
          aria-pressed={activeFilter === flavor}
        >
          {flavor}
        </button>
      ))}
    </div>
  );
}
```

### Usage in Brand Page: `src/pages/brands/[slug].astro`

```astro
---
import BrandPageHeader from '@/components/BrandPageHeader.astro';
import { supabase } from '@/integrations/supabase/client';

const { slug } = Astro.params;

// Fetch brand data
const { data: brand } = await supabase
  .from('brands')
  .select('*')
  .eq('slug', slug)
  .single();

if (!brand) {
  return new Response('Brand not found', { status: 404 });
}

// Fetch product count and flavor data
const { data: products } = await supabase
  .from('products')
  .select('flavor, strength')
  .eq('brand_id', brand.id);

const productCount = products?.length || 0;
const flavors = [...new Set(products?.map(p => p.flavor))].sort() as string[];
const strengthValues = products?.map(p => parseInt(p.strength || '0')) || [0];
const strengthRange = `${Math.min(...strengthValues)}-${Math.max(...strengthValues)}`;
const popularFlavor = flavors[0] || 'Classic';
---

<BrandPageHeader
  brand={brand}
  productCount={productCount}
  strengthRange={strengthRange}
  popularFlavor={popularFlavor}
  flavors={flavors}
  description={brand.description || ''}
/>
```

---

## Brand Examples

### ZYN

**Color Palette:**
- Primary: `#00A651`
- Gradient: `linear-gradient(135deg, #00A651 0%, #33B873 100%)`

**Data:**
- Origin: 🇸🇪 Sweden
- Founded: 2016
- Product count: 52
- Strength range: 3-12 mg/pouch
- Popular flavor: Cool Mint
- Flavors: Cool Mint, Spearmint, Citrus, Coffee, Espresso

**Description:**
> "ZYN is the world's leading tobacco-free nicotine pouch brand, created by Swedish Match. Available in multiple strengths and flavors, ZYN pouches deliver consistent nicotine without tobacco leaf. Trusted by millions globally for discretion and convenience."

---

### VELO

**Color Palette:**
- Primary: `#1a73e8`
- Gradient: `linear-gradient(135deg, #1a73e8 0%, #4A8FED 100%)`

**Data:**
- Origin: 🇬🇧 United Kingdom
- Founded: 2019
- Product count: 34
- Strength range: 4-20 mg/pouch
- Popular flavor: Ice Cool
- Flavors: Ice Cool, Berry Frost, Polar Mint, Tropic Breeze

**Description:**
> "VELO (formerly LYFT) is British American Tobacco's flagship nicotine pouch brand. Known for premium taste and consistent quality, VELO offers a wide range of flavors and strengths designed for the modern nicotine user."

---

### Siberia

**Color Palette:**
- Primary: `#C41E3A`
- Gradient: `linear-gradient(135deg, #C41E3A 0%, #D64558 100%)`

**Data:**
- Origin: 🇸🇪 Sweden
- Founded: 2003
- Product count: 8
- Strength range: 24-43 mg/pouch
- Popular flavor: Brown
- Flavors: Brown, White Dry, Slim

**Description:**
> "Siberia is legendary in the snus world for producing some of the strongest nicotine pouches available. Crafted for experienced users seeking maximum strength, Siberia pouches are renowned for intense flavor and potent nicotine delivery."

---

## Implementation Checklist

- [ ] Create `src/components/BrandPageHeader.astro` with static version
- [ ] Create `src/components/BrandPageHeaderClient.tsx` for interactive filters
- [ ] Update `src/pages/brands/[slug].astro` to use new component
- [ ] Update `src/integrations/supabase/types.ts` to include brand color fields if missing:
  ```typescript
  brand_primary_color?: string;  // e.g., '#00A651'
  brand_gradient_light?: string; // e.g., '#33B873'
  ```
- [ ] Add brand color data to Supabase `brands` table (optional, can be hardcoded in component)
- [ ] Test on desktop (1920px, 1024px) and mobile (375px, 768px)
- [ ] Verify filter interactions work smoothly
- [ ] Check accessibility:
  - [ ] `aria-pressed` state on active filters
  - [ ] `aria-expanded` on details/summary (native)
  - [ ] Color contrast on all text (minimum 4.5:1)
  - [ ] Keyboard navigation (Tab, Enter/Space to expand details)
- [ ] Lighthouse performance check
- [ ] Cross-browser test (Chrome, Safari, Firefox, Edge)

---

## CSS Variables Used

These come from the site's forest theme in `src/index.css`:

```css
--primary: #1a2e1a;        /* Primary brand color */
--background: #f8f6f3;     /* Page background */
--muted-foreground: #666666; /* Text muted */
--border: #e5e5e5;         /* Divider lines */
```

Use these for consistency with the existing design system.

---

## Responsive Breakpoints

- **Mobile:** < 768px (160px banner, 2-row metadata grid, scrollable chips)
- **Tablet:** 768px–1024px (180px banner, simplified metadata)
- **Desktop:** > 1024px (200px banner, full metadata row)

---

## Animation Details

**Description expand:**
- Trigger: `<details>` element
- Animation: Smooth fade-in + height transition
- Duration: 0.3s
- Easing: `ease-in-out`

**Filter chip hover:**
- Background color transition: 0.2s
- Text color transition: 0.2s

**Banner pattern:**
- Opacity: 3% (very subtle, adds texture without distraction)
- Angle: 45° diagonal lines

---

## Future Enhancements

1. **Lazy-load brand images** from Supabase if available (logo overlays on banner)
2. **Animated product preview** on hover (show most popular product variant)
3. **Share brand button** in top-right corner
4. **Brand awards/certifications badges** in metadata row
5. **Dynamic color scheme** based on brand hex color (auto-generate gradient)
6. **Analytics tracking** on filter clicks (GA4 event)

---

## Notes

- All colors use Tailwind's color scale where possible (e.g., `from-green-600`)
- Gradients are applied inline via `style` attribute for brand-specific colors
- The component is SSR-friendly (Astro) with optional React island for interactions
- Mobile experience prioritizes readability over showing all metadata at once
- Filter chips support unlimited flavors (horizontally scrollable on mobile)
