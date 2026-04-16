# Wave 3: Community Moat — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build defensible competitive advantages through verified reviews, earned profile titles, clean leaderboards, and reduction step-down guidance.

**Architecture:** DB migration adds `is_verified_purchase` column + trigger. UI changes in ProductReviews, LeaderboardIsland, nickname.ts, and product pages. Leaderboard gets monthly view via new Supabase view. Step-down suggestions are static Astro HTML computed at build time.

**Tech Stack:** Astro 6, React 18, Supabase PostgreSQL, TypeScript

---

## File Map

| File | Change |
|------|--------|
| Supabase migration | Add `is_verified_purchase` column + trigger to `product_reviews` |
| Supabase migration | Add `leaderboard_monthly` view |
| `src/hooks/useProductReviews.ts` | Read persisted flag instead of runtime computation |
| `src/components/product/ProductReviews.tsx` | Enhanced badge, sort verified first |
| `src/lib/nickname.ts` | Display name priority: name → tier → email → fantasy |
| `src/components/react/LeaderboardIsland.tsx` | Monthly/alltime toggle, tier titles, inactivity filter |
| `src/pages/products/[slug].astro` | Step-down suggestion for high-strength products |

---

### Task 1: DB Migration — Verified Purchase Column + Trigger

**Files:**
- Create: `supabase/migrations/20260410200000_verified_purchase_reviews.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- Add is_verified_purchase column to product_reviews
ALTER TABLE public.product_reviews 
ADD COLUMN IF NOT EXISTS is_verified_purchase BOOLEAN DEFAULT false;

-- Create function that checks if reviewer has a completed order with this product
CREATE OR REPLACE FUNCTION public.set_verified_purchase()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  has_purchase BOOLEAN := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.orders o
    WHERE o.user_id = NEW.user_id
      AND o.checkout_status IN ('confirmed', 'shipped')
      AND o.line_items_snapshot::jsonb @> ('[{"slug":"' || NEW.product_id || '"}]')::jsonb
  ) INTO has_purchase;
  
  NEW.is_verified_purchase := has_purchase;
  RETURN NEW;
END;
$$;

-- Trigger on insert
DROP TRIGGER IF EXISTS trg_set_verified_purchase ON public.product_reviews;
CREATE TRIGGER trg_set_verified_purchase
  BEFORE INSERT ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_verified_purchase();

-- Backfill existing reviews
UPDATE public.product_reviews r
SET is_verified_purchase = EXISTS(
  SELECT 1 FROM public.orders o
  WHERE o.user_id = r.user_id
    AND o.checkout_status IN ('confirmed', 'shipped')
    AND o.line_items_snapshot::jsonb @> ('[{"slug":"' || r.product_id || '"}]')::jsonb
);
```

- [ ] **Step 2: Apply via Supabase MCP**

Use `mcp__plugin_supabase_supabase__execute_sql` with project_id `bozdnoctcszbhemdjsek` to run the migration.

- [ ] **Step 3: Verify**

```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'product_reviews' AND column_name = 'is_verified_purchase';
```

- [ ] **Step 4: Commit migration file**

```bash
git add supabase/migrations/20260410200000_verified_purchase_reviews.sql
git commit -m "feat: add is_verified_purchase column + trigger to product_reviews"
```

---

### Task 2: Simplify useProductReviews — Read Persisted Flag

**Files:**
- Modify: `src/hooks/useProductReviews.ts`

- [ ] **Step 1: Remove the runtime verified buyer computation**

Read the file. Find the block that queries `orders` table to compute `verifiedBuyerIds` (around lines 132-164). Replace the entire verified buyer lookup with reading the persisted column.

Change the review query (around line 84) to include `is_verified_purchase`:

```typescript
const { data: reviewRows } = await supabase
  .from('product_reviews')
  .select('*, is_verified_purchase')
  .eq('product_id', productId)
  .eq('flagged', false)
  .order('created_at', { ascending: false });
```

Then when building the `ProductReview` objects, use the persisted flag:

```typescript
verified_buyer: row.is_verified_purchase ?? false,
```

Remove the entire `verifiedBuyerIds` computation block (the `orders` query, the `Set`, the `line_items_snapshot` parsing).

- [ ] **Step 2: Update types.ts if needed**

Check `src/integrations/supabase/types.ts` — add `is_verified_purchase` to the `product_reviews` Row type if not present.

- [ ] **Step 3: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/hooks/useProductReviews.ts src/integrations/supabase/types.ts
git commit -m "feat: read is_verified_purchase from DB instead of runtime computation"
```

---

### Task 3: Enhanced Review Badges + Sort Verified First

**Files:**
- Modify: `src/components/product/ProductReviews.tsx`

- [ ] **Step 1: Update sort order to put verified reviews first**

Find the review sorting logic. Add verified-first as the primary sort:

```typescript
const sortedReviews = [...reviews].sort((a, b) => {
  // Verified first
  if (a.verified_buyer !== b.verified_buyer) return a.verified_buyer ? -1 : 1;
  // Then by helpful count
  if ((b.helpful_count ?? 0) !== (a.helpful_count ?? 0)) return (b.helpful_count ?? 0) - (a.helpful_count ?? 0);
  // Then newest
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
});
```

- [ ] **Step 2: Enhance the badge styling**

Find the verified badge rendering (around line 280). Add a "Community Review" badge for non-verified:

```tsx
{review.verified_buyer ? (
  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-400">
    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
    Verified Buyer
  </span>
) : (
  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
    Community Review
  </span>
)}
```

- [ ] **Step 3: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/components/product/ProductReviews.tsx
git commit -m "feat: verified reviews sort first + enhanced badges"
```

---

### Task 4: Display Name Priority Chain

**Files:**
- Modify: `src/lib/nickname.ts`

- [ ] **Step 1: Read the current nickname.ts**

It currently exports `generateNickname(userId: string): string` using a deterministic hash.

- [ ] **Step 2: Add a new function for the priority chain**

Add a new exported function alongside the existing one (don't remove the old one — it's the fallback):

```typescript
/**
 * Display name priority: user-set name → tier title → email local part → fantasy nickname
 */
export function getDisplayName(opts: {
  displayName?: string | null;
  tierName?: string | null;
  email?: string | null;
  userId: string;
}): string {
  // 1. User-set display name
  if (opts.displayName?.trim()) return opts.displayName.trim();
  
  // 2. Tier title (from rewards.tiers)
  if (opts.tierName?.trim()) return opts.tierName.trim();
  
  // 3. Email local part
  if (opts.email) {
    const local = opts.email.split('@')[0];
    if (local && local.length > 1) {
      return local.charAt(0).toUpperCase() + local.slice(1);
    }
  }
  
  // 4. Fantasy nickname (existing generator)
  return generateNickname(opts.userId);
}
```

- [ ] **Step 3: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/lib/nickname.ts
git commit -m "feat: display name priority chain (name → tier → email → fantasy)"
```

---

### Task 5: Leaderboard — Monthly Toggle + Tier Titles

**Files:**
- Modify: `src/components/react/LeaderboardIsland.tsx`
- Create via Supabase: `leaderboard_monthly` view

- [ ] **Step 1: Create monthly leaderboard view via Supabase MCP**

```sql
CREATE OR REPLACE VIEW public.leaderboard_monthly AS
SELECT 
  pt.user_id,
  SUM(pt.points) AS total_points,
  up.display_name,
  a.image_url AS avatar_url
FROM public.points_transactions pt
LEFT JOIN public.user_profiles up ON up.user_id = pt.user_id
LEFT JOIN public.avatars a ON a.id = up.avatar_id
WHERE pt.created_at >= date_trunc('month', CURRENT_DATE)
  AND pt.points > 0
GROUP BY pt.user_id, up.display_name, a.image_url
ORDER BY total_points DESC
LIMIT 50;

GRANT SELECT ON public.leaderboard_monthly TO authenticated, anon;
```

- [ ] **Step 2: Add monthly/alltime toggle to LeaderboardIsland**

Read `src/components/react/LeaderboardIsland.tsx`. Add a state variable and toggle UI:

At the top of the component, add:
```typescript
const [period, setPeriod] = useState<'alltime' | 'monthly'>('alltime');
```

Before the leaderboard list, add toggle buttons:
```tsx
<div className="flex gap-2 mb-4">
  <button
    onClick={() => setPeriod('alltime')}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      period === 'alltime' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
    }`}
  >
    All Time
  </button>
  <button
    onClick={() => setPeriod('monthly')}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      period === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
    }`}
  >
    This Month
  </button>
</div>
```

In the data fetching logic, switch the view based on `period`:
```typescript
const viewName = period === 'monthly' ? 'leaderboard_monthly' : 'leaderboard_top_users';
const { data } = await supabase.from(viewName).select('*').limit(20);
```

Add `period` to the query key / dependency array so it refetches on toggle.

- [ ] **Step 3: Show tier title next to display name**

In the `LeaderboardRow` component, the `level_name` is already fetched and available. Make sure it displays as a badge next to the name:

```tsx
{entry.level_name && (
  <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
    style={{ backgroundColor: `${badgeColorHex}20`, color: badgeColorHex }}>
    {entry.level_name}
  </span>
)}
```

This should already be partially implemented — verify and enhance if needed.

- [ ] **Step 4: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/components/react/LeaderboardIsland.tsx
git commit -m "feat: leaderboard monthly/alltime toggle + tier badges"
```

---

### Task 6: PDP Step-Down Suggestions for High-Strength Products

**Files:**
- Modify: `src/pages/products/[slug].astro`

- [ ] **Step 1: Compute lower-strength alternative at build time**

In the `getStaticPaths` function, after the existing `sameFlavour` and `similarStrength` computations, add:

```typescript
// Step-down suggestion: same brand + same flavor, one strength level lower
const strengthOrder = ['light', 'normal', 'strong', 'extra-strong', 'super-strong'];
const currentStrengthIdx = strengthOrder.indexOf(product.data.strengthKey);
const lowerStrengths = currentStrengthIdx > 0 ? strengthOrder.slice(0, currentStrengthIdx) : [];

const stepDownProduct = lowerStrengths.length > 0
  ? allProducts.find((rp) =>
      rp.data.brandSlug === product.data.brandSlug
      && rp.data.flavorKey === product.data.flavorKey
      && lowerStrengths.includes(rp.data.strengthKey)
      && rp.data.stock > 0
      && rp.id !== product.id
    ) ?? null
  : null;
```

Add `stepDownProduct` to props.

- [ ] **Step 2: Render the step-down suggestion**

After the SnusCoin teaser and before the product details section, add a subtle suggestion for products that are `extra-strong` or `super-strong`:

```html
{stepDownProduct && (currentStrengthIdx >= 3) && (
  <div class="mb-6 rounded-lg border border-border/50 bg-muted/20 p-4 flex items-center gap-3">
    <span class="text-lg">💡</span>
    <div class="text-sm">
      <p class="text-muted-foreground">
        Thinking about stepping down? Try 
        <a href={`/products/${stepDownProduct.id}`} class="text-primary underline font-medium">
          {stepDownProduct.data.name}
        </a>
        at {stepDownProduct.data.nicotineContent}mg — same brand, same flavour, gentler strength.
      </p>
    </div>
  </div>
)}
```

- [ ] **Step 3: Destructure the new prop**

Add `stepDownProduct` to the `Astro.props` destructuring.

- [ ] **Step 4: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add "src/pages/products/[slug].astro"
git commit -m "feat: step-down suggestion on high-strength product pages"
```

---

### Task 7: Final Build, Push, Deploy

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
- Product reviews show "Verified Buyer" (green) or "Community Review" (gray) badges
- Verified reviews sort first in review lists
- Leaderboard has All Time / This Month toggle
- High-strength product pages (≥extra-strong) show step-down suggestion
- `bun run build` passes
