# Project State

Date: 2026-03-12
Branch: `dev`

## What Was Done Today

### DEL 1 — P0/P1 Fixes

#### Fix 1: `src/hooks/useCatalog.ts`
- Added `shopify_variant_id` to the `product_variants` select query in both `useCatalogProducts` and `useCatalogProduct`.
- Added `shopify_variant_id: string | null` to the `DbProduct.product_variants` type.
- `toProduct()` now builds a `shopifyVariantIds: Partial<Record<string, string>>` map (pack-size → variant ID), exposed on the returned `MockProduct`.
- Removed mock fallback in `useCatalogProducts` — DB error now throws (fail closed), empty result returns `[]`.
- Removed mock fallback in `useCatalogProduct` — both UUID and slug lookups throw on error, return `undefined` on miss.
- Removed `console.log` from query function.

#### Fix 2: `src/pages/ForgotPasswordPage.tsx`
- Wired in `supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })`.
- Added `isLoading` and `authError` state.
- Button shows "Sending…" during request and is disabled.
- Inline error message shown on Supabase auth failure.
- `redirectTo` set to `window.location.origin + '/account'` (temporary — Step 34 adds a proper `/update-password` page).

Both fixes verified with `bun run build` (clean, no TypeScript errors).

---

## DEL 2 — Audit: Steps 10–25

### `supabase/functions/create-shopify-checkout/index.ts`
**Status: To be replaced (Step 27)**
- Entire function is Shopify-specific (Storefront API `cartCreate` GraphQL mutation).
- CORS `"*"` too permissive — should be locked to frontend domain.
- `totalPrice` defaults to `0` with no validation — malformed request can create £0 order row.
- `requestId` missing from early 400 responses (validation errors lines 70–94).
- Hardcoded Shopify API version fallback `"2025-01"`.
- Error message in outer catch is misleading (`"Invalid JSON body"` for all exceptions).

### `supabase/functions/shopify-webhook/index.ts`
**Status: To be removed (Step 28)**
- Entire function is Shopify-specific (HMAC verification against Shopify secret, Shopify shop-domain allowlist, Admin API calls for tagging/metafields).
- `isPaidEvent`: `financial_status ?? "paid"` fallback is wrong — absent field should not default to "paid".
- `nyehandel_sync_status` logic bug on upsert (line 336): `existing?.checkout_status === "paid"` can never be true at this branch (idempotent case handled earlier), making the ternary dead code.
- `webhookId` leaked in 401 response before HMAC verification.
- API version inconsistency: falls back to `"2024-10"` vs `"2025-01"` in create-shopify-checkout.
- Shopify Admin API calls (`markShopifyOrderSyncFailed`, `writeNyehandelOrderIdMetafield`) all go away with the pivot.

### `supabase/functions/push-order-to-nyehandel/index.ts`
**Status: Survives with adjustments (Step 29)**
- Core retry logic (3 attempts, exponential delay) is solid.
- `external_order_id: order.shopify_order_id ?? order.id` — after pivot, use only internal UUID.
- `line_items` passed directly from `line_items_snapshot` (Shopify format) — needs mapping update for Nyehandel-native format.
- `customer` payload missing `name` — Nyehandel may require first/last name.
- CORS `"*"` on an internal-only function (misleading — auth is via `x-internal-function-secret`).
- `setTimeout` delay up to 900ms total — within Deno Edge Function time limits but worth monitoring.

### `supabase/functions/retry-failed-nyehandel-orders/index.ts`
**Status: Survives unchanged**
- Clean minimal implementation.
- Shared `requestId` across all retried orders in a batch — makes log tracing harder.
- Sequential processing (no parallelism) — 50 orders × 3 attempts = potentially slow.

### `src/pages/OrderConfirmation.tsx`
**Status: Fully mock (Step 33)**
- All data hardcoded (`mockOrder`, "James Wilson", fake order ID).
- URL params not read — no connection to real order.
- `copyOrderId` copies mock ID.
- Order timeline hardcoded (`done: true/false`).
- No `clearCart()` after confirmed order.
- No `<SEO>` wrapper.
- Uses `formatPrice` from `@/lib/currency` (not market-aware).

### `src/pages/LoginPage.tsx` / `RegisterPage.tsx`
**Status: Placeholder UI (Step 31)**
- `handleSubmit` does nothing — no `supabase.auth.signInWithPassword` / `signUp`.
- No redirect after auth.
- Terms/Privacy links use non-functional `<span>` instead of `<Link>`.

### `src/pages/AccountPage.tsx`
**Status: All mock (Step 32)**
- `isLoggedIn = useState(true)` hardcoded — "not logged in" branch is unreachable dead code.
- `mockOrders`, `mockAddresses` — fake "John Doe" data.
- All action buttons non-functional.
- Local `OrderStatus` type mismatches `checkout_status` from `types.ts`.
- Uses `formatPrice` from `@/lib/currency` (not market-aware).

---

## Architecture Decision

**Shopify is being removed.** New flow: React → Nyehandel payment API → fulfillment.

Step 25 is BLOCKED pending Nyehandel payment API investigation.
See ROADMAP.md for Steps 25–40.

---

## Next Session: Start Here

1. **Step 25** — Investigate Nyehandel payment API. Can they handle payment? What endpoints exist? What is the callback mechanism? Document findings in `NYEHANDEL_API.md`.
2. **Step 31** — Wire real Supabase auth into `LoginPage` and `RegisterPage` (does not require Nyehandel resolution).
3. **Step 32** — Wire real session + orders into `AccountPage` (does not require Nyehandel resolution).

Steps 31 and 32 are frontend-only and can be done in parallel with the Nyehandel investigation.
