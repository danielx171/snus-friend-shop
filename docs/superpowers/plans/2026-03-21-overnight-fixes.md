# Plan: Overnight Scan Fixes (2026-03-21)

Generated from Lighthouse audits (3 pages) + Supabase security/performance advisors.

## Summary

| Category | Issues | Priority |
|----------|--------|----------|
| Supabase Security | 4 | CRITICAL (RLS) + WARN |
| Accessibility (a11y) | 7 distinct issues | HIGH |
| Performance (DB) | Duplicate RLS policies on 7 tables | MEDIUM |

---

## Task 1: Enable RLS on sync_config (CRITICAL)

**Why:** `sync_config` table is publicly exposed via PostgREST with no RLS. Anyone can read/write it.

**What:**
- Create migration `supabase/migrations/YYYYMMDD_sync_config_rls.sql`
- `ALTER TABLE public.sync_config ENABLE ROW LEVEL SECURITY;`
- Add policy: only service_role can read/write (no public access needed — only edge functions use it)

```sql
ALTER TABLE public.sync_config ENABLE ROW LEVEL SECURITY;
-- No public policies — only service_role (edge functions) needs access
```

**Acceptance:** Supabase security advisor no longer flags `sync_config`.

---

## Task 2: Fix function search_path (WARN)

**Why:** `trigger_nyehandel_sync_page` and `trigger_nyehandel_sync_all` have mutable search_path, which is a potential privilege escalation vector.

**What:**
- Create migration to `ALTER FUNCTION ... SET search_path = public;` for both functions

```sql
ALTER FUNCTION public.trigger_nyehandel_sync_page SET search_path = public;
ALTER FUNCTION public.trigger_nyehandel_sync_all SET search_path = public;
```

**Acceptance:** Supabase security advisor no longer flags these functions.

---

## Task 3: Enable leaked password protection (WARN)

**Why:** Supabase Auth's HaveIBeenPwned check is disabled. Users can register with compromised passwords.

**What:**
- In Supabase Dashboard → Auth → Settings → enable "Leaked Password Protection"
- This is a dashboard toggle, not code. Document in DEPLOYMENT_CHECKLIST.md.

**Acceptance:** Supabase security advisor no longer flags this.

---

## Task 4: Fix cookie banner aria-label mismatch

**Why:** Lighthouse flags `aria-label="Accept necessary cookies only"` not matching visible text "Necessary Only".

**File:** `src/components/cookie/CookieConsent.tsx:26`

**What:** Change `aria-label="Accept necessary cookies only"` to `aria-label="Necessary Only"` to match visible text. Alternatively, remove the aria-label entirely since the button already has visible text.

**Acceptance:** Lighthouse `label-content-name-mismatch` passes.

---

## Task 5: Fix color contrast issues

**Why:** 3 elements fail WCAG AA contrast (4.5:1 minimum):
- "Offers" nav link: blue (#00328a) on dark (#001133) = 1.61 ratio
- "Snus Family" nav link: same issue
- "Explore Products" button: white on yellow (#f5e900) = 1.26 ratio

**Files:**
- `src/components/layout/MainNav.tsx:89` — links with `highlight: true` use `text-primary` class. Change to `text-accent` (yellow) or a lighter blue that passes 4.5:1 against the dark nav background.
- `src/components/home/HeroBanner.tsx` — "Explore Products" button uses `color: white` on yellow background. Change to dark text (`color: hsl(var(--background))`) on yellow.

**What:** Adjust text colors to meet 4.5:1 contrast ratio. For MainNav, replace `text-primary` with `text-accent-foreground` or explicit lighter color. For hero button, use dark text on yellow.

**Acceptance:** Lighthouse `color-contrast` passes on all pages.

---

## Task 6: Fix carousel dot touch targets

**Why:** Homepage carousel slide indicator dots are 8x8px (0.5rem). WCAG requires minimum 24x24px touch targets.

**File:** `src/components/home/HeroBanner.tsx:194-205`

**Current code:**
```
style={i === activeSlide
  ? { width: '2rem', height: '0.5rem', backgroundColor: slide.accentColor }
  : { width: '0.5rem', height: '0.5rem', backgroundColor: 'hsl(var(--border))' }
}
```

**What:** Keep visual dot size but add min `24px` padding to the button's clickable area. Use `min-w-6 min-h-6` with the visual dot as a pseudo-element or inner span, OR set `padding: 8px` on the button so total clickable area exceeds 24px.

**Acceptance:** Lighthouse `target-size` passes.

---

## Task 7: Fix buttons without accessible names

**Why:** Icon-only buttons have no `aria-label`:
1. `src/components/cart/CartDrawer.tsx:186-193` — Trash/remove button (Trash2 icon)
2. `src/components/product/ProductFilters.tsx:40-43` — Mobile filter close button (X icon)

**What:**
- CartDrawer: Add `aria-label="Remove item"` to the remove Button
- ProductFilters: Add `aria-label="Close filters"` to the close Button

**Acceptance:** Lighthouse `button-name` passes.

---

## Task 8: Fix links without discernible names

**Why:** Product card links wrapping images have no accessible text.

**Files:** Product card component (check `src/components/product/ProductCard.tsx`)

**What:** Add `aria-label={product.name}` to the wrapping `<a>` or `<Link>` element.

**Acceptance:** Lighthouse `link-name` passes.

---

## Task 9: Fix heading order

**Why:** Heading levels skip (e.g., h1 → h3 with no h2). Screen readers use headings for navigation.

**Files:**
- `src/pages/ProductListing.tsx:146` — has h1, verify subsection headings follow h2 → h3
- `src/pages/CheckoutHandoff.tsx` — check heading hierarchy

**What:** Audit heading hierarchy and fix to be sequential (h1 → h2 → h3, no skipping). Change any h3 that follows h1 directly to h2.

---

## Task 10: Consolidate duplicate RLS policies (MEDIUM)

**Why:** 7 tables have overlapping "Admin can manage X" + "Public can read X" SELECT policies for the same roles. Each query evaluates both policies unnecessarily.

**Tables:** brands, inventory, orders, product_variants, products, user_roles

**What:** Consolidate into a single SELECT policy per table that handles both admin and public access:
```sql
-- Example for products:
DROP POLICY "Admins can manage products" ON products;  -- for SELECT only
-- Keep "Public can read active products" which covers both anon + authenticated
```

Or make admin policies RESTRICTIVE instead of PERMISSIVE.

**Acceptance:** Supabase performance advisor no longer flags duplicate policies.

---

## Execution Order

1. **Task 1** (sync_config RLS) — security critical, do first
2. **Task 2** (search_path) — quick SQL migration
3. **Task 3** (leaked password) — dashboard toggle + docs
4. **Tasks 4-9** (a11y fixes) — can be parallelized with subagents
5. **Task 10** (RLS consolidation) — lower priority, do if time allows

## Notes

- Tasks 1, 2, 10 require Supabase migrations
- Task 3 is a Supabase Dashboard setting
- Tasks 4-9 are frontend code changes
- All a11y fixes should be verified by re-running Lighthouse after changes
