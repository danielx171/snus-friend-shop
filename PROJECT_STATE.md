# Project State

Date: 2026-03-13
Branch: `dev`

## Workflow Alignment

- Added the AI context-pack files `CURRENT_PRIORITIES.md`, `SYSTEM_BOUNDARIES.md`, `ACTIVE_RISKS.md`, `CHANGELOG_AI.md`, and `NYEHANDEL_API.md`.
- Updated `README.md` and `CLAUDE.md` so top-level guidance matches the March 12 architecture pivot in `ROADMAP.md`.
- Current tiebreaker remains unchanged: when docs disagree, trust `ROADMAP.md` and `PROJECT_STATE.md`.
- Working tree is still dirty. In-progress edits already exist in auth pages, config, and function deletions, so new work should stay scoped.

---

Date: 2026-03-12
Branch: `dev`

## What Was Done Today

### DEL 1 - P0/P1 Fixes

#### Fix 1: `src/hooks/useCatalog.ts`
- Added `shopify_variant_id` to the `product_variants` select query in both `useCatalogProducts` and `useCatalogProduct`.
- Added `shopify_variant_id: string | null` to the `DbProduct.product_variants` type.
- `toProduct()` now builds a `shopifyVariantIds: Partial<Record<string, string>>` map (pack-size -> variant ID), exposed on the returned `MockProduct`.
- Removed mock fallback in `useCatalogProducts` - DB error now throws (fail closed), empty result returns `[]`.
- Removed mock fallback in `useCatalogProduct` - both UUID and slug lookups throw on error, return `undefined` on miss.
- Removed `console.log` from query function.

#### Fix 2: `src/pages/ForgotPasswordPage.tsx`
- Wired in `supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })`.
- Added `isLoading` and `authError` state.
- Button shows "Sending..." during request and is disabled.
- Inline error message shown on Supabase auth failure.
- `redirectTo` set to `window.location.origin + '/account'` (temporary - Step 34 adds a proper `/update-password` page).

Both fixes verified with `bun run build` (clean, no TypeScript errors).

---

## DEL 2 - Audit: Steps 10-25 *(snapshot as of 2026-03-12 — statuses updated inline where superseded)*

### `supabase/functions/create-shopify-checkout/index.ts`
**Status: Deleted (2026-03-13). Step 27 (write `create-nyehandel-checkout`) still pending.**
- Entire function is Shopify-specific (Storefront API `cartCreate` GraphQL mutation).
- CORS `"*"` too permissive - should be locked to frontend domain.
- `totalPrice` defaults to `0` with no validation - malformed request can create a zero-value order row.
- `requestId` missing from early 400 responses (validation errors lines 70-94).
- Hardcoded Shopify API version fallback `"2025-01"`.
- Error message in outer catch is misleading (`"Invalid JSON body"` for all exceptions).

### `supabase/functions/shopify-webhook/index.ts`
**Status: Deleted (2026-03-13). Step 28 (Nyehandel callback/polling handler) still pending.**
- Entire function is Shopify-specific (HMAC verification against Shopify secret, Shopify shop-domain allowlist, Admin API calls for tagging/metafields).
- `isPaidEvent`: `financial_status ?? "paid"` fallback is wrong - absent field should not default to "paid".
- `nyehandel_sync_status` logic bug on upsert (line 336): `existing?.checkout_status === "paid"` can never be true at this branch (idempotent case handled earlier), making the ternary dead code.
- `webhookId` leaked in 401 response before HMAC verification.
- API version inconsistency: falls back to `"2024-10"` vs `"2025-01"` in create-shopify-checkout.
- Shopify Admin API calls (`markShopifyOrderSyncFailed`, `writeNyehandelOrderIdMetafield`) all go away with the pivot.

### `supabase/functions/push-order-to-nyehandel/index.ts`
**Status: Survives with adjustments (Step 29)**
- Core retry logic (3 attempts, exponential delay) is solid.
- `external_order_id: order.shopify_order_id ?? order.id` - after pivot, use only internal UUID.
- `line_items` passed directly from `line_items_snapshot` (Shopify format) - needs mapping update for Nyehandel-native format.
- `customer` payload missing `name` - Nyehandel may require first/last name.
- CORS `"*"` on an internal-only function (misleading - auth is via `x-internal-function-secret`).
- `setTimeout` delay up to 900ms total - within Deno Edge Function time limits but worth monitoring.

### `supabase/functions/retry-failed-nyehandel-orders/index.ts`
**Status: Survives unchanged**
- Clean minimal implementation.
- Shared `requestId` across all retried orders in a batch - makes log tracing harder.
- Sequential processing (no parallelism) - 50 orders x 3 attempts = potentially slow.

### `src/pages/OrderConfirmation.tsx`
**Status: Completed (Step 33, 2026-03-13)**
- Reads `orderId` from `/order-confirmation/:orderId` param (falls back to `?orderId=` query param).
- Fetches real order from DB (`id` + `customer_email` guard via session).
- Discriminated union state: `loading | no-id | not-auth | not-found | error | ok`.
- `clearCart()` fires once via `useRef` guard after successful fetch.
- Defensive JSON normalisers for `line_items_snapshot` and `shipping_address`.
- Shipping address section rendered only if data present.
- Build verified clean.

### `src/pages/LoginPage.tsx` / `RegisterPage.tsx`
**Status: Completed (Step 31, 2026-03-13)**
- `signInWithPassword` / `signUp` wired; loading state, error display, redirect on success, email confirmation fallback all implemented.
- Build verified clean.

### `src/pages/AccountPage.tsx`
**Status: Completed (Step 32, 2026-03-13)**
- `isLoggedIn = useState(true)` replaced with real `getSession` + `onAuthStateChange`.
- Orders fetched from `orders` table by `customer_email` via React Query.
- Real sign-out via `useNavigate`. Settings pre-filled from user metadata.
- Addresses tab shows empty state (no DB table yet — not a regression).
- Build verified clean.

---

## Architecture Decision

**Shopify is being removed.** New flow: React -> Nyehandel payment API -> fulfillment.

Step 25 is BLOCKED pending Nyehandel payment API investigation.
See `ROADMAP.md` for Steps 25-40.

---

## Next Session: Start Here

1. **Step 25** — BLOCKED. Waiting for Nyehandel API details from CEO. Document findings in `NYEHANDEL_API.md` when received.
2. **Step 34** — Add `UpdatePasswordPage` at `/update-password` to handle Supabase password-reset callback and `updateUser({ password })`.
3. **Steps 35–36** — Fix `ProductListing.tsx` silent error state; fix `ProductDetail.tsx` hardcoded star rating and wrong i18n key on related products.

Steps 33–36 are frontend-only and do not require Nyehandel resolution.
