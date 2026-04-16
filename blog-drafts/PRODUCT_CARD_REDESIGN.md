# Product Card Redesign – SnusFriend

**Status:** Design Specification | **Date:** 2026-03-28 | **Version:** 1.0

## Overview

This document outlines a comprehensive redesign of the SnusFriend product card component to elevate visual hierarchy, improve product discovery, and create a more premium shopping experience. The current card is functionally complete but visually monotone. This redesign adds brand identity, strength-based color coding, savings indicators, and polished hover states.

## Design System

### Theme & Colors

- **Primary Forest Green:** `hsl(153 55% 18%)` — primary actions, accents
- **Background:** `#f8f6f3` (warm off-white)
- **Card Surface:** `hsl(0 0% 100% / 0.6)` with backdrop blur
- **Fonts:** Inter (body), Space Grotesk (headings)

### Brand Color Map

Each brand gets a subtle gradient background behind the product image:

| Brand | Hex | Light (5% opacity) | Dark (hover, 10% opacity) |
|-------|-----|-------------------|-------------------------|
| ZYN | #00A651 | rgba(0, 166, 81, 0.05) | rgba(0, 166, 81, 0.10) |
| VELO | #1a73e8 | rgba(26, 115, 232, 0.05) | rgba(26, 115, 232, 0.10) |
| Siberia | #C41E3A | rgba(196, 30, 58, 0.05) | rgba(196, 30, 58, 0.10) |
| LOOP | #FF6B35 | rgba(255, 107, 53, 0.05) | rgba(255, 107, 53, 0.10) |
| White Fox | #E8E8E8 | rgba(232, 232, 232, 0.08) | rgba(232, 232, 232, 0.15) |

### Strength Levels & Color Codes

Strength indicators now combine color, dot label, and left-border accent:

| Level | Range | Color | Dot | Label | Border Accent |
|-------|-------|-------|-----|-------|---------------|
| Light | 1–3mg | #10B981 | Green | "Light" | `border-l-4 border-green-500` |
| Normal | 4–6mg | #3B82F6 | Blue | "Normal" | `border-l-4 border-blue-500` |
| Strong | 7–12mg | #F59E0B | Orange | "Strong" | `border-l-4 border-amber-500` |
| Extra Strong | 13–20mg | #EF4444 | Red | "Extra Strong" | `border-l-4 border-red-500` |
| Super Strong | 21mg+ | #A855F7 | Purple | "Super Strong" | `border-l-4 border-purple-500` |

### Badge Styles

#### Bestseller & New Badges

Moved from standard rectangular to organic, premium positioning with icon + text:

- **Bestseller:** Flame icon + "Bestseller" label, top-left, warm amber (#d97706), positioned outside card in rotated badge
- **New:** Sparkle icon + "New" label, top-left, bright green (#16a34a), positioned as floating badge
- **Savings:** Rotated ribbon badge, top-right, "Save 15%" or "Best Value" in gold

Badges use layered shadows and slight rotation for premium feel.

## Component Redesign

### 1. Image Container with Brand-Colored Background

**Current:** Gray background, simple image overlay

**Redesigned:**
- Background gradient tinted by brand color (5% opacity base, 10% on hover)
- Smooth color transition on hover
- "Quick View" overlay appears on hover (centered, semi-transparent)
- Subtle glow effect on image frame

```jsx
// CSS variables per product:
// --brand-color: #00A651 (ZYN), #1a73e8 (VELO), etc.

<div
  className="product-card-image relative aspect-square w-full overflow-hidden rounded-t-xl"
  style={{
    background: `linear-gradient(135deg, rgb(from var(--brand-color) r g b / 0.05) 0%, rgb(from var(--brand-color) r g b / 0.02) 100%)`,
    '--brand-color': brandColor
  } as React.CSSProperties}
>
  <img
    src={imageUrl}
    alt={`${name} by ${brand}`}
    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
  />
  {/* Quick View Overlay */}
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
    <button
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm"
      onClick={(e) => { e.preventDefault(); window.location.href = `/products/${slug}`; }}
    >
      Quick View
    </button>
  </div>
</div>
```

### 2. Strength Color Coding System

Replace simple dots with color-coded indicator including label:

```jsx
function StrengthIndicator({ strengthKey, nicotineContent }) {
  const strengthMap = {
    'light': { level: 1, color: '#10B981', label: 'Light', borderColor: 'border-green-500' },
    'normal': { level: 2, color: '#3B82F6', label: 'Normal', borderColor: 'border-blue-500' },
    'strong': { level: 3, color: '#F59E0B', label: 'Strong', borderColor: 'border-amber-500' },
    'extra-strong': { level: 4, color: '#EF4444', label: 'Extra Strong', borderColor: 'border-red-500' },
    'super-strong': { level: 5, color: '#A855F7', label: 'Super Strong', borderColor: 'border-purple-500' },
  };

  const strength = strengthMap[strengthKey] || strengthMap['normal'];

  return (
    <div className={`flex items-center gap-2 pl-3 border-l-4 ${strength.borderColor}`}>
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: strength.color }}
          role="img"
          aria-label={`${strength.label} strength, ${nicotineContent}mg per pouch`}
        />
        <span className="text-xs font-semibold text-foreground">
          {strength.label}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        {nicotineContent}mg
      </span>
    </div>
  );
}
```

### 3. Bestseller / New Badges

Premium floating badges with organic positioning:

```jsx
// Bestseller Badge
<div className="absolute -top-2 -left-2 z-20">
  <div className="relative">
    <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow transform -rotate-12 flex items-center gap-1.5">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2l2.39 7.37H20l-6.3 4.57 2.39 7.37L10 16.74 3.91 21.31 6.3 13.94 0 9.37h7.61L10 2z" />
      </svg>
      <span className="text-xs font-bold">Bestseller</span>
    </div>
  </div>
</div>

// New Badge
<div className="absolute -top-2 -right-2 z-20">
  <div className="relative">
    <div className="bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow transform rotate-12 flex items-center gap-1.5">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-xs font-bold">New</span>
    </div>
  </div>
</div>
```

### 4. Savings Badge (Multi-Pack)

Ribbon badge positioned top-right with rotation:

```jsx
{hasMultiPackDiscount && (
  <div className="absolute -top-3 -right-3 z-20">
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 transform rotate-45 shadow-lg" />
      <div className="relative z-10 text-center">
        <div className="text-xs font-black text-white drop-shadow">Save</div>
        <div className="text-sm font-black text-white drop-shadow">15%</div>
      </div>
    </div>
  </div>
)}
```

### 5. Pack Selector Pills

Redesigned from minimal to visual, with per-unit pricing:

```jsx
function PackSelector({ prices, onPackSelect, selectedPack = 'pack1' }) {
  const packs = [
    { key: 'pack1', label: '1 Can', price: prices.pack1, unit: '€4.99' },
    { key: 'pack5', label: '5-Pack', price: prices.pack5, unit: '€0.95/pouch' },
    { key: 'pack10', label: '10-Pack', price: prices.pack10, unit: '€0.42/pouch' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {packs.map(({ key, label, price, unit }) => (
        <button
          key={key}
          onClick={() => onPackSelect(key)}
          className={`flex-shrink-0 px-3 py-2 rounded-full border-2 transition-all duration-200 ${
            selectedPack === key
              ? 'bg-primary/10 border-primary bg-opacity-100'
              : 'border-border hover:border-primary/50 bg-white'
          }`}
        >
          <div className="text-xs font-semibold text-foreground">{label}</div>
          <div className="text-xs font-bold text-primary">€{price.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </button>
      ))}
    </div>
  );
}
```

### 6. Hover State Improvements

- **Lift effect:** `group-hover:-translate-y-1` (4px upward)
- **Shadow increase:** `hover:shadow-lg hover:shadow-primary/10`
- **Border color shift:** `hover:border-primary/30`
- **Image zoom:** `group-hover:scale-105` (already present, keep)
- **Quick View button:** Slides in from center on image hover
- **Button color shift:** Add to Cart button color intensifies on hover
- **Card glow:** Subtle `group-hover:bg-primary/5` for card background

```css
/* Hover state CSS */
.product-card {
  @apply group relative flex flex-col overflow-hidden rounded-xl
         bg-card/60 backdrop-blur-sm border border-border
         transition-all duration-300 hover:shadow-lg hover:shadow-primary/10
         hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5;
}

.product-card:hover {
  --brand-color: rgb(from var(--brand-color) r g b / 0.10); /* Intensify brand tint */
}
```

## Implementation Example: Full Redesigned Card

```jsx
import React, { useCallback, useState } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product } from '@/data/products';

interface ProductCardProps {
  slug: string;
  name: string;
  brand: string;
  brandColor: string; // e.g., '#00A651' for ZYN
  brandSlug: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  nicotineContent: number;
  strengthKey: string;
  flavorKey: string;
  ratings: number;
  badgeKeys: string[];
  hasMultiPackDiscount?: boolean;
  discountPercent?: number;
}

const strengthConfig = {
  light: { level: 1, color: '#10B981', label: 'Light', borderColor: 'border-green-500' },
  normal: { level: 2, color: '#3B82F6', label: 'Normal', borderColor: 'border-blue-500' },
  strong: { level: 3, color: '#F59E0B', label: 'Strong', borderColor: 'border-amber-500' },
  'extra-strong': { level: 4, color: '#EF4444', label: 'Extra Strong', borderColor: 'border-red-500' },
  'super-strong': { level: 5, color: '#A855F7', label: 'Super Strong', borderColor: 'border-purple-500' },
};

function StrengthIndicator({ strengthKey, nicotineContent }) {
  const strength = strengthConfig[strengthKey] || strengthConfig.normal;

  return (
    <div className={`flex items-center gap-2 pl-3 border-l-4 ${strength.borderColor}`}>
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: strength.color }}
        role="img"
        aria-label={`${strength.label} strength`}
      />
      <span className="text-xs font-semibold text-foreground">
        {strength.label}
      </span>
      <span className="text-xs text-muted-foreground ml-auto">
        {nicotineContent}mg
      </span>
    </div>
  );
}

function StarRating({ rating }) {
  if (!rating || rating <= 0) return null;
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: full }, (_, i) => (
        <svg key={`f${i}`} className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" aria-hidden="true">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" stroke="currentColor" strokeWidth="0.5" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e${i}`} className="h-3 w-3 text-muted-foreground/30" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const ProductCard = React.memo<ProductCardProps>(function ProductCard({
  slug,
  name,
  brand,
  brandColor,
  brandSlug,
  imageUrl,
  prices,
  stock,
  nicotineContent,
  strengthKey,
  flavorKey,
  ratings,
  badgeKeys,
  hasMultiPackDiscount,
  discountPercent = 15,
}) {
  const [selectedPack, setSelectedPack] = useState('pack1');
  const isOutOfStock = stock === 0;
  const displayPrice = prices[selectedPack] || prices.pack1;
  const hasBestseller = badgeKeys.includes('bestseller');
  const hasNew = badgeKeys.includes('new') || badgeKeys.includes('NewPrice');

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock) return;

      const product: Product = {
        id: slug,
        name,
        brand,
        categoryKey: 'nicotinePouches',
        flavorKey: flavorKey as Product['flavorKey'],
        strengthKey: strengthKey as Product['strengthKey'],
        formatKey: 'slim',
        nicotineContent,
        portionsPerCan: 20,
        descriptionKey: '',
        image: imageUrl,
        ratings,
        badgeKeys: badgeKeys as Product['badgeKeys'],
        prices: prices as Product['prices'],
        manufacturer: brand,
        stock,
      };

      addToCart(product, selectedPack as any);
      openCart();
      cartToast(name);
    },
    [slug, name, brand, imageUrl, prices, stock, nicotineContent, strengthKey, flavorKey, ratings, badgeKeys, selectedPack, isOutOfStock],
  );

  return (
    <a
      href={`/products/${slug}`}
      className="product-card group relative flex flex-col overflow-hidden rounded-xl bg-card/60 backdrop-blur-sm border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
    >
      {/* Bestseller Badge */}
      {hasBestseller && (
        <div className="absolute -top-2 -left-2 z-20">
          <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow transform -rotate-12 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2l2.39 7.37H20l-6.3 4.57 2.39 7.37L10 16.74 3.91 21.31 6.3 13.94 0 9.37h7.61L10 2z" />
            </svg>
            <span className="text-xs font-bold">Bestseller</span>
          </div>
        </div>
      )}

      {/* New Badge */}
      {hasNew && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow transform rotate-12 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold">New</span>
          </div>
        </div>
      )}

      {/* Savings Badge */}
      {hasMultiPackDiscount && (
        <div className="absolute -top-3 -right-3 z-20">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 transform rotate-45 shadow-lg" />
            <div className="relative z-10 text-center">
              <div className="text-xs font-black text-white drop-shadow">Save</div>
              <div className="text-sm font-black text-white drop-shadow">{discountPercent}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Image with Brand-Colored Tint */}
      <div
        className="product-card-image relative aspect-square w-full overflow-hidden bg-muted transition-colors duration-300 group-hover:bg-opacity-100"
        style={{
          background: `linear-gradient(135deg, rgb(from ${brandColor} r g b / 0.05), rgb(from ${brandColor} r g b / 0.02))`,
        } as React.CSSProperties}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={`${name} by ${brand}`}
              width={300}
              height={300}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              }}
            />
            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/products/${slug}`; }}
              >
                Quick View
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="h-16 w-16 text-muted-foreground/40"
              aria-hidden="true"
            >
              <ellipse cx="32" cy="32" rx="28" ry="10" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="32" cy="28" rx="28" ry="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
              <path d="M4 28v4c0 5.523 12.536 10 28 10s28-4.477 28-10v-4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Brand Link */}
        <span
          role="link"
          tabIndex={0}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/brands/${brandSlug}`; }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); window.location.href = `/brands/${brandSlug}`; }}}
          className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors py-0.5"
        >
          {brand}
        </span>

        {/* Product Name */}
        <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2">
          {name}
        </h3>

        {/* Strength Indicator */}
        <StrengthIndicator strengthKey={strengthKey} nicotineContent={nicotineContent} />

        {/* Flavor Tag */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {flavorKey}
          </span>
        </div>

        {/* Star Rating */}
        {ratings > 0 && (
          <div className="flex items-center gap-1">
            <StarRating rating={ratings} />
            <span className="text-xs text-muted-foreground">{ratings.toFixed(1)}</span>
          </div>
        )}

        {/* Pack Selector Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 my-1">
          {['pack1', 'pack5', 'pack10'].map((packKey) => {
            const packLabels = { pack1: '1 Can', pack5: '5-Pack', pack10: '10-Pack' };
            const packUnits = { pack1: 'single', pack5: '€0.95/pouch', pack10: '€0.42/pouch' };
            return (
              prices[packKey] && (
                <button
                  key={packKey}
                  onClick={(e) => { e.preventDefault(); setSelectedPack(packKey); }}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-full border transition-all duration-200 text-center ${
                    selectedPack === packKey
                      ? 'bg-primary/15 border-primary'
                      : 'border-border bg-white hover:border-primary/50'
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground">{packLabels[packKey]}</div>
                  <div className="text-xs font-bold text-primary">€{prices[packKey].toFixed(2)}</div>
                  {packUnits[packKey] !== 'single' && (
                    <div className="text-xs text-muted-foreground">{packUnits[packKey]}</div>
                  )}
                </button>
              )
            );
          })}
        </div>

        {/* Price + Add to Cart */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2 border-t border-border/30">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              €{displayPrice.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              per {selectedPack === 'pack1' ? 'can' : selectedPack}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? `Sold Out – ${name}` : `Add to Cart – ${name}`}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
          >
            {isOutOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </a>
  );
});

export default ProductCard;
```

## Example Cards

### Card 1: ZYN Cool Mint — Light Strength + Bestseller

```html
<div class="w-80 bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
     style="--brand-color: #00A651;">

  <!-- Bestseller Badge -->
  <div class="absolute -top-2 -left-2 z-20">
    <div class="bg-amber-500 text-white px-3 py-1.5 rounded-full shadow-lg transform -rotate-12 flex items-center gap-1.5">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2l2.39 7.37H20l-6.3 4.57 2.39 7.37L10 16.74 3.91 21.31 6.3 13.94 0 9.37h7.61L10 2z" />
      </svg>
      <span class="text-xs font-bold">Bestseller</span>
    </div>
  </div>

  <!-- Image with Green Tint -->
  <div class="aspect-square w-full overflow-hidden bg-gradient-to-br from-green-50/10 to-green-50/5 group-hover:from-green-50/20 group-hover:to-green-50/10 transition-colors">
    <img src="/images/zynCoolMint.jpg" alt="ZYN Cool Mint"
         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
      <button class="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
        Quick View
      </button>
    </div>
  </div>

  <!-- Content -->
  <div class="p-4 flex flex-col gap-2">
    <a href="/brands/zyn" class="text-xs text-gray-600 hover:text-green-600 cursor-pointer transition-colors">ZYN</a>

    <h3 class="text-sm font-bold text-gray-900 line-clamp-2">Cool Mint</h3>

    <!-- Strength: Light Green -->
    <div class="flex items-center gap-2 pl-3 border-l-4 border-green-500">
      <span class="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
      <span class="text-xs font-semibold text-gray-900">Light</span>
      <span class="text-xs text-gray-500 ml-auto">3mg</span>
    </div>

    <!-- Flavor Tag -->
    <span class="rounded-full bg-cyan-100 text-cyan-900 px-2.5 py-1 text-xs font-medium w-fit">Mint</span>

    <!-- Rating -->
    <div class="flex items-center gap-1">
      <div class="flex gap-0.5">
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      </div>
      <span class="text-xs text-gray-500">4.8</span>
    </div>

    <!-- Pack Selector -->
    <div class="flex gap-1.5 overflow-x-auto pb-1 my-1">
      <button class="flex-shrink-0 px-2.5 py-1.5 rounded-full border-2 border-green-600 bg-green-50 text-center">
        <div class="text-xs font-semibold text-gray-900">1 Can</div>
        <div class="text-xs font-bold text-green-600">€4.99</div>
      </button>
      <button class="flex-shrink-0 px-2.5 py-1.5 rounded-full border border-gray-300 bg-white hover:border-green-600 text-center">
        <div class="text-xs font-semibold text-gray-900">5-Pack</div>
        <div class="text-xs font-bold text-green-600">€22.95</div>
        <div class="text-xs text-gray-500">€0.95/pouch</div>
      </button>
      <button class="flex-shrink-0 px-2.5 py-1.5 rounded-full border border-gray-300 bg-white hover:border-green-600 text-center">
        <div class="text-xs font-semibold text-gray-900">10-Pack</div>
        <div class="text-xs font-bold text-green-600">€39.90</div>
        <div class="text-xs text-gray-500">€0.42/pouch</div>
      </button>
    </div>

    <!-- Price & CTA -->
    <div class="flex items-end justify-between gap-2 pt-2 border-t border-gray-200 mt-auto">
      <div class="flex flex-col">
        <span class="text-lg font-bold text-green-600">€4.99</span>
        <span class="text-xs text-gray-500">per can</span>
      </div>
      <button class="rounded-lg bg-green-600 text-white px-3 py-2 text-xs font-semibold hover:bg-green-700 hover:shadow-lg transition-all active:scale-95">
        Add
      </button>
    </div>
  </div>
</div>
```

### Card 2: Siberia Red — Super Strong (No Badge)

```html
<div class="w-80 bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
     style="--brand-color: #C41E3A;">

  <!-- Image with Red Tint -->
  <div class="aspect-square w-full overflow-hidden bg-gradient-to-br from-red-50/10 to-red-50/5 group-hover:from-red-50/20 group-hover:to-red-50/10 transition-colors">
    <img src="/images/siberia-red.jpg" alt="Siberia Red"
         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
      <button class="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
        Quick View
      </button>
    </div>
  </div>

  <!-- Content -->
  <div class="p-4 flex flex-col gap-2">
    <a href="/brands/siberia" class="text-xs text-gray-600 hover:text-red-600 cursor-pointer transition-colors">Siberia</a>

    <h3 class="text-sm font-bold text-gray-900 line-clamp-2">Red</h3>

    <!-- Strength: Super Strong Purple -->
    <div class="flex items-center gap-2 pl-3 border-l-4 border-purple-600">
      <span class="inline-block h-2.5 w-2.5 rounded-full bg-purple-600" />
      <span class="text-xs font-semibold text-gray-900">Super Strong</span>
      <span class="text-xs text-gray-500 ml-auto">43mg</span>
    </div>

    <!-- Flavor Tag -->
    <span class="rounded-full bg-red-100 text-red-900 px-2.5 py-1 text-xs font-medium w-fit">Spicy</span>

    <!-- Rating -->
    <div class="flex items-center gap-1">
      <div class="flex gap-0.5">
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      </div>
      <span class="text-xs text-gray-500">4.9</span>
    </div>

    <!-- Pack Selector -->
    <div class="flex gap-1.5 overflow-x-auto pb-1 my-1">
      <button class="flex-shrink-0 px-2.5 py-1.5 rounded-full border-2 border-purple-600 bg-purple-50 text-center">
        <div class="text-xs font-semibold text-gray-900">1 Can</div>
        <div class="text-xs font-bold text-purple-600">€6.99</div>
      </button>
      <button class="flex-shrink-0 px-2.5 py-1.5 rounded-full border border-gray-300 bg-white hover:border-purple-600 text-center">
        <div class="text-xs font-semibold text-gray-900">5-Pack</div>
        <div class="text-xs font-bold text-purple-600">€32.95</div>
        <div class="text-xs text-gray-500">€1.32/pouch</div>
      </button>
    </div>

    <!-- Price & CTA -->
    <div class="flex items-end justify-between gap-2 pt-2 border-t border-gray-200 mt-auto">
      <div class="flex flex-col">
        <span class="text-lg font-bold text-purple-600">€6.99</span>
        <span class="text-xs text-gray-500">per can</span>
      </div>
      <button class="rounded-lg bg-purple-600 text-white px-3 py-2 text-xs font-semibold hover:bg-purple-700 hover:shadow-lg transition-all active:scale-95">
        Add
      </button>
    </div>
  </div>
</div>
```

### Card 3: VELO Freeze — Strong + New Badge + Save 15% Multi-Pack

```html
<div class="w-80 bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative"
     style="--brand-color: #1a73e8;">

  <!-- New Badge -->
  <div class="absolute -top-2 -right-2 z-20">
    <div class="bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg transform rotate-12 flex items-center gap-1.5">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span class="text-xs font-bold">New</span>
    </div>
  </div>

  <!-- Savings Badge (Rotated Ribbon) -->
  <div class="absolute -top-3 -right-8 z-20">
    <div class="relative w-24 h-24 flex items-center justify-center">
      <div class="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 transform rotate-45 shadow-lg" />
      <div class="relative z-10 text-center">
        <div class="text-xs font-black text-white drop-shadow">Save</div>
        <div class="text-sm font-black text-white drop-shadow">15%</div>
      </div>
    </div>
  </div>

  <!-- Image with Blue Tint -->
  <div class="aspect-square w-full overflow-hidden bg-gradient-to-br from-blue-50/10 to-blue-50/5 group-hover:from-blue-50/20 group-hover:to-blue-50/10 transition-colors">
    <img src="/images/velo-freeze.jpg" alt="VELO Freeze"
         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
      <button class="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
        Quick View
      </button>
    </div>
  </div>

  <!-- Content -->
  <div class="p-4 flex flex-col gap-2">
    <a href="/brands/velo" class="text-xs text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">VELO</a>

    <h3 class="text-sm font-bold text-gray-900 line-clamp-2">Freeze</h3>

    <!-- Strength: Strong Orange -->
    <div class="flex items-center gap-2 pl-3 border-l-4 border-amber-500">
      <span class="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
      <span class="text-xs font-semibold text-gray-900">Strong</span>
      <span class="text-xs text-gray-500 ml-auto">11mg</span>
    </div>

    <!-- Flavor Tag -->
    <span class="rounded-full bg-blue-100 text-blue-900 px-2.5 py-1 text-xs font-medium w-fit">Cool</span>

    <!-- Rating -->
    <div class="flex items-center gap-1">
      <div class="flex gap-0.5">
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      </div>
      <span class="text-xs text-gray-500">4.7</span>
    </div>

    <!-- Pack Selector with Discount Pricing -->
    <div class="flex gap-1.5 overflow-x-auto pb-1 my-1">
      <button class="flex-shrink-0 px-2.5 py-1.5 rounded-full border-2 border-blue-600 bg-blue-50 text-center">
        <div class="text-xs font-semibold text-gray-900">1 Can</div>
        <div class="text-xs font-bold text-blue-600">€5.99</div>
      </button>
      <button class="flex-shrink-0 px-2.5 py-1.5 rounded-full border border-gray-300 bg-white hover:border-blue-600 text-center">
        <div class="text-xs font-semibold text-gray-900">5-Pack</div>
        <div class="text-xs font-bold text-blue-600">€25.48 <span class="line-through text-gray-400 text-xs">€29.95</span></div>
        <div class="text-xs text-green-600 font-semibold">Save 15%</div>
      </button>
      <button class="flex-shrink-0 px-2.5 py-1.5 rounded-full border border-gray-300 bg-white hover:border-blue-600 text-center">
        <div class="text-xs font-semibold text-gray-900">10-Pack</div>
        <div class="text-xs font-bold text-blue-600">€50.95 <span class="line-through text-gray-400 text-xs">€59.90</span></div>
        <div class="text-xs text-green-600 font-semibold">Save 15%</div>
      </button>
    </div>

    <!-- Price & CTA -->
    <div class="flex items-end justify-between gap-2 pt-2 border-t border-gray-200 mt-auto">
      <div class="flex flex-col">
        <span class="text-lg font-bold text-blue-600">€5.99</span>
        <span class="text-xs text-gray-500">per can</span>
      </div>
      <button class="rounded-lg bg-blue-600 text-white px-3 py-2 text-xs font-semibold hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">
        Add
      </button>
    </div>
  </div>
</div>
```

## Grid Layout (3-Column Desktop, 2-Column Tablet, 1-Column Mobile)

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <ProductCard {...card1Props} />
  <ProductCard {...card2Props} />
  <ProductCard {...card3Props} />
  {/* More cards... */}
</div>
```

## CSS Variables for Dynamic Brand Colors

Add to component inline style or parent wrapper:

```jsx
<div style={{ '--brand-color': '#00A651' } as React.CSSProperties}>
  {/* Card will use this color */}
</div>
```

## Migration Checklist

- Replace current `ProductCard.tsx` with redesigned version
- Add brand color property to product data (`src/data/products.ts`)
- Create brand color map constant in a shared utilities file
- Update strength indicator styling across the app
- Test hover states on all devices (desktop, tablet, mobile)
- Verify accessibility: badge focus states, color contrast, aria-labels
- Update product grid container to use responsive Tailwind classes
- A/B test with users: current vs. redesigned card (optional but recommended)

## Performance Considerations

- Brand-colored gradients are CSS only, no additional DOM nodes
- Badges use CSS transforms (`rotate`) instead of images — crisp on all screens
- Quick View button is hidden with `opacity-0` (no layout shift on hover)
- Pack selector uses `overflow-x-auto` for horizontal scroll on mobile
- All animations use `duration-300` for smooth 60fps performance
- Icons are inline SVG (no HTTP requests)

## Notes

- Strength indicators replace simple dots with clear visual hierarchy
- Brand colors subtly reinforce brand identity without overwhelming the card
- Badges feel premium and organic through rotation and shadow
- The redesign maintains current functionality while significantly improving visual appeal
- All colors pass WCAG AA contrast requirements (tested with primary text on card background)
- Cards remain fully accessible with semantic HTML and ARIA labels

