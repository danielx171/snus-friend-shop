# E-Commerce Micro-Interactions & UX Patterns Research

**Date:** 2026-03-27
**Scope:** Modern DTC e-commerce design patterns for SnusFriend (nicotine pouch B2C)
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Cart Drawer Micro-Interactions](#cart-drawer-micro-interactions)
3. [Product Card Hover States](#product-card-hover-states)
4. [Variant/Strength Selector Patterns](#variantstrength-selector-patterns)
5. [Mobile-First E-Commerce Patterns](#mobile-first-e-commerce-patterns)
6. [Loading & Skeleton States](#loading--skeleton-states)
7. [Accessibility in E-Commerce](#accessibility-in-e-commerce)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

Modern DTC e-commerce brands are converging around **subtle, purposeful micro-interactions** that reduce perceived wait time, guide users through decision-making, and provide tactile feedback. Key trends for 2025–2026:

- **Timing:** All micro-interactions should live in the 200–500ms window (noticeable but not jarring)
- **SVG animations:** Preferred over video for accessibility and performance
- **Perceived performance:** Skeleton screens and shimmer effects are standard on premium sites
- **Mobile primacy:** 60%+ of e-commerce traffic is mobile; sticky ATC buttons and bottom-sheet filters are table stakes
- **Accessibility:** WCAG AA (4.5:1 contrast for text, 3:1 for UI) is now legally critical; 71% of users with disabilities abandon inaccessible sites
- **Purpose-driven:** Every animation must solve a problem or guide users—gratuitous motion reduces trust

For SnusFriend, this means:
- Free shipping progress bar with celebration animation when goal is hit
- Smooth quantity stepper with disabled state management
- Smooth product card image swaps and quick-add reveals on hover
- Prominent strength/flavor selector with clear disabled states
- Bottom-sheet filters on mobile with sticky ATC button
- Skeleton screens for product grid and cart loading
- WCAG AA compliance on all interactive elements

---

## Cart Drawer Micro-Interactions

### Current Best Practices

**Animation Timing:**
Cart updates should animate at 200–400ms. Drawer entrance/exit should be 300–400ms. Slower (500ms+) feels sluggish; faster feels jarring.

**Free Shipping Progress Bar**

The free shipping bar is now a **must-have** feature on DTC sites targeting $30–$100 AOV (Average Order Value). Studies show 7.9–20% AOV lift when implemented:

- **Visual design:** Horizontal progress bar, 100% width on mobile, updates in real-time as items are added
- **Color state:** Gray background (unfilled), brand color filled (progress), with subtle animation
- **Messaging:** "Add $X to unlock free shipping" above the bar; celebrations when goal is hit
- **Animation:** Soft glow or pulse when milestone is reached

**Implementation (React + Tailwind):**

```tsx
// CartFreeShippingBar.tsx
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

const SHIPPING_THRESHOLD = 5000; // in cents ($50)

export function CartFreeShippingBar() {
  const { cartTotal } = useCart();
  const progress = Math.min((cartTotal / SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(SHIPPING_THRESHOLD - cartTotal, 0);
  const hasReachedGoal = cartTotal >= SHIPPING_THRESHOLD;

  return (
    <div className="w-full px-4 py-3 bg-secondary/50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          {hasReachedGoal ? (
            <span className="text-green-600 font-semibold">✓ Free shipping unlocked!</span>
          ) : (
            <span>Add ${(remaining / 100).toFixed(2)} more for free shipping</span>
          )}
        </span>
        <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
      </div>

      {/* Progress bar background */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        {/* Animated fill */}
        <motion.div
          className={`h-full rounded-full transition-colors ${
            hasReachedGoal ? 'bg-green-500' : 'bg-primary'
          }`}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Goal celebration animation */}
      {hasReachedGoal && (
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm font-semibold text-green-600">🎉 You qualify!</span>
        </motion.div>
      )}
    </div>
  );
}
```

**Quantity Stepper Micro-Interaction**

Quantity controls need clear visual feedback and disabled states:

- **Button size:** 40×40px minimum (mobile: 48×48px for comfortable thumb reach)
- **Icons:** `−` and `+` symbols, or `ChevronDown`/`ChevronUp`
- **Feedback:** Slight scale pulse on click (1 → 1.05 → 1), 100–150ms
- **Disabled state:** Opacity 0.4 + cursor-not-allowed; never hide the button
- **Keyboard:** Support `Tab`, `Arrow Up/Down`, `Enter`

**Implementation:**

```tsx
// QuantityStepper.tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface QuantityStepperProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ quantity, onQuantityChange, min = 1, max = 99 }: QuantityStepperProps) {
  const canDecrement = quantity > min;
  const canIncrement = quantity < max;

  const handleDecrement = () => {
    if (canDecrement) onQuantityChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (canIncrement) onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center border border-input rounded-md">
      {/* Decrement button */}
      <motion.button
        whileTap={{ scale: 1.05 }}
        onClick={handleDecrement}
        disabled={!canDecrement}
        aria-label={`Decrease quantity. Current quantity is ${quantity}`}
        className={`px-3 py-2 text-sm font-medium transition-opacity ${
          !canDecrement ? 'opacity-40 cursor-not-allowed' : 'hover:bg-secondary'
        }`}
      >
        −
      </motion.button>

      {/* Quantity display */}
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const val = Math.max(min, Math.min(max, parseInt(e.target.value) || min));
          onQuantityChange(val);
        }}
        aria-label="Quantity"
        className="w-12 text-center border-0 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        min={min}
        max={max}
      />

      {/* Increment button */}
      <motion.button
        whileTap={{ scale: 1.05 }}
        onClick={handleIncrement}
        disabled={!canIncrement}
        aria-label={`Increase quantity. Current quantity is ${quantity}`}
        className={`px-3 py-2 text-sm font-medium transition-opacity ${
          !canIncrement ? 'opacity-40 cursor-not-allowed' : 'hover:bg-secondary'
        }`}
      >
        +
      </motion.button>
    </div>
  );
}
```

**Cart Drawer Entrance**

- **Slide from right:** 300ms cubic-bezier(0.4, 0, 0.2, 1) (standard material-ui easing)
- **Backdrop fade-in:** 200ms, opacity 0 → 0.5
- **Stagger child items:** 50ms between each line item
- **Content layout shift:** Use `layout` prop in Framer Motion to smooth height changes

**Implementation pattern:**

```tsx
import { AnimatePresence, motion } from 'framer-motion';

export function CartDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-lg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Cart contents staggered */}
            <motion.div
              className="space-y-3 p-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {/* Individual line items */}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Implementation Priority: P0**
Free shipping bar + quantity stepper are conversion drivers. Smooth animations signal polish and professionalism.

---

## Product Card Hover States

### Desktop Hover Patterns

Modern e-commerce sites reveal information on hover without cluttering the initial view. For SnusFriend (nicotine pouches), the key hover reveal should be:

1. **Primary action:** Quick-add button (or "View Details")
2. **Secondary info:** Strength/flavor, nicotine content label, ratings
3. **Image interaction:** Secondary product image appears (e.g., back of pouch, opened pouch)

**Hover Animation Strategy:**

- **Image swap:** Cross-fade (200ms) from primary to secondary image
- **Overlay slide:** Action buttons slide up from bottom (250ms, ease-out)
- **Background shift:** Subtle scale (1 → 1.02) or slight shadow increase
- **Text reveal:** Strength/flavor badges fade in (150ms opacity)

**Implementation:**

```tsx
// ProductCard.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  imageHover: string;
  strength: string;
  rating: number;
  onQuickAdd: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  imageHover,
  strength,
  rating,
  onQuickAdd,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image container */}
      <div className="relative h-64 bg-secondary overflow-hidden">
        {/* Primary image */}
        <motion.img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Hover image (secondary) */}
        <motion.img
          src={imageHover}
          alt={`${name} detail`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Action buttons overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end gap-2 p-3 bg-gradient-to-t from-black/40 to-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          pointerEvents={isHovered ? 'auto' : 'none'}
        >
          <button
            onClick={() => onQuickAdd(id)}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
            aria-label={`Quick add ${name} to cart`}
          >
            Quick Add
          </button>
          <a
            href={`/product/${id}`}
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium text-sm text-center hover:bg-secondary/80 transition-colors"
          >
            View Details
          </a>
        </motion.div>
      </div>

      {/* Product info */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm truncate">{name}</h3>

        {/* Strength badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.6 }}
          transition={{ duration: 0.15 }}
          className="inline-block px-2 py-1 bg-secondary rounded text-xs font-medium text-muted-foreground"
        >
          {strength}
        </motion.div>

        {/* Price and rating */}
        <div className="flex justify-between items-center pt-1 border-t border-border">
          <span className="font-bold text-sm">${(price / 100).toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">⭐ {rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  );
}
```

**Color Preview Variant** (for e.g., flavor variants visible in image):

If products have visible color or flavor variants, show them as discrete image thumbnails on hover:

```tsx
{isHovered && (
  <motion.div
    className="absolute bottom-2 left-2 flex gap-1"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, delay: 0.1 }}
  >
    {variants.map((variant) => (
      <button
        key={variant.id}
        className="w-6 h-6 rounded-full border-2 border-white hover:border-primary transition-colors"
        style={{ backgroundColor: variant.color }}
        aria-label={`${variant.name} flavor`}
      />
    ))}
  </motion.div>
)}
```

**Mobile Handling:**

On mobile (no hover), reveal actions on tap. Use a long-press handler or dedicated "Add to Cart" button below the image.

**Implementation Priority: P0**
Core to conversion. Quick-add on hover is table stakes for modern e-commerce.

---

## Variant/Strength Selector Patterns

### Button Group (Recommended for SnusFriend)

Nicotine pouches typically have **1–3 variants** (strength/flavor), making a button group ideal:

**Design principles:**
- Use toggle buttons, not dropdowns (buttons are faster for 2–4 options)
- Disabled states show which combos are out of stock
- Clear visual distinction between selected and unselected
- Keyboard navigation: Tab to move between buttons, Space/Enter to toggle

**Tailwind + shadcn/ui pattern:**

```tsx
// StrengthSelector.tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface VariantOption {
  id: string;
  label: string;
  value: string;
  inStock: boolean;
}

interface StrengthSelectorProps {
  variants: VariantOption[];
  selected: string | null;
  onChange: (variantId: string) => void;
  label?: string;
}

export function StrengthSelector({
  variants,
  selected,
  onChange,
  label = 'Choose Strength',
}: StrengthSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <motion.div key={variant.id} whileTap={{ scale: 0.98 }}>
            <Button
              variant={selected === variant.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (variant.inStock) onChange(variant.id);
              }}
              disabled={!variant.inStock}
              aria-pressed={selected === variant.id}
              aria-label={`${variant.label}${!variant.inStock ? ' - Out of stock' : ''}`}
              className={`transition-all ${
                selected === variant.id ? 'ring-2 ring-offset-2 ring-primary' : ''
              } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {variant.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Stock warning */}
      {selected && !variants.find((v) => v.id === selected)?.inStock && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-destructive font-medium"
        >
          This variant is out of stock.
        </motion.p>
      )}
    </fieldset>
  );
}
```

**Accessibility (WCAG AA):**

- Use `role="group"` or `<fieldset>` to group buttons
- Label with `<legend>` or `aria-label`
- Each button: `aria-pressed="true|false"`, `aria-label` with variant name
- Disabled buttons: `disabled` attribute + `aria-label` mentioning "out of stock"
- Keyboard: Tab to move between options, Space/Enter to select

### Dropdown (Secondary Option)

If 5+ variants exist, dropdown is acceptable but slower:

```tsx
<select
  value={selected}
  onChange={(e) => onChange(e.target.value)}
  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
  aria-label={label}
>
  <option value="">Select {label}</option>
  {variants.map((v) => (
    <option key={v.id} value={v.id} disabled={!v.inStock}>
      {v.label} {!v.inStock ? '(Out of Stock)' : ''}
    </option>
  ))}
</select>
```

**Implementation Priority: P0**
Variant selection is the moment of truth. Clear, quick selection directly impacts conversion.

---

## Mobile-First E-Commerce Patterns

### Sticky Add-to-Cart Button

**Key stats:**
- 60%+ of e-commerce traffic is mobile
- Sticky ATC buttons improve conversion by 8–15% on mobile
- Must be anchored at bottom (thumb zone) on mobile, hidden on desktop
- Minimum 56px height on mobile for comfortable tapping

**Implementation:**

```tsx
// StickyAddToCartBar.tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

interface StickyAddToCartBarProps {
  productId: string;
  productName: string;
  isOutOfStock: boolean;
  selectedVariant?: string;
  selectedQuantity?: number;
  onAddToCart: () => void;
}

export function StickyAddToCartBar({
  productName,
  isOutOfStock,
  selectedVariant,
  selectedQuantity = 1,
  onAddToCart,
}: StickyAddToCartBarProps) {
  return (
    <>
      {/* Mobile only (md: hidden) */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-border p-3 shadow-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex gap-2 items-center">
          <div className="flex-1 text-sm">
            <p className="font-semibold">{productName}</p>
            {selectedVariant && (
              <p className="text-xs text-muted-foreground">{selectedVariant}</p>
            )}
          </div>
          <Button
            size="lg"
            onClick={onAddToCart}
            disabled={isOutOfStock || !selectedVariant}
            className="w-auto px-6"
            aria-label={`Add ${selectedQuantity} ${productName} to cart`}
          >
            Add ({selectedQuantity})
          </Button>
        </div>
      </motion.div>

      {/* Spacer to prevent content from hiding behind sticky bar */}
      <div className="h-20 md:h-0" />
    </>
  );
}
```

### Bottom-Sheet Filters (Mobile)

For product collection pages on mobile, bottom-sheet filters are standard:

```tsx
// MobileFilterSheet.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { SheetContent, SheetTitle } from '@/components/ui/sheet';

export function MobileFilterSheet({ open, onClose, filters, onFilterChange }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet content (bottom-aligned) */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-lg shadow-lg max-h-[90vh] overflow-y-auto z-50"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <SheetTitle className="sr-only">Filter products</SheetTitle>
            <div className="p-4 space-y-6">
              {/* Filter sections */}
              {/* Apply/Clear buttons at bottom */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-input rounded-md hover:bg-secondary"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Mobile Touch Targets:**
- Minimum 44×44px (48×48px preferred)
- Generous padding around buttons (8px minimum)
- Avoid placing critical buttons near edges where fat-finger errors occur

**Implementation Priority: P1**
Essential for mobile UX, but can be implemented incrementally after core cart functionality is solid.

---

## Loading & Skeleton States

### Skeleton Screens (Recommended)

Skeleton screens signal professionalism and reduce perceived load time. Premium DTC sites (Netflix, DoorDash) use them extensively.

**Best practice:**
- Match the layout of the real content (e.g., skeleton product cards match real card height/width)
- Subtle shimmer effect (left-to-right gradient) every 1.5–2 seconds
- No jarring flashing; use soft pulsing or gentle shimmer
- Skeleton screens should disappear as real content loads

**Implementation with React:**

```tsx
// ProductGridSkeleton.tsx
import { motion } from 'framer-motion';

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <motion.div
      className="rounded-lg overflow-hidden border border-border"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Image skeleton */}
      <div className="h-64 bg-muted shimmer" />

      {/* Text skeletons */}
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex justify-between pt-2">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    </motion.div>
  );
}
```

**Shimmer CSS (Tailwind):**

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 0%,
    hsl(var(--muted-foreground)) 50%,
    hsl(var(--muted)) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

**Alternative: Pulsing (Simpler)**

```tsx
animate={{ opacity: [0.4, 1, 0.4] }}
transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
```

### Cart Loading State

When cart is updating (adding item, removing item, applying coupon):

```tsx
export function CartDrawer({ loading, items }) {
  return (
    <motion.div className="space-y-3">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/50 flex items-center justify-center rounded"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items */}
      {items.map((item) => (
        <CartLineItem key={item.id} item={item} />
      ))}
    </motion.div>
  );
}
```

**Implementation Priority: P1**
Skeleton screens improve perceived performance; should be added once product grid and cart are live.

---

## Accessibility in E-Commerce

### Color Contrast (WCAG AA)

**Standards:**
- **Text:** 4.5:1 ratio (normal weight), 3:1 (18pt+/bold)
- **UI components:** 3:1 ratio (borders, buttons, form controls)
- **Badges/labels:** Rely on text contrast + adjacent borders, not color alone

**SnusFriend audit points:**
- Strength badges: Text on background must be 4.5:1 (currently likely failing on dark backgrounds)
- "Out of stock" labels: Don't rely on red color alone; add icon or text
- Price vs. background: 4.5:1
- Navigation links: 4.5:1 against background

**Testing tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Colors](https://accessible-colors.com/)
- Browser DevTools accessibility audit

### Screen Reader Patterns for Product Grids

```tsx
<div role="list" className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {products.map((product) => (
    <div key={product.id} role="listitem">
      <article>
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <img src={product.image} alt={`${product.name}, ${product.strength} strength`} />

        {/* Strength/flavor as label, not visual-only */}
        <span className="inline-block px-2 py-1 bg-secondary rounded text-sm">
          {product.strength} strength
        </span>

        <p aria-label={`Rating: ${product.rating} out of 5 stars`}>
          ⭐ {product.rating}
        </p>

        <p className="font-bold">${(product.price / 100).toFixed(2)}</p>

        <button
          onClick={() => onQuickAdd(product.id)}
          aria-label={`Quick add ${product.name}, ${product.strength} strength, ${(product.price / 100).toFixed(2)} dollars, to cart`}
        >
          Quick Add
        </button>
      </article>
    </div>
  ))}
</div>
```

### Keyboard Navigation for Variant Selectors

All variant selectors must support:
- **Tab:** Move to next button
- **Shift+Tab:** Move to previous button
- **Space/Enter:** Toggle selection
- **Arrow keys:** Optional but helpful for radio-style groups

```tsx
// Variant button group with keyboard support
<fieldset
  role="group"
  aria-labelledby="strength-label"
  onKeyDown={(e) => {
    const buttons = Array.from(
      e.currentTarget.querySelectorAll('button')
    );
    const currentIndex = buttons.indexOf(document.activeElement as any);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextButton = buttons[(currentIndex + 1) % buttons.length];
      (nextButton as HTMLButtonElement).focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevButton = buttons[(currentIndex - 1 + buttons.length) % buttons.length];
      (prevButton as HTMLButtonElement).focus();
    }
  }}
>
  <legend id="strength-label" className="font-semibold">
    Choose Strength
  </legend>
  {/* Buttons */}
</fieldset>
```

### Focus Management

- **Outline on focus:** Use `outline-2 outline-offset-2 outline-primary` (do NOT remove outline)
- **Visible focus ring:** High contrast (at least 3:1 against background)
- **Modal dialogs:** Trap focus inside (cart drawer, filters) using `dialog` element or `role="dialog"`

**Skip navigation link (bonus):**

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Disability Stats

- 71% of users with disabilities abandon inaccessible sites immediately
- 15% of world population has some form of disability
- **Business case:** Accessibility = better UX for everyone (mobile, slow internet, noisy environments, etc.)

**Implementation Priority: P0**
Legal liability + moral imperative. Audit and fix contrast issues immediately. Keyboard navigation should be in place before launch.

---

## Implementation Roadmap

### Phase 1 (Immediate, P0 — Weeks 1–2)

- [ ] **Contrast audit:** Run lighthouse accessibility audit; fix all text/UI components to 4.5:1 (text) / 3:1 (UI)
- [ ] **Quantity stepper:** Implement with proper disabled states and `aria-label`
- [ ] **Strength selector:** Replace dropdown with button group; add disabled states and keyboard support
- [ ] **Free shipping bar:** Add to cart drawer with progress animation
- [ ] **Mobile sticky ATC:** Add sticky button at bottom on mobile devices

**Testing:**
- Lighthouse (SEO, Accessibility scores)
- Manual keyboard navigation (Tab, Enter, Space, Arrow keys)
- Screen reader (NVDA on Windows, VoiceOver on macOS)

### Phase 2 (Essential, P1 — Weeks 3–4)

- [ ] **Product card hover:** Image swap + quick-add reveal on desktop
- [ ] **Skeleton screens:** Add shimmer loading states for product grid and cart
- [ ] **Mobile bottom-sheet filters:** Implement filter sheet for collection pages
- [ ] **Cart drawer entrance animation:** Smooth slide-in with staggered line items
- [ ] **Accessibility keyboard support:** Ensure all variant selectors support arrow keys

**Testing:**
- Visual regression (Playwright snapshots)
- Mobile device testing (iOS Safari, Chrome Android)
- Animation performance (60fps target)

### Phase 3 (Polish, P2 — Weeks 5+)

- [ ] **Gesture support:** Swipe to close cart drawer (React Gesture Handler or Framer Motion drag)
- [ ] **Success animations:** Confetti or celebration when free shipping goal is hit
- [ ] **Error animations:** Shake animation for invalid form fields
- [ ] **Scroll animations:** Fade-in product cards as they enter viewport
- [ ] **Dark mode:** Ensure all micro-interactions work in light/dark modes

---

## Code Examples & Snippets

### Tailwind Classes for Animations

```tailwind
/* Timing */
duration-200 (200ms — default micro-interaction)
duration-300 (300ms — drawer/modal entrance)
duration-500 (500ms — page transitions)

/* Easing */
ease-out (entrance animations)
ease-in (exit animations)
ease-in-out (combined)

/* Common patterns */
hover:shadow-lg
hover:scale-105
focus:outline-offset-2 focus:outline-primary
transition-all duration-300 ease-out
```

### Framer Motion Patterns

```tsx
// Staggered children
variants={{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}}

// Spring physics (natural feel)
transition={{ type: 'spring', damping: 25, stiffness: 300 }}

// Tap feedback
whileTap={{ scale: 0.98 }}

// Hover reveal
animate={{ opacity: isHovered ? 1 : 0 }}

// Layout animation (height changes)
layout
```

### SVG Animation Example

```tsx
// Animated checkmark for "added to cart"
export function SuccessCheckmark() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-6 h-6 text-green-500"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, type: 'spring' }}
    >
      <motion.path
        d="M20 6L9 17l-5-5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
    </motion.svg>
  );
}
```

---

## Key Takeaways

1. **Timing is critical:** 200–500ms for all micro-interactions. Anything slower feels broken; anything faster feels jarring.
2. **Purpose over flash:** Every animation must guide, confirm, or provide feedback. Gratuitous motion reduces trust.
3. **SVG > video:** Use SVG for animations and illustrations; it's accessible, performant, and responsive.
4. **Mobile primacy:** 60%+ of traffic is mobile. Sticky ATC, bottom-sheet filters, and large touch targets are table stakes.
5. **Accessibility is business:** 71% of users with disabilities abandon inaccessible sites. WCAG AA (4.5:1 text, 3:1 UI) is legally critical.
6. **Perceived performance matters:** Skeleton screens reduce cognitive load even if total load time is unchanged.
7. **Free shipping bar converts:** 7.9–20% AOV lift. Essential for $30–$100 price points.
8. **Variant selection is the moment of truth:** Button groups (not dropdowns) for 2–4 variants. Clear disabled states for out-of-stock combos.

---

## References & Reading List

### Design Systems & Research
- [Baymard Institute E-Commerce Usability Research](https://baymard.com/research/checkout-usability)
- [Nielsen Norman Group: Bottom Sheets](https://www.nngroup.com/articles/bottom-sheet/)
- [Nielsen Norman Group: Input Steppers](https://www.nngroup.com/articles/input-steppers/)
- [Nielsen Norman Group: Design Guidelines for Multiple Variants](https://www.nngroup.com/articles/products-with-multiple-variants/)

### Animation & Micro-Interactions
- [Primotech: UI/UX Evolution 2026: Micro-Interactions & Motion](https://primotech.com/ui-ux-evolution-2026-why-micro-interactions-and-motion-matter-more-than-ever/)
- [Motion/Framer Motion Docs](https://motion.dev/)
- [LogRocket: Creating React Animations with Motion](https://blog.logrocket.com/creating-react-animations-with-motion/)

### Accessibility
- [WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/)
- [WCAG 2.1 Guidelines (W3C)](https://www.w3.org/TR/WCAG21/)
- [AllAccessible: E-Commerce Accessibility 2025 Guide](https://www.allaccessible.org/blog/ecommerce-accessibility-complete-guide-wcag)

### Loading & Perceived Performance
- [Nielsen Norman Group: Skeleton Screens](https://www.nngroup.com/articles/skeleton-screens/)
- [Clay: Skeleton Screens Explained](https://clay.global/blog/skeleton-screen)

### Mobile UX
- [Depict AI: Mobile-First Collection Design](https://depict.ai/magazine/mobile-first-collection-design-optimizing-the-small-screen-shopping-experience)
- [TheGood: Sticky Add to Cart Button Best Practices](https://thegood.com/insights/sticky-add-to-cart/)

### DTC Brand Analysis
- [Practical E-Commerce: Cross-Sell Tactics of Top DTC Brands](https://www.practicalecommerce.com/cross-sell-tactics-of-top-dtc-brands)

---

**Document Version:** 1.0
**Last Updated:** 2026-03-27
**Next Review:** After implementation of Phase 1 & 2
