# Mobile Navigation Improvements

## 1. Bottom Navigation Bar

### Recommendation: YES — Add it

Competitor Haypp uses a sticky bottom nav (Shop, Search, Cart, Account). This is the standard mobile e-commerce pattern. SnusFriend currently relies on the header for all navigation, which means cart and search require reaching to the top of the screen.

### Spec

```
┌──────────────────────────────────────┐
│  🏪        🔍        🛒        👤   │
│  Shop     Search     Cart    Account │
│                      (badge)         │
└──────────────────────────────────────┘
  Height: 56px + safe-area-inset-bottom
  Background: bg-card border-t border-border
  Active item: text-primary
  Inactive: text-muted-foreground
  z-index: 30 (below sticky ATC at 40)
```

### React Island Component

```tsx
// src/components/react/MobileBottomNav.tsx
import { useStore } from '@nanostores/react';
import { cartItems } from '@/stores/cart';

const navItems = [
  { href: '/products', label: 'Shop', icon: 'store' },
  { href: '/search', label: 'Search', icon: 'search' },
  { href: '/cart', label: 'Cart', icon: 'cart', showBadge: true },
  { href: '/account', label: 'Account', icon: 'user' },
];

export default function MobileBottomNav() {
  const items = useStore(cartItems);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Detect current path for active state
  const path = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-30 md:hidden
        flex items-center justify-around
        border-t border-border bg-card/95 backdrop-blur-sm
      "
      style={{
        height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Mobile navigation"
    >
      {navItems.map((item) => {
        const isActive = path.startsWith(item.href);
        return (
          <a
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center justify-center gap-0.5
              min-w-[64px] min-h-[44px] px-2 py-1
              text-xs font-medium transition-colors
              ${isActive ? 'text-primary' : 'text-muted-foreground'}
            `}
          >
            <div className="relative">
              <NavIcon name={item.icon} className="h-5 w-5" />
              {item.showBadge && cartCount > 0 && (
                <span className="
                  absolute -top-1.5 -right-2.5
                  flex h-4 min-w-4 items-center justify-center
                  rounded-full bg-primary px-1
                  text-[10px] font-bold text-primary-foreground
                ">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function NavIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    store: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    search: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    cart: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
    user: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };
  return icons[name] || null;
}
```

### Integration

Add to `src/layouts/Shop.astro`:

```astro
import MobileBottomNav from '@/components/react/MobileBottomNav';

<!-- At end of body, before closing tags -->
<MobileBottomNav client:idle />
```

### Spacing Consideration

When bottom nav is present, add padding to page body so content doesn't get hidden behind it:

```css
@media (max-width: 767px) {
  body { padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px)); }
}
```

Also: when the Sticky Add-to-Cart bar is visible on PDP, it should sit ABOVE the bottom nav (z-40 vs z-30). Total bottom space: 56px (nav) + 64px (ATC bar) = 120px — consider hiding the bottom nav when the ATC bar is visible to avoid double-stacking.

---

## 2. Breadcrumb Truncation

### Current State
Breadcrumbs on deep pages like `/brands/zyn` show "Home / Brands / ZYN" which fits at 390px. But deeper pages like `/products/flavor/coolMint` or `/brands/zyn/flavours` could overflow.

### Fix

```css
/* In breadcrumb component or global styles */
nav[aria-label="breadcrumb"] {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
}
nav[aria-label="breadcrumb"]::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
```

This makes breadcrumbs horizontally scrollable without visible scrollbar on mobile. Alternative: truncate intermediate items with "..." on small screens (e.g., "Home / ... / ZYN Flavours").

### Astro Component Update

In `src/components/astro/Breadcrumb.astro`, add `overflow-x-auto whitespace-nowrap scrollbar-hide` to the nav element.

---

## 3. Search Accessibility

### Current State
Search icon is in the header at top-right — it's a magnifying glass SVG. In the previous session, `p-3 -m-1` padding was added for a 44px touch target.

### Assessment
- Touch target: PASS (44px with padding fix)
- Discoverability: MEDIUM — icon is small and grouped with cart + hamburger
- Mobile pattern: Users expect search to be prominent. A search bar in the hero or a bottom-nav Search tab would improve discoverability

### Recommendation
The bottom navigation bar (Section 1 above) adds a dedicated "Search" tab, which significantly improves search discoverability on mobile. No additional changes needed beyond implementing the bottom nav.

---

## Implementation Priority

| Change | Effort | Impact | Priority |
|--------|--------|--------|----------|
| Bottom navigation bar | Medium (new React island) | High — standard e-commerce pattern | P1 |
| Sticky Add-to-Cart | Medium (new React island) | High — reduces lost conversions | P1 |
| Breadcrumb truncation | Low (CSS only) | Low — edge case | P3 |
| Search tab (via bottom nav) | Included in bottom nav | Medium | P1 |

**Recommended order:** Bottom nav first (benefits every page), then Sticky ATC (benefits PDP specifically).
