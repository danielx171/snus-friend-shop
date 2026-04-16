# ProductCard Component — Implementation Guide

**For:** Frontend developers integrating design marathon findings into production
**From:** Design reference component at `docs/design-reviews/components/ProductCard.tsx`
**Status:** Ready for integration into `src/components/react/ProductCard.tsx`

---

## What's Different from Current Component

### Current Component (src/components/react/ProductCard.tsx)

```tsx
// ❌ Strength indicator: 5 dots, no labels (inaccessible to colorblind)
<StrengthIndicator strengthKey={strengthKey} />  // renders •••••

// ❌ No pack selector pills — users must click through to detail page
// ❌ Only shows single price (pack1)
// ❌ No per-unit pricing
// ❌ No flavor-coded left border
// ❌ Strength dots don't pop visually
```

### New Component (docs/design-reviews/components/ProductCard.tsx)

```tsx
// ✅ Color-coded strength badge with text label
<StrengthBadge strengthKey={product.strengthKey} />
// Renders: [●] MILD  or  [●] EXTRA STRONG (fully accessible)

// ✅ Pack selector pills (1/3/5/10) with active highlighting
<PackSelector
  prices={product.prices}
  activePackSize={packState.activePackSize}
  onPackSelect={handlePackSelect}
/>

// ✅ Per-unit pricing updates dynamically
// Shows: €0.95/can (calculated from pack10) vs €1.20/can (pack1)

// ✅ Flavor-coded left border + hover glow
border-l-4 ${flavorGlow.borderColor}  // mint=cyan, fruit=orange, etc.

// ✅ Better visual hierarchy, dark mode, accessibility
```

---

## Step-by-Step Integration

### Step 1: Copy Component File

```bash
# Copy the reference component to the source directory
cp docs/design-reviews/components/ProductCard.tsx src/components/react/ProductCard.tsx
```

### Step 2: Update Import Paths

All imports are already correct (assuming standard monorepo structure):

```tsx
// ✅ These will work as-is
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product, PackSize } from '@/data/products';
```

If your build system uses different path aliases, update:
- `@/stores/cart` → your actual store path
- `@/lib/toast` → your actual toast utility path
- `@/data/products` → your actual product types path

### Step 3: Update Component Usage

**Old usage (with destructured props):**
```tsx
<ProductCard
  slug={product.id}
  name={product.name}
  brand={product.brand}
  imageUrl={product.image}
  prices={product.prices}
  nicotineContent={product.nicotineContent}
  strengthKey={product.strengthKey}
  flavorKey={product.flavorKey}
  ratings={product.ratings}
  badgeKeys={product.badgeKeys}
/>
```

**New usage (with product object):**
```tsx
<ProductCard product={product} />
```

### Step 4: Update Component Lists

In any file that renders ProductCard in grids (e.g., `src/pages/products.astro`):

```tsx
// Before
{products.map((p) => (
  <ProductCard
    key={p.id}
    slug={p.id}
    name={p.name}
    // ... 10+ prop destructurings
  />
))}

// After
{products.map((p) => (
  <ProductCard key={p.id} product={p} />
))}
```

### Step 5: Verify Cart Integration

The new component calls:
```tsx
import { addToCart, openCart } from '@/stores/cart';

// In handleAddToCart callback:
addToCart(product, packState.activePackSize, packState.quantity);
openCart();
```

**Verify this matches your nanostores setup:**
- `addToCart(product, packSize, quantity)` signature
- `openCart()` opens the cart drawer
- `cartToast(productName)` shows success message

If your API differs, update the callback:
```tsx
const handleAddToCart = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  // YOUR_CUSTOM_CART_SYSTEM.add(product, packState.activePackSize);
  // YOUR_CUSTOM_TOAST.show(`Added ${product.name}`);
}, [product, packState.activePackSize]);
```

### Step 6: Test Dark Mode

The component uses Tailwind's `dark:` prefix throughout. Ensure your site has dark mode enabled:

```js
// tailwind.config.ts
export default {
  darkMode: 'class', // or 'media' for system preference
  // ...
};
```

Test by toggling dark mode:
- Light mode: Off-white background, black text, teal accents
- Dark mode: Gray-900 background, white text, teal accents
- Strength badges: Light/dark backgrounds adapt automatically
- Images: Look good on both backgrounds

### Step 7: Responsive Design (Mobile)

**Current component works well at:**
- Desktop: 1 column in card grid (card is full width of grid cell)
- Tablet: Responsive via grid container
- Mobile: Single column stacks naturally

**If you need specific mobile optimizations:**

```tsx
// Option 1: Adjust card padding on mobile
className="p-3 sm:p-4 md:p-5"

// Option 2: Reduce pack selector pills on mobile
{/* Show fewer pack sizes on mobile */}
{isMobile ? (
  <PackSelector sizes={['pack1', 'pack5']} />
) : (
  <PackSelector sizes={['pack1', 'pack3', 'pack5', 'pack10']} />
)}

// Option 3: Hide per-unit price on mobile (show on hover/tap)
className="hidden sm:block text-xs text-gray-600"
```

---

## Testing Checklist

### Visual Testing

- [ ] **Light mode**: Off-white background, black text, teal accents render correctly
- [ ] **Dark mode**: Gray-900 background, white text, teal accents render correctly
- [ ] **Images**: Product images load and scale on hover (105%)
- [ ] **Strength badges**: All 4 colors appear correctly (green/yellow/orange/red)
- [ ] **Flavor borders**: Left border (4px) shows correct flavor color
- [ ] **Pack selector**: Active pill highlights in teal, per-unit price updates
- [ ] **Hover state**: Card lifts (-translate-y-1), shadow appears, glow effect visible
- [ ] **Out of stock**: Badge appears, button disabled, opacity-50

### Functional Testing

- [ ] **Pack selector pills**: Click each pill, verify:
  - Active pill highlights in teal
  - Per-unit price updates: €X.XX/can
  - Total price updates correctly
- [ ] **Add to Cart button**:
  - Click with pack1 selected → item added to cart with pack1
  - Click with pack5 selected → item added to cart with pack5
  - Click when out of stock → no action, button disabled
- [ ] **Links**:
  - Click product name → navigates to `/products/${product.id}`
  - Click brand name → navigates to `/brands/${brand-slug}`
  - Prevent default + stop propagation work correctly
- [ ] **Cart toast**: Verify toast message shows product name

### Accessibility Testing

- [ ] **Color contrast**: All text meets WCAG AA (4.5:1 for normal text)
- [ ] **Keyboard navigation**:
  - Tab through product card → hits brand link, pack pills, Add to Cart button
  - All interactive elements are keyboard-accessible
  - No keyboard traps
- [ ] **Screen readers**:
  - "Add [product name] to cart" button label is announced
  - Pack selector buttons announce "Select [pack size]" + "pressed" state
  - Decorative glow effect hidden (`aria-hidden="true"`)
  - Image alt text: product name
- [ ] **Color blindness**:
  - Strength badge is readable without relying on color alone
  - Text labels (MILD, REGULAR, STRONG, EXTRA STRONG) always visible
  - No color-only information

### Browser Compatibility

- [ ] Chrome/Edge 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile Android

### Performance Testing

```bash
# Measure component render time
npm run test -- ProductCard.test.tsx

# Check bundle impact
npm run build && npx bundlesize
```

**Performance baselines:**
- Component render: <5ms
- Image load (lazy): <200ms (depends on CDN)
- Pack selector state update: <1ms
- Add to Cart callback: <2ms (nanostores is fast)

---

## Customization Points

### 1. Pack Sizes

If you want different pack sizes (e.g., 1, 5, 10, 30):

```tsx
const PackSelector = ({ prices, activePackSize, onPackSelect }) => {
  const packSizes = [
    { size: 'pack1', label: '1', cans: 1 },
    { size: 'pack5', label: '5', cans: 5 },
    { size: 'pack10', label: '10', cans: 10 },
    { size: 'pack30', label: '30', cans: 30 },  // NEW
  ];
  // ...
};
```

### 2. Flavor-to-Color Mapping

If your flavor keys are different:

```tsx
const flavorGlowMap = {
  // Update to match your Product.flavorKey enum
  'your-flavor-key': {
    borderColor: 'border-cyan-500',
    glowRgb: '34, 211, 238',
  },
};
```

### 3. Strength Labels

If you use different strength names:

```tsx
const strengthConfig = {
  'your-strength-key': {
    label: 'YOUR LABEL',
    color: '#COLOR_HEX',
    bgClass: 'bg-color-100 dark:bg-color-950',
    textClass: 'text-color-700 dark:text-color-300',
  },
};
```

### 4. Teal Brand Color

If your primary color isn't teal (e.g., your theme uses a different accent):

```tsx
// Update all instances of:
// 'bg-teal-600', 'text-teal-600', 'border-teal-400', 'shadow-teal-600/20'
// to your theme's primary color

// Check your theme CSS variables:
// src/index.css for --primary, --accent, etc.
className="bg-[var(--primary)] dark:bg-[var(--primary)/80]"
```

### 5. Price Calculation

If your pricing structure differs (e.g., bulk discounts):

```tsx
// Current: price[packSize] ÷ packCount = per-unit price
// Custom example: apply bulk discount
const perUnitPrice = useMemo(() => {
  const packMultiplier = parseInt(packState.activePackSize.slice(4));
  let price = product.prices[packState.activePackSize];

  // Apply 10% bulk discount for pack10+
  if (packMultiplier >= 10) {
    price = price * 0.9;
  }

  return price / packMultiplier;
}, [product.prices, packState.activePackSize]);
```

---

## Common Issues & Fixes

### Issue: "Cannot find module '@/stores/cart'"

**Cause:** Path alias not configured or different from expected

**Fix:**
```tsx
// Check tsconfig.json for path aliases:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // Make sure @ is configured
    }
  }
}
```

### Issue: Pack selector price doesn't update

**Cause:** `useMemo` dependency array incomplete

**Fix:** Ensure `perUnitPrice` recalculates when `packState` or `prices` change:
```tsx
const perUnitPrice = useMemo(() => {
  // ...calculation...
}, [product.prices, packState.activePackSize]);  // Both dependencies
```

### Issue: Add to Cart button doesn't open cart drawer

**Cause:** `openCart()` from nanostores not called or not working

**Fix:**
```tsx
import { openCart } from '@/stores/cart';

// In handleAddToCart:
addToCart(product, packState.activePackSize);
openCart();  // Make sure this is called AFTER addToCart
```

### Issue: Dark mode styles not applying

**Cause:** Tailwind dark mode not enabled in config

**Fix:**
```js
// tailwind.config.ts
export default {
  darkMode: 'class',  // or 'media'
  theme: { /* ... */ },
};

// HTML element (or wrapper) must have class="dark"
<div class="dark">
  <ProductCard product={product} />
</div>
```

### Issue: Flavor border colors not showing

**Cause:** Tailwind `border-l-4` class not being generated

**Fix:** Ensure Tailwind processes the file:
```js
// tailwind.config.ts
content: [
  './src/**/*.{astro,tsx,ts,jsx,js}',  // Include .astro files if using Astro
  './docs/design-reviews/**/*.tsx',      // If testing from docs folder
],
```

---

## Performance Optimization Tips

1. **Wrap in React.memo** (already done, but verify):
   ```tsx
   export const ProductCard = React.memo<ProductCardProps>(...);
   ```

2. **Use useCallback for event handlers** (already done):
   ```tsx
   const handleAddToCart = useCallback((e: React.MouseEvent) => { ... }, [...deps]);
   ```

3. **Cache expensive calculations with useMemo** (already done):
   ```tsx
   const perUnitPrice = useMemo(() => { ... }, [...deps]);
   ```

4. **Lazy load images**:
   ```tsx
   <img loading="lazy" ... />  // Already in component
   ```

5. **Monitor bundle size** with Webpack Bundle Analyzer:
   ```bash
   npm run build -- --analyze
   ```

---

## Deployment Checklist

Before merging to main:

- [ ] All tests pass: `npm run test`
- [ ] Linting passes: `npm run lint`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Visual regression tests pass (compare old vs new designs)
- [ ] Accessibility audit passes: WCAG AA, no axe violations
- [ ] Performance budget not exceeded: Component <4KB gzipped
- [ ] All interactive elements work on mobile
- [ ] Dark mode rendering verified
- [ ] Cart integration tested end-to-end (add product → view cart → checkout)
- [ ] Analytics events fire correctly (if tracking component interactions)

---

## Questions & Support

If you hit issues:

1. **Check DESIGN_NOTES.md** for design rationale and feature explanations
2. **Review component code comments** — JSDoc explains each section
3. **Compare with old ProductCard.tsx** — see what changed
4. **Test in isolation** with Storybook before integrating into pages
5. **Check codebase patterns** — follow existing conventions for image handling, state management, etc.

---

## Next Steps

After integration:

1. **Create Storybook stories** for visual regression testing
2. **Monitor analytics** — compare old card click-through rates with new
3. **A/B test** (optional) — some users see old card, some see new, measure engagement
4. **Collect feedback** — monitor support tickets for confusion or bugs
5. **Iterate** — use this as baseline for future card improvements

Good luck with the redesign! 🚀
