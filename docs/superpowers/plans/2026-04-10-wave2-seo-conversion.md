# Wave 2: SEO/Conversion Advantage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve conversion rate and SEO quality across brand pages, product discovery, quiz, blog modules, and membership.

**Architecture:** All changes modify existing Astro pages and React components. No new DB tables. Product data available at build time via `getCollection('products')`. Brand colors, strength colors, and flavor colors from existing `src/data/brand-colors.ts`.

**Tech Stack:** Astro 6, React 18 islands, TypeScript, Tailwind v4

---

## File Map

| File | Change |
|------|--------|
| `src/pages/brands/[slug].astro` | Enlarge mosaic, remove monogram, add brand-color backdrop |
| `src/components/react/FlavorQuizIsland.tsx` | Replace ResultCard with ProductCard import |
| `src/components/astro/BlogProductCard.astro` | Add strength dots + CardAddToCart (already has price) |
| `src/pages/products/[slug].astro` | Add "Same flavour" + "Similar strength" suggestion rows |
| `src/pages/membership.astro` | Visual tier progression polish |

---

### Task 1: Brand Page Hero — Enlarge Mosaic, Remove Monogram

**Files:**
- Modify: `src/pages/brands/[slug].astro`

- [ ] **Step 1: Read the brand page and understand the current hero**

The hero has two parts: a text section (left) with a monogram/logo, and a product mosaic grid (right, lines 130-168). The monogram is lines 170-195. The mosaic uses 80px/140px images in a 3-col 2-row grid positioned on the right 55% of the hero.

- [ ] **Step 2: Enlarge the mosaic grid images**

In the mosaic rendering section (around line 143), change the image sizes:
- Large position (index 0): `140` → `200` (both width and height)
- Small positions (index 1-4): `80` → `120`

Also update the container classes to take more visual space — change from `right: 0; width: 55%` to `right: 0; width: 60%`.

- [ ] **Step 3: Replace the monogram with brand-colored text treatment**

Find the monogram/initials fallback (lines 186-194). Replace the `<span>` initials with just the brand name in large bold text at the brand color. This is cleaner than a fake logo:

```html
<span class="text-3xl font-extrabold tracking-tight" style={`color: ${brandColor}`}>
  {b.name}
</span>
```

Remove the rounded-full container and the initials logic. Keep the `b.logoUrl` path for brands that DO have logos.

- [ ] **Step 4: Add brand-colored gradient to the mosaic backdrop**

In the hero section background (around line 126), enhance the gradient to use the brand color:

Find the existing gradient div and add a brand-colored radial glow behind the mosaic:
```html
<div class="absolute right-0 top-0 bottom-0 w-2/3 pointer-events-none"
  style={`background: radial-gradient(ellipse at 70% 50%, ${brandColor}15 0%, transparent 70%);`}
/>
```

- [ ] **Step 5: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add "src/pages/brands/[slug].astro"
git commit -m "feat: brand page hero — enlarge mosaic, remove monogram, add brand glow"
```

---

### Task 2: Flavour Quiz — Replace ResultCard with ProductCard

**Files:**
- Modify: `src/components/react/FlavorQuizIsland.tsx`

- [ ] **Step 1: Read the quiz component and find the ResultCard**

The `ResultCard` component is defined at lines 140-263. It renders quiz results with a custom card format. The results grid is at lines 518-543.

- [ ] **Step 2: Import the React ProductCard**

At the top of FlavorQuizIsland.tsx, add:
```typescript
import ProductCard from '@/components/react/ProductCard';
```

- [ ] **Step 3: Replace the ResultCard usage in the results grid**

Find the results grid (around line 524):
```jsx
{results.map((p) => (
  <ResultCard key={p.slug} p={p} selectedFlavors={selectedFlavors} />
))}
```

Replace with:
```jsx
{results.slice(0, 5).map((p) => (
  <ProductCard
    key={p.slug}
    slug={p.slug}
    name={p.name}
    brand={p.brand}
    brandSlug={p.brandSlug}
    imageUrl={p.imageUrl}
    prices={p.prices}
    stock={p.stock}
    nicotineContent={p.nicotineContent}
    strengthKey={p.strengthKey}
    flavorKey={p.flavorKey}
    ratings={p.ratings}
    badgeKeys={[]}
  />
))}
```

Note: Limit to 5 results (was 12). The ProductCard is larger and richer so fewer is better.

- [ ] **Step 4: Remove the ResultCard component definition**

Delete the entire `ResultCard` component (lines 140-263) since it's no longer used.

- [ ] **Step 5: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/components/react/FlavorQuizIsland.tsx
git commit -m "feat: quiz results use ProductCard with add-to-cart"
```

---

### Task 3: BlogProductCard — Add Strength Dots

**Files:**
- Modify: `src/components/astro/BlogProductCard.astro`

- [ ] **Step 1: Read the current BlogProductCard**

It already has: brand name, product name, price, flavor badge, strength badge (as text pill), and CardAddToCart. It does NOT have the visual strength dots (1-5 filled circles) that the main ProductCard has.

- [ ] **Step 2: Add strength dots between brand name and product name**

After the brand name link (around line 95) and before the product name (around line 98), add a strength dots indicator:

```html
<div class="flex items-center gap-0.5 mt-1" role="img" aria-label={`${strengthKey} strength`}>
  {Array.from({ length: 5 }, (_, i) => (
    <div
      class="rounded-full"
      style={{
        width: i < strengthDots ? '5px' : '4px',
        height: i < strengthDots ? '5px' : '4px',
        backgroundColor: i < strengthDots ? strengthColor : 'rgba(128,128,128,0.2)',
      }}
    />
  ))}
</div>
```

In the frontmatter, add the strength dots calculation:
```typescript
const strengthMap: Record<string, number> = {
  light: 1, normal: 2, strong: 3, 'extra-strong': 4, 'super-strong': 5,
};
const strengthDots = strengthMap[strengthKey] ?? 2;
```

Import `strengthColors` from `@/data/brand-colors` if not already imported.

- [ ] **Step 3: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/components/astro/BlogProductCard.astro
git commit -m "feat: add strength dots to BlogProductCard"
```

---

### Task 4: PDP Suggestion Rows — Same Flavour + Similar Strength

**Files:**
- Modify: `src/pages/products/[slug].astro`

- [ ] **Step 1: Read the PDP page and find the related products section**

Currently (lines 441-464) there's one section: "More from {brand}" showing 4 same-brand products. We're adding 2 new suggestion rows ABOVE this section.

- [ ] **Step 2: Compute suggestion sets in getStaticPaths**

In the `getStaticPaths` function (around line 14-22), extend the props to include two new product sets:

```typescript
// Same flavour, different brand (exclude current product and current brand)
const sameFlavour = allProducts
  .filter((rp) => rp.data.flavorKey === product.data.flavorKey 
    && rp.data.brandSlug !== product.data.brandSlug 
    && rp.id !== product.id 
    && rp.data.imageUrl
    && rp.data.stock > 0)
  .sort((a, b) => (b.data.ratings || 0) - (a.data.ratings || 0))
  .slice(0, 4),

// Similar strength, better value (same strength key, sorted by price ascending)
const similarStrength = allProducts
  .filter((rp) => rp.data.strengthKey === product.data.strengthKey 
    && rp.id !== product.id 
    && rp.data.imageUrl
    && rp.data.stock > 0)
  .sort((a, b) => (a.data.prices?.pack1 || 99) - (b.data.prices?.pack1 || 99))
  .slice(0, 4),
```

Add `sameFlavour` and `similarStrength` to the `props` object alongside `relatedProducts`.

- [ ] **Step 3: Render the two suggestion rows**

Before the existing "More from {brand}" section (around line 441), add:

```html
{sameFlavour.length > 0 && (
  <section class="mt-12">
    <h2 class="mb-4 text-lg font-bold text-foreground">Same flavour, different brand</h2>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {sameFlavour.map((rp: any) => (
        <ProductCard
          slug={rp.id}
          name={rp.data.name}
          brand={rp.data.brand}
          brandSlug={rp.data.brandSlug}
          imageUrl={rp.data.imageUrl}
          prices={rp.data.prices}
          stock={rp.data.stock}
          nicotineContent={rp.data.nicotineContent}
          strengthKey={rp.data.strengthKey}
          flavorKey={rp.data.flavorKey}
          ratings={rp.data.ratings}
          badgeKeys={rp.data.badgeKeys}
        />
      ))}
    </div>
  </section>
)}

{similarStrength.length > 0 && (
  <section class="mt-12">
    <h2 class="mb-4 text-lg font-bold text-foreground">Similar strength, great value</h2>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {similarStrength.map((rp: any) => (
        <ProductCard
          slug={rp.id}
          name={rp.data.name}
          brand={rp.data.brand}
          brandSlug={rp.data.brandSlug}
          imageUrl={rp.data.imageUrl}
          prices={rp.data.prices}
          stock={rp.data.stock}
          nicotineContent={rp.data.nicotineContent}
          strengthKey={rp.data.strengthKey}
          flavorKey={rp.data.flavorKey}
          ratings={rp.data.ratings}
          badgeKeys={rp.data.badgeKeys}
        />
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 4: Destructure new props**

At the top of the page (around line 23), update the destructuring:
```typescript
const { product, relatedProducts, sameFlavour, similarStrength } = Astro.props;
```

- [ ] **Step 5: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add "src/pages/products/[slug].astro"
git commit -m "feat: PDP suggestion rows — same flavour + similar strength"
```

---

### Task 5: Membership Page — Premium Visual Polish

**Files:**
- Modify: `src/pages/membership.astro`

- [ ] **Step 1: Read the membership page tier display section**

The tier progression (lines 152-182) shows 5 circles connected by a line. The tier detail cards (lines 184-245) show 3-col grid with perks.

- [ ] **Step 2: Improve the hero heading**

Find the main heading (around line 102). Change from a simple "Membership Tiers" text to a more aspirational treatment:

```html
<div class="text-center mb-10">
  <p class="text-sm font-medium uppercase tracking-widest text-primary mb-2">Your Journey</p>
  <h1 class="text-3xl font-bold text-foreground sm:text-4xl">The Circles</h1>
  <p class="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
    Every purchase, review, and mission advances you through five membership Circles.
    Each Circle unlocks better perks and deeper community access.
  </p>
</div>
```

- [ ] **Step 3: Polish the tier progression dots**

The current 5-circle progression works well. Add a subtle animation to the current tier indicator — make it pulse gently:

Find the current tier circle (the one with `scale-110` and `ring-4`). Add a CSS pulse:
```html
class="... animate-pulse"
```

Actually, `animate-pulse` is too aggressive. Instead add a subtle glow:
```html
style={`box-shadow: 0 0 20px ${currentTierColor}40;`}
```

- [ ] **Step 4: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/pages/membership.astro
git commit -m "feat: membership page — aspirational heading + tier glow"
```

---

### Task 6: Final Build, Push, Deploy

- [ ] **Step 1: Full build**
```bash
bun run build 2>&1 | tail -10
```

- [ ] **Step 2: Push and deploy**
```bash
git push origin astro-migration-clean
npx vercel deploy --archive=tgz 2>&1 | tail -5
# Wait for preview, then promote
echo "y" | npx vercel promote <preview-url>
```

- [ ] **Step 3: Verify**
- Brand page `/brands/zyn`: larger mosaic, no monogram, brand glow
- Flavour quiz: results show ProductCards with add-to-cart
- Blog article: product cards have strength dots
- Product page: 2 suggestion rows below main product
- Membership page: "The Circles" aspirational heading
