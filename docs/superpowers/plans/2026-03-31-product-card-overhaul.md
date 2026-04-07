# Product Card Overhaul + PLP Fix + Font Upgrade

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade product cards with flavor-coded borders, strength text badges, inline pack selector, and new fonts — plus move products above the fold on PLP.

**Architecture:** Changes span CSS (font system), Astro (ProductCard template, PLP layout), React (CardAddToCart pack selection), and data (flavor color map). Cart store already supports multi-pack — no backend changes needed.

**Tech Stack:** Astro 6, React 18, Tailwind v4, nanostores

---

### Task 1: Add Flavor Color Map

**Files:**
- Modify: `src/data/brand-colors.ts` (append after line 54)

- [ ] **Step 1: Add flavor color exports**

Add at the end of `src/data/brand-colors.ts`:

```ts
/** Flavor family colors for product card left borders */
export const flavorColors: Record<string, string> = {
  mint: '#06B6D4',
  menthol: '#06B6D4',
  berry: '#A855F7',
  citrus: '#84CC16',
  coffee: '#92400E',
  tobacco: '#78716C',
  fruit: '#FB923C',
  tropical: '#FB923C',
  cola: '#92400E',
  vanilla: '#F59E0B',
  licorice: '#374151',
};

export const defaultFlavorColor = '#6B7280';
```

- [ ] **Step 2: Verify build**

Run: `bun run build 2>&1 | tail -5`
Expected: Build succeeds, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/brand-colors.ts
git commit -m "feat: add flavor color map for product card borders"
```

---

### Task 2: Upgrade Font System

**Files:**
- Modify: `src/index.css` (lines 109-112, lines 401-416)

- [ ] **Step 1: Update font-sans and add font-heading in @theme block**

In `src/index.css`, change the `--font-sans` line (around line 110) from:

```css
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
```

to:

```css
  --font-sans: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  --font-heading: 'Space Grotesk', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
```

- [ ] **Step 2: Apply heading font to both themes**

Replace the Forest and Copper heading rules (lines ~401-416) with a single rule that applies to both:

```css
  /* Heading typography — both themes use Space Grotesk */
  :root h1,
  :root h2,
  :root h3,
  .forest h1,
  .forest h2,
  .forest h3,
  .copper h1,
  .copper h2,
  .copper h3 {
    font-family: 'Space Grotesk', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
```

- [ ] **Step 3: Update :root and .forest --font-sans**

The `--font-sans` is also defined inside `:root` (line 170) and `.forest` (not explicitly, inherits). Change line 170 from:

```css
    --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
```

to:

```css
    --font-sans: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
```

- [ ] **Step 4: Verify build**

Run: `bun run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "feat: upgrade fonts — Space Grotesk headings, Plus Jakarta Sans body"
```

---

### Task 3: Redesign Product Card — Flavor Border + Strength Badge

**Files:**
- Modify: `src/components/astro/ProductCard.astro`

- [ ] **Step 1: Import flavorColors**

At line 4 of `ProductCard.astro`, change:

```ts
import { brandColors, strengthColors, strengthLabels, defaultBrandColor } from '@/data/brand-colors';
```

to:

```ts
import { brandColors, strengthColors, strengthLabels, defaultBrandColor, flavorColors, defaultFlavorColor } from '@/data/brand-colors';
```

- [ ] **Step 2: Add flavorColor variable**

After the `strengthColor` assignment (line 36), add:

```ts
// Flavor color for left border
const flavorColor = flavorColors[flavorKey] ?? defaultFlavorColor;
```

- [ ] **Step 3: Add flavor left border to card outer element**

Change the outer `<a>` tag (line 59-65) from:

```html
<a
  href={`/products/${slug}`}
  data-astro-prefetch
  aria-label={`${name} by ${brand} — view product details`}
  data-nicotine-mg={nicotineContent}
  class="product-card group relative flex min-h-[48px] flex-col overflow-hidden rounded-xl bg-card/60 backdrop-blur-sm border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/30"
>
```

to:

```html
<a
  href={`/products/${slug}`}
  data-astro-prefetch
  aria-label={`${name} by ${brand} — view product details`}
  data-nicotine-mg={nicotineContent}
  class="product-card group relative flex min-h-[48px] flex-col overflow-hidden rounded-xl bg-card/60 backdrop-blur-sm border border-border border-l-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/30"
  style={`border-left-color: ${flavorColor};`}
>
```

- [ ] **Step 4: Replace strength dots with text badge**

Replace the entire strength + flavor block (lines 118-128):

```html
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-1" role="img" aria-label={`${strengthLabels[strengthKey] ?? 'Normal'} strength`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span class={`inline-block h-1.5 w-1.5 rounded-full ${i < strengthLevel ? '' : 'opacity-25'}`} style={`background-color: ${strengthColor};`} />
        ))}
        <span class="text-xs font-medium text-muted-foreground ml-0.5">{strengthLabels[strengthKey] ?? 'Normal'}</span>
      </div>
      <span class="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
        {flavorKey}
      </span>
    </div>
```

with:

```html
    <div class="flex items-center gap-1.5 flex-wrap">
      <span
        class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
        style={`background-color: ${strengthColor}18; color: ${strengthColor};`}
        role="img"
        aria-label={`${strengthLabels[strengthKey] ?? 'Normal'} strength`}
      >
        {strengthLabels[strengthKey] ?? 'Normal'}
      </span>
      <span class="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground capitalize">
        {flavorKey}
      </span>
      <span class="text-[10px] text-muted-foreground">{nicotineContent} mg</span>
    </div>
```

- [ ] **Step 5: Remove standalone nicotine mg line**

Delete line 161 (the standalone nicotine line, since we moved it into the meta row):

```html
    <span class="text-xs text-muted-foreground">{nicotineContent} mg/pouch</span>
```

- [ ] **Step 6: Remove the strength dots variables**

Remove the `strengthMap` and `strengthLevel` variables (lines 48-51) since we no longer use dots:

```ts
const strengthMap: Record<string, number> = {
  light: 1, normal: 2, strong: 3, 'extra-strong': 4, 'super-strong': 5,
};
const strengthLevel = strengthMap[strengthKey] ?? 2;
```

- [ ] **Step 7: Remove the "Earn X pts" line**

Delete lines 168-173 (the points display — space is needed for pack selector):

```html
        {earnablePoints > 0 && (
          <div class="flex items-center gap-0.5 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-primary" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <span class="text-[10px] font-medium text-primary">Earn {earnablePoints} pts</span>
          </div>
        )}
```

Also remove the `earnablePoints` variable (line 30):

```ts
const earnablePoints = Math.floor(displayPrice);
```

- [ ] **Step 8: Verify build**

Run: `bun run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 9: Commit**

```bash
git add src/components/astro/ProductCard.astro
git commit -m "feat: product cards — flavor borders, strength badges, remove dots"
```

---

### Task 4: Add Pack Selector to CardAddToCart

**Files:**
- Modify: `src/components/react/CardAddToCart.tsx`

- [ ] **Step 1: Rewrite CardAddToCart with pack selection**

Replace the entire contents of `src/components/react/CardAddToCart.tsx` with:

```tsx
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import type { Product, PackSize } from '@/data/products';
import { RETAIL_PACK_SIZES, packSizeMultipliers } from '@/data/products';
import { memo, useCallback, useRef, useState } from 'react';

interface CardAddToCartProps {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  nicotineContent: number;
  strengthKey: string;
  flavorKey: string;
  ratings: number;
  badgeKeys: string[];
}

const CardAddToCart = memo(function CardAddToCart(props: CardAddToCartProps) {
  const isOutOfStock = props.stock === 0;
  const btnRef = useRef<HTMLButtonElement>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');

  // Only show packs that have pricing > 0
  const availablePacks = RETAIL_PACK_SIZES.filter(
    (pk) => (props.prices[pk] ?? 0) > 0
  );

  // Calculate savings vs pack1
  const pack1Price = props.prices.pack1 ?? 0;
  const getSavings = (pk: PackSize): number => {
    if (pk === 'pack1' || pack1Price <= 0) return 0;
    const perCan = (props.prices[pk] ?? 0) / packSizeMultipliers[pk];
    return Math.round((1 - perCan / pack1Price) * 100);
  };

  // Display price for selected pack
  const displayPrice = props.prices[selectedPack] ?? pack1Price;
  const displayPerCan = selectedPack === 'pack1'
    ? displayPrice
    : displayPrice / packSizeMultipliers[selectedPack];

  const handleAdd = useCallback(() => {
    if (isOutOfStock) return;
    const product: Product = {
      id: props.slug,
      name: props.name,
      brand: props.brand,
      categoryKey: 'nicotinePouches',
      flavorKey: props.flavorKey as Product['flavorKey'],
      strengthKey: props.strengthKey as Product['strengthKey'],
      formatKey: 'slim',
      nicotineContent: props.nicotineContent,
      portionsPerCan: 20,
      descriptionKey: '',
      image: props.imageUrl,
      ratings: props.ratings,
      badgeKeys: props.badgeKeys as Product['badgeKeys'],
      prices: props.prices as Product['prices'],
      manufacturer: props.brand,
      stock: props.stock,
    };
    addToCart(product, selectedPack);
    openCart();
    cartToast(props.name);

    setJustAdded(true);
    btnRef.current?.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.94)', offset: 0.3 },
      { transform: 'scale(1.03)', offset: 0.6 },
      { transform: 'scale(1)' },
    ], { duration: 250, easing: 'ease' });
    setTimeout(() => setJustAdded(false), 1200);
  }, [props, selectedPack, isOutOfStock]);

  return (
    <div className="mt-auto flex flex-col gap-1.5 pt-1">
      {/* Pack selector pills */}
      {availablePacks.length > 1 && (
        <div className="flex gap-1 flex-wrap">
          {availablePacks.map((pk) => {
            const qty = packSizeMultipliers[pk];
            const savings = getSavings(pk);
            return (
              <button
                key={pk}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedPack(pk); }}
                className={cn(
                  "text-[10px] px-2 py-1 rounded-full border font-medium transition-all",
                  pk === selectedPack
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-transparent text-muted-foreground hover:border-primary/40"
                )}
                aria-label={`Select ${qty} can${qty > 1 ? 's' : ''}`}
              >
                {qty === 1 ? '1 can' : qty}
                {savings > 0 && (
                  <span className={cn(
                    "ml-0.5 text-[9px] font-bold",
                    pk === selectedPack ? "text-green-200" : "text-green-500"
                  )}>
                    -{savings}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Price + Add button */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-lg font-bold text-foreground">
            &euro;{displayPrice.toFixed(2)}
          </span>
          <span className="text-[10px] text-muted-foreground ml-1">
            {selectedPack === 'pack1' ? '/ can' : `/ ${packSizeMultipliers[selectedPack]} cans`}
          </span>
          {selectedPack !== 'pack1' && (
            <span className="block text-[10px] text-muted-foreground">
              €{displayPerCan.toFixed(2)} per can
            </span>
          )}
        </div>
        <button
          ref={btnRef}
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? `Sold Out – ${props.name}` : `Add ${packSizeMultipliers[selectedPack]} to cart – ${props.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOutOfStock ? '✕' : justAdded ? '✓' : '+'}
        </button>
      </div>
    </div>
  );
});

export default CardAddToCart;
```

- [ ] **Step 2: Update ProductCard.astro price/cart section**

Replace the price+cart block at the bottom of ProductCard.astro (the `mt-auto` div with price and CardAddToCart) with just the CardAddToCart component — since it now handles both the price display and the add button:

Replace:
```html
    {/* Price + Cart */}
    <div class="mt-auto flex items-end justify-between pt-2">
      <div>
        <span class="text-lg font-bold text-foreground">&euro;{displayPrice.toFixed(2)}</span>
        <span class="text-[10px] text-muted-foreground ml-1">/ can</span>
      </div>
      <CardAddToCart
        client:visible
        slug={slug}
        ...
      />
    </div>
```

with just:
```html
    <CardAddToCart
      client:visible
      slug={slug}
      name={name}
      brand={brand}
      imageUrl={imageUrl}
      prices={prices}
      stock={stock}
      nicotineContent={nicotineContent}
      strengthKey={strengthKey}
      flavorKey={flavorKey}
      ratings={ratings}
      badgeKeys={badgeKeys}
    />
```

Also remove the `displayPrice` variable from the frontmatter (line 27):
```ts
const displayPrice = prices.pack1;
```

- [ ] **Step 3: Verify build**

Run: `bun run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/react/CardAddToCart.tsx src/components/astro/ProductCard.astro
git commit -m "feat: inline pack selector on product cards with savings display"
```

---

### Task 5: Restructure PLP — Products Above the Fold

**Files:**
- Modify: `src/pages/nicotine-pouches.astro`

- [ ] **Step 1: Restructure the page content order**

In `src/pages/nicotine-pouches.astro`, reorganize the content inside the `<div class="mx-auto max-w-7xl ...">` to put products first. The new order should be:

1. Compact H1 + 1-line description
2. Quick filter pills
3. FilterableProductGrid
4. HR separator
5. Full SEO article text

Replace the entire `<article>` block + FilterableProductGrid section with:

```html
    {/* Compact header */}
    <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      Buy Nicotine Pouches Online
    </h1>
    <p class="mt-2 text-base text-muted-foreground">
      <strong class="text-foreground">{totalProducts}+ products</strong> from <strong class="text-foreground">{brandCount} brands</strong>. Filter by strength, flavour, or brand. Fast EU shipping.
    </p>

    {/* Quick filter pills */}
    <div class="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
      <a href="/products/flavor/mint" class="rounded-xl border border-border bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">Mint</a>
      <a href="/products/flavor/berry" class="rounded-xl border border-border bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">Berry</a>
      <a href="/products/flavor/citrus" class="rounded-xl border border-border bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">Citrus</a>
      <a href="/products/strength/strong" class="rounded-xl border border-border bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">Strong</a>
      <a href="/products/strength/extra-strong" class="rounded-xl border border-border bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">Extra Strong</a>
      <a href="/brands" class="rounded-xl border border-border bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">All Brands</a>
    </div>

    {/* Product grid — above the fold */}
    <div class="mt-8">
      <h2 class="sr-only">Product Catalog</h2>
      <FilterableProductGrid client:idle productsJsonUrl="/data/products.json" />
    </div>

    {/* SEO content — below products for crawlers */}
    <hr class="my-12 border-border" />
    <article class="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
```

Then keep the existing SEO text (the 3 h2/p blocks about "What Are Nicotine Pouches?", "How to Choose", "Buying in Europe") and close with `</article>`.

- [ ] **Step 2: Verify build**

Run: `bun run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/pages/nicotine-pouches.astro
git commit -m "feat: PLP products above the fold, SEO text below"
```

---

### Task 6: Verify Everything End-to-End

- [ ] **Step 1: Full build**

Run: `bun run build 2>&1 | tail -10`
Expected: Build succeeds, 1100+ pages indexed.

- [ ] **Step 2: Run tests**

Run: `bun run test 2>&1 | tail -10`
Expected: All tests pass.

- [ ] **Step 3: Visual verification checklist**

Run `bun run dev` and check:
- [ ] Homepage product cards show colored left borders (teal for mint, purple for berry, etc.)
- [ ] Strength shows as colored text badge (NORMAL, STRONG, EXTRA STRONG) not dots
- [ ] Pack selector pills appear on cards (1 can, 3, 5, 10 with savings %)
- [ ] Clicking pack pill changes the displayed price
- [ ] Clicking + adds the selected pack to cart
- [ ] PLP page (/nicotine-pouches) shows filter pills then products above the fold
- [ ] SEO text appears below the product grid
- [ ] Headings use Space Grotesk font (slightly geometric/wider than Inter)
- [ ] Both Forest and Copper themes render correctly
- [ ] Mobile (390px): pack pills wrap, cards don't overflow

- [ ] **Step 4: Final commit if any adjustments needed**

```bash
git add -A
git commit -m "fix: post-review adjustments"
```
