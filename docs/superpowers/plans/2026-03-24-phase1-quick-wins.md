# Phase 1: Quick Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Recently Viewed, Wishlist, Stock Count, and Dark/Light Mode toggle — all frontend-only, no backend changes.

**Architecture:** All 4 features use localStorage for persistence (matching CartContext pattern). No new Supabase tables or edge functions. RecentlyViewed introduces a new horizontal-scroll component pattern; Wishlist adds a new context provider alongside CartProvider.

**Tech Stack:** React, TypeScript, Tailwind, Lucide icons, next-themes, localStorage

**Spec:** `docs/superpowers/specs/2026-03-24-phase1-quick-wins-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/hooks/useRecentlyViewed.ts` | localStorage hook for viewed product IDs |
| Create | `src/components/product/RecentlyViewed.tsx` | Horizontal scroll row of recently viewed products |
| Create | `src/context/WishlistContext.tsx` | Wishlist state provider + localStorage persistence |
| Create | `src/pages/WishlistPage.tsx` | Grid page showing wishlisted products |
| Modify | `src/App.tsx` | Add WishlistProvider, /wishlist route, update theme config |
| Modify | `src/components/product/ProductCard.tsx` | Heart icon overlay + stock count text |
| Modify | `src/components/layout/UtilityBar.tsx` | Theme toggle + wishlist icon |
| Modify | `src/components/layout/Header.tsx` | Wishlist heart icon with count badge (mobile + desktop) |
| Modify | `src/pages/ProductDetail.tsx` | Track recently viewed + render RecentlyViewed + stock count |
| Modify | `src/pages/HomePage.tsx` | Render RecentlyViewed section |
| Delete | `src/components/layout/ThemeToggle.tsx` | Dead code — unused dropdown toggle (replaced by inline toggle) |

**Note:** An existing `ThemeToggle.tsx` exists but is imported nowhere — it's dead code. We delete it and use a simpler inline sun/moon toggle in UtilityBar instead.

---

### Task 1: useRecentlyViewed Hook

**Files:**
- Create: `src/hooks/useRecentlyViewed.ts`

- [ ] **Step 1: Create the hook**

```typescript
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'snusfriend_recently_viewed';
const MAX_ITEMS = 12;

function loadFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Corrupted data — start fresh
  }
  return [];
}

function saveToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // QuotaExceededError — silently ignore
  }
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(() => loadFromStorage());

  const add = useCallback((productId: string) => {
    setIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, MAX_ITEMS);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    saveToStorage([]);
  }, []);

  return { ids, add, clear };
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `bunx tsc --noEmit --pretty 2>&1 | grep useRecentlyViewed || echo "clean"`

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useRecentlyViewed.ts
git commit -m "feat: useRecentlyViewed localStorage hook"
```

---

### Task 2: RecentlyViewed Component

**Files:**
- Create: `src/components/product/RecentlyViewed.tsx`

- [ ] **Step 1: Create the horizontal scroll component**

```typescript
import React from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/product/ProductCard';

interface RecentlyViewedProps {
  excludeId?: string;
}

export const RecentlyViewed = React.memo(function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const { ids } = useRecentlyViewed();
  const { data: products = [] } = useCatalogProducts();

  const filteredIds = excludeId ? ids.filter((id) => id !== excludeId) : ids;
  if (filteredIds.length === 0) return null;

  // Preserve order from ids (newest first) and filter to loaded products
  const recentProducts = filteredIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-xl font-bold text-foreground tracking-tight mb-6">Recently Viewed</h2>
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
          {recentProducts.map((product) => (
            <div key={product!.id} className="flex-shrink-0 w-[200px] snap-start">
              <ProductCard product={product!} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/product/RecentlyViewed.tsx
git commit -m "feat: RecentlyViewed horizontal scroll component"
```

---

### Task 3: Integrate Recently Viewed into Pages

**Files:**
- Modify: `src/pages/ProductDetail.tsx` — add `useRecentlyViewed().add()` on mount + render component
- Modify: `src/pages/HomePage.tsx` — render `<RecentlyViewed />` after New Arrivals

- [ ] **Step 1: Add to ProductDetail.tsx**

At top of file, add import:
```typescript
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
```

**IMPORTANT: Rules of Hooks** — place the hook call at the TOP of the component, BEFORE any early returns (`isLoading`, `isError`, `!product`). Only the useEffect body guards on `product?.id`:

```typescript
// At top of component, before early returns:
const { add: addRecentlyViewed } = useRecentlyViewed();

// After other useEffect calls:
useEffect(() => {
  if (product?.id) addRecentlyViewed(product.id);
}, [product?.id, addRecentlyViewed]);
```

Before the closing `</Layout>`, add the render call:
```tsx
<RecentlyViewed excludeId={product?.id} />
```

- [ ] **Step 2: Add to HomePage.tsx**

Import at top:
```typescript
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
```

After the New Arrivals `<FeaturedProducts>` section, add:
```tsx
<RecentlyViewed />
```

- [ ] **Step 3: Build and verify**

Run: `bun run build`
Expected: Success, zero errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/ProductDetail.tsx src/pages/HomePage.tsx
git commit -m "feat: integrate RecentlyViewed into PDP and homepage"
```

---

### Task 4: WishlistContext

**Files:**
- Create: `src/context/WishlistContext.tsx`

- [ ] **Step 1: Create the context provider**

Follow CartContext pattern exactly (lazy initializer + try/catch):

```typescript
import React, { createContext, useContext, useState, useCallback } from 'react';

interface WishlistContextValue {
  ids: string[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const STORAGE_KEY = 'snusfriend_wishlist';

function loadFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Corrupted data — start fresh
  }
  return [];
}

function saveToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // QuotaExceededError — silently ignore
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => loadFromStorage());

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggle = useCallback((productId: string) => {
    setIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      saveToStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    saveToStorage([]);
  }, []);

  return (
    <WishlistContext.Provider value={{ ids, count: ids.length, has, toggle, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
```

- [ ] **Step 2: Wire into App.tsx**

Import at top of `src/App.tsx`:
```typescript
import { WishlistProvider } from "@/context/WishlistContext";
```

Wrap as sibling of CartProvider (inside `<CartProvider>`, around `<CookieConsentProvider>`):
```tsx
<CartProvider>
  <WishlistProvider>
    <CookieConsentProvider>
      ...
    </CookieConsentProvider>
  </WishlistProvider>
</CartProvider>
```

- [ ] **Step 3: Commit**

```bash
git add src/context/WishlistContext.tsx src/App.tsx
git commit -m "feat: WishlistContext with localStorage persistence"
```

---

### Task 5: Heart Icon on ProductCard

**Requires:** Task 4 (WishlistContext) must be committed first.

**Files:**
- Modify: `src/components/product/ProductCard.tsx`

- [ ] **Step 1: Add heart icon overlay**

Import at top:
```typescript
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
```

Inside the component, add:
```typescript
const { has: isWishlisted, toggle: toggleWishlist } = useWishlist();
const wishlisted = isWishlisted(product.id);
```

In the image area (the card's image container), add an overlay button:
```tsx
<button
  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all"
  aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
>
  <Heart
    className={cn(
      'h-4 w-4 transition-all',
      wishlisted ? 'fill-current text-red-500 scale-110' : 'text-muted-foreground'
    )}
  />
</button>
```

- [ ] **Step 2: Add stock count text (green only, for stock > LOW_STOCK_THRESHOLD)**

Use the existing `LOW_STOCK_THRESHOLD` constant already declared at line 13 of ProductCard.tsx (`const LOW_STOCK_THRESHOLD = 20`). Do NOT redeclare it.

Below the price display area, add:
```tsx
{typeof product.stock === 'number' && product.stock > LOW_STOCK_THRESHOLD && (
  <p className="text-xs text-emerald-400 mt-1">{product.stock} in stock</p>
)}
```

Do NOT add anything for low stock (existing amber badge) or out of stock (existing OOS handling).

- [ ] **Step 3: Build and verify**

Run: `bun run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/product/ProductCard.tsx
git commit -m "feat: wishlist heart icon + stock count on ProductCard"
```

---

### Task 6: WishlistPage + Route

**Requires:** Task 4 (WishlistContext) must be committed first.

**Files:**
- Create: `src/pages/WishlistPage.tsx`
- Modify: `src/App.tsx` — add route

- [ ] **Step 1: Create WishlistPage**

```typescript
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { ProductCard } from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { data: products = [], isLoading } = useCatalogProducts();

  const wishlisted = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <Layout>
      <SEO
        title="Wishlist | SnusFriend"
        description="Your saved nicotine pouches."
        metaRobots="noindex,follow"
      />
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Wishlist</h1>

        {wishlisted.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No saved products yet</h2>
            <p className="text-muted-foreground mb-6">
              Browse our collection and tap the heart icon to save products here.
            </p>
            <Button asChild>
              <Link to="/nicotine-pouches">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlisted.map((product) => (
              <ProductCard key={product!.id} product={product!} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
```

- [ ] **Step 2: Add route in App.tsx**

After the `/rewards` route, add:
```tsx
<Route path="/wishlist" element={<WishlistPage />} />
```

Import at top:
```typescript
import WishlistPage from "./pages/WishlistPage";
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/WishlistPage.tsx src/App.tsx
git commit -m "feat: WishlistPage with empty state + route"
```

---

### Task 7: Wishlist Icon in Header

**Files:**
- Modify: `src/components/layout/UtilityBar.tsx`

- [ ] **Step 1: Add wishlist link with badge**

Import:
```typescript
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
```

Inside the component:
```typescript
const { count: wishlistCount } = useWishlist();
```

Add before the "Log in" button (line 46), a new button:
```tsx
<Button variant="ghost" size="sm" className="h-9 gap-1 text-[11px] px-2.5 text-muted-foreground hover:text-primary relative" asChild>
  <Link to="/wishlist">
    <Heart className="h-3.5 w-3.5" />
    {wishlistCount > 0 && (
      <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-[14px] rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center px-0.5">
        {wishlistCount}
      </span>
    )}
  </Link>
</Button>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/UtilityBar.tsx
git commit -m "feat: wishlist heart icon with count badge in utility bar"
```

---

### Task 8: Dark/Light Mode Toggle

**Files:**
- Modify: `src/App.tsx` — update ThemeProvider themes
- Modify: `src/components/layout/UtilityBar.tsx` — add sun/moon toggle
- Delete: `src/components/layout/ThemeToggle.tsx` — dead code, not imported anywhere

- [ ] **Step 1: Update ThemeProvider in App.tsx**

Change (around line 80-82):
```tsx
themes={['velo']}
```
to:
```tsx
themes={['velo', 'light']}
```

- [ ] **Step 2: Add theme toggle to UtilityBar.tsx**

Import:
```typescript
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
```

Inside the component:
```typescript
const { theme, setTheme } = useTheme();
const isDark = theme === 'velo' || !theme;
```

Add before the wishlist button:
```tsx
<Button
  variant="ghost"
  size="sm"
  className="h-9 w-9 p-0 text-muted-foreground hover:text-primary"
  onClick={() => setTheme(isDark ? 'light' : 'velo')}
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
</Button>
```

- [ ] **Step 3: Delete dead ThemeToggle.tsx**

```bash
rm src/components/layout/ThemeToggle.tsx
```

This file is not imported anywhere — it's an unused dropdown toggle with 4 theme options. The new inline sun/moon toggle replaces it.

- [ ] **Step 4: Build and verify**

Run: `bun run build`
Expected: Success

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/layout/UtilityBar.tsx
git rm src/components/layout/ThemeToggle.tsx
git commit -m "feat: dark/light mode toggle in utility bar, remove unused ThemeToggle"
```

---

### Task 9: Stock Count on ProductDetail

**Files:**
- Modify: `src/pages/ProductDetail.tsx`

- [ ] **Step 1: Add stock count near Add to Cart button**

Find the Add to Cart button area. Add above or next to it:
```tsx
{typeof product.stock === 'number' && product.stock > 0 && (
  <p className={cn(
    'text-sm font-medium',
    product.stock > 20 ? 'text-emerald-400' : 'text-amber-400'
  )}>
    {product.stock > 20 ? `${product.stock} in stock` : `Only ${product.stock} left`}
  </p>
)}
```

The existing out-of-stock handling (disabled button + "Out of Stock" text) stays unchanged.

- [ ] **Step 2: Build and verify**

Run: `bun run build`

- [ ] **Step 3: Commit**

```bash
git add src/pages/ProductDetail.tsx
git commit -m "feat: stock count indicator on product detail page"
```

---

### Task 10: Final Verification + Push

- [ ] **Step 1: Full build**

Run: `bun run build`
Expected: Success, zero errors

- [ ] **Step 2: Visual verification**

Start dev server and check:
- Homepage: Recently Viewed section appears after visiting products
- ProductCard: heart icon works, stock count shows
- /wishlist: saved products appear in grid
- Utility bar: theme toggle + wishlist icon with badge
- Light mode: all pages render correctly
- Dark mode: unchanged from current

- [ ] **Step 3: Push to GitHub**

```bash
git push
```

Vercel auto-deploys. Check deployment status via MCP.
