# Sticky Add-to-Cart Bar — Mobile PDP

## Behaviour

- **Shows** when the user scrolls past the main "Add to Cart" button on the PDP
- **Hides** when the user scrolls back up so the main button is visible
- **Desktop:** Hidden (only shows on screens <768px)
- **Height:** 64px fixed to viewport bottom
- **z-index:** 40 (below cart drawer at 50, above page content)

## React Island Component

```tsx
// src/components/react/StickyAddToCart.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { addToCart } from '@/stores/cart';

interface StickyAddToCartProps {
  productName: string;
  productSlug: string;
  price: number;
  packSize: number;
  imageUrl?: string;
}

export default function StickyAddToCart({
  productName,
  productSlug,
  price,
  packSize,
  imageUrl,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Find the main Add to Cart button on the page
    const mainButton = document.querySelector('[data-add-to-cart-main]');
    if (!mainButton) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when main button is NOT visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );

    observerRef.current.observe(mainButton);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleAdd = useCallback(() => {
    setAdding(true);
    addToCart({
      slug: productSlug,
      name: productName,
      packSize,
      price,
      imageUrl: imageUrl || '',
      quantity: 1,
    });
    setTimeout(() => setAdding(false), 600);
  }, [productSlug, productName, packSize, price, imageUrl]);

  // Only render on mobile
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40 md:hidden
        transition-transform duration-300 ease-out
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
      style={{ height: '64px' }}
    >
      {/* Safe area padding for iPhones with home indicator */}
      <div
        className="
          flex h-full items-center gap-3
          bg-primary px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
        "
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Product info (truncated) */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-primary-foreground">
            {productName}
          </p>
          <p className="text-xs text-primary-foreground/80">
            {packSize > 1 ? `${packSize}-pack` : '1 can'} · €{price.toFixed(2)}
          </p>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          disabled={adding}
          className="
            shrink-0 rounded-lg bg-white px-5 py-2.5
            text-sm font-semibold text-primary
            transition-all hover:bg-white/90
            disabled:opacity-70
            min-h-[44px]
          "
          aria-label={`Add ${productName} to cart`}
        >
          {adding ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
```

## Integration in PDP

Add to `src/pages/products/[slug].astro`:

```astro
---
import StickyAddToCart from '@/components/react/StickyAddToCart';
---

<!-- Mark the main Add to Cart button for IntersectionObserver -->
<button data-add-to-cart-main ... >
  Add to Cart
</button>

<!-- Sticky bar at bottom of page -->
<StickyAddToCart
  client:idle
  productName={p.name}
  productSlug={p.slug}
  price={selectedPrice}
  packSize={selectedPackSize}
  imageUrl={p.imageUrl}
/>
```

## Visual Spec

```
┌──────────────────────────────────────┐
│ [Forest Green Background]            │
│                                      │
│  77 Fresh Mint Med...   ┌──────────┐ │
│  5-pack · €13.88        │Add to Cart│ │
│                         └──────────┘ │
│           64px height                │
└──────────────────────────────────────┘
  ↑ safe-area-inset-bottom padding
```

## Key Decisions

1. **IntersectionObserver** over scroll events — better performance, no jank
2. **`data-add-to-cart-main` attribute** — decoupled from CSS classes, won't break if button styles change
3. **`translate-y-full` hide** — slides down off-screen instead of display:none, smoother animation
4. **`env(safe-area-inset-bottom)`** — prevents home indicator overlap on iPhone X+ series
5. **`md:hidden`** — desktop never sees this, Tailwind handles the breakpoint
6. **44px min-height** on the button — meets WCAG touch target requirements
