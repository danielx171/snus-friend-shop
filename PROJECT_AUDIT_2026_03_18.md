# Project Audit & Status Report
Date: 2026-03-18
Scope: Full codebase read — all edge functions, migrations, frontend pages, config

---

## Executive Summary

The project is in a **clean but incomplete state**. The Shopify era is over, the docs are 
in order, and the foundation is solid. However the store **cannot take a single order 
right now** — the checkout button is intentionally disabled, waiting for the Nyehandel-first 
checkout to be built (Steps 26–29). Beyond that there are several bugs in existing 
functions that will break live operation even after checkout is wired up.

**Good news:** Most issues are well-defined and fixable in one focused session.

---

## What's Actually in the Repo

### Edge Functions (11)
| Function | Purpose | Status |
|----------|---------|--------|
| `create-nyehandel-checkout` | B2C checkout creation | ❌ Does not exist yet |
| `push-order-to-nyehandel` | Push confirmed order to Nyehandel | ⚠️ Exists, wrong format |
| `retry-failed-nyehandel-orders` | Cron retry of failed pushes | ✅ Solid |
| `nyehandel-webhook` | Receive Nyehandel product/inventory events | ⚠️ Sync call broken |
| `nyehandel-proxy` | Admin-facing Nyehandel API proxy | ⚠️ Wrong base URL |
| `sync-nyehandel` | Sync product catalog from Nyehandel | ⚠️ Wrong base URL |
| `ops-b2b-queues` | Nightly ops alerts cron | ✅ Solid |
| `ops-set-role` | Assign user roles | ✅ Fine |
| `ops-users` | User management | ✅ Fine |
| `verify-admin` | Admin verification | ✅ Fine |
| `healthcheck` | Health endpoint | ✅ Fine |
| `ops-webhook-inbox` | ⚠️ **Wrong path** — see below | 🐛 Bug |

### Frontend Pages (16)
| Page | Status |
|------|--------|
| `CheckoutHandoff.tsx` | ⚠️ Button disabled — awaiting Step 27 |
| `AccountPage.tsx` | ✅ Real auth, real orders query |
| `OrderConfirmation.tsx` | ✅ Real data from DB |
| `LoginPage.tsx` / `RegisterPage.tsx` | ✅ Real Supabase auth |
| `ForgotPasswordPage.tsx` / `UpdatePasswordPage.tsx` | ✅ Complete |
| `ProductListing.tsx` / `ProductDetail.tsx` | ✅ Error states handled |
| `CartPage.tsx`, `HomePage.tsx`, `BrandHub.tsx`, etc. | ✅ OK |

### Migrations (13)
All applied and in correct location in `supabase/migrations/`. One naming issue (see below).

---

## Bugs Found (Read From Actual Code)

### 🔴 CRITICAL — Checkout does not exist
`create-nyehandel-checkout` edge function has not been written yet.
`CheckoutHandoff.tsx` has a permanently disabled button with the text 
"Checkout temporarily unavailable." The store cannot take orders.
**Fix: Step 27 — write `create-nyehandel-checkout`.**

---

### 🔴 CRITICAL — All Nyehandel API calls use wrong base URL
Every function that calls Nyehandel uses:
```
NYEHANDEL_API_URL || 'https://api.nyehandel.se/v1'
```
The real API base URL from the docs is:
```
https://api.nyehandel.se/api/v2
```
This affects `push-order-to-nyehandel`, `nyehandel-proxy`, and `sync-nyehandel`.
Every API call these functions make is going to the wrong URL and will return 404.
**Fix: Update the fallback in each function AND set `NYEHANDEL_API_URL` correctly 
in Supabase secrets to `https://api.nyehandel.se/api/v2`.**

---

### 🔴 CRITICAL — `push-order-to-nyehandel` sends completely wrong payload
The function sends a Shopify-era payload format:
```json
{
  "external_order_id": "...",
  "customer": { "email": "..." },
  "totals": { "amount": 0, "currency": "GBP" },
  "shipping_address": {},
  "line_items": []
}
```
The real Nyehandel `POST /orders/simple` expects:
```json
{
  "prefix": "SF",
  "currency_iso": "GBP",
  "locale": "en-gb",
  "delivery_callback_url": "https://...",
  "customer": { "type": "person", "email": "..." },
  "billing_address": { "firstname": "", "lastname": "", "country": "GB" },
  "shipping": { "name": "PostNord MyPack" },
  "payment": { "name": "Stripe" },
  "items": [{ "type": "product", "sku": "ZYN-COOL-MINT-6", "quantity": 2 }]
}
```
Also missing required `X-identifier` header on all Nyehandel API calls.
**Fix: Step 29 — rewrite `push-order-to-nyehandel` payload mapping.**

---

### 🔴 CRITICAL — `push-order-to-nyehandel` checkout_status check will always block
The function has this guard:
```typescript
if (order.checkout_status !== "paid") {
  return jsonResponse({ error: "order_not_paid" }, 409);
}
```
In the Nyehandel-first flow, there is no Shopify payment webhook to set 
`checkout_status = "paid"`. Orders created by `create-nyehandel-checkout` will 
need a new status flow. This guard will block all orders from being pushed.
**Fix: Rethink order status flow in Step 26 schema design + Step 27/29 implementation.**

---

### 🟠 HIGH — `nyehandel-webhook` sync call is faked
The webhook handler is supposed to trigger a catalog/inventory sync when it receives 
a product or inventory event. The actual code only inserts a `sync_runs` record 
saying "running" but **never actually calls `sync-nyehandel`**. 
The comment literally says "For now, just record that a sync was queued."
Real-time product sync from Nyehandel does not work.
**Fix: Replace the stub with an actual `fetch` call to `sync-nyehandel`.**

---

### 🟠 HIGH — Missing `X-identifier` header on all Nyehandel API calls
Every Nyehandel API call requires:
```
X-identifier: {identifier}
```
None of the functions (`push-order-to-nyehandel`, `nyehandel-proxy`, `sync-nyehandel`) 
send this header. The `NYEHANDEL_X_IDENTIFIER` secret is already set in Supabase 
but never used in code.
**Fix: Add `'X-identifier': Deno.env.get('NYEHANDEL_X_IDENTIFIER')` to every 
Nyehandel fetch call.**

---

### 🟠 HIGH — `ops-webhook-inbox` function at wrong path
In the GitHub file tree, this function appears at:
```
supabase/functions/supabase/functions/ops-webhook-inbox/index.ts
```
That is a nested path — it should be at:
```
supabase/functions/ops-webhook-inbox/index.ts
```
This function may not be deployable and is not in `supabase/config.toml`.
**Fix: Move the file to the correct path.**

---

### 🟠 HIGH — `push-order-to-nyehandel` still references Shopify fields
The function accepts `shopifyOrderId` in the request body and queries:
```typescript
.eq("shopify_order_id", body.shopifyOrderId)
```
And uses:
```typescript
external_order_id: order.shopify_order_id ?? order.id
```
After Step 26, `shopify_order_id` will be gone from the schema.
**Fix: Step 29 — remove all Shopify references.**

---

### 🟠 HIGH — CORS wildcard on `push-order-to-nyehandel`
The function is internal-only (secured by `x-internal-function-secret`) but 
still has `"Access-Control-Allow-Origin": "*"`. This is misleading and slightly 
increases attack surface. `config.toml` correctly sets `verify_jwt = true` 
which is good, but CORS should still be locked.
**Fix: Step 29 — set CORS origin to Supabase function URL only.**

---

### 🟡 MEDIUM — Orders schema has Shopify debris
The `orders` table still has these columns that will become dead weight:
- `shopify_order_id` (text, unique)
- `shopify_checkout_id` (text)
- `idempotency_key` (text) — may be reusable with new UUID
- `checkout_status` enum (`pending | paid | failed | cancelled`) — needs rethinking
- Index: `idx_orders_shopify_id` on `shopify_order_id`

The `ops_alerts` table has `source_shopify_order_id text` — also Shopify debris.
**Fix: Step 26 migration — drop/rename columns, add Nyehandel columns.**

---

### 🟡 MEDIUM — `sync-nyehandel` field mapping likely broken
The sync function maps Nyehandel product data assuming these field names:
```
item.brand, item.flavor, item.strength, item.format, item.nicotine_mg,
item.portions_per_can, item.badges, item.image_url, item.prices.pack1, etc.
```
But the real Nyehandel API response structure (from our docs) uses:
```
product.name, variant.sku, variant.gtin, variant.stock, variant.prices[]
```
The field mapping is guesswork that probably doesn't match reality. The sync 
will likely process 0 items correctly when run against the live API.
**Fix: Once we test against the live API, update the field mapping to match 
actual Nyehandel response structure.**

---

### 🟡 MEDIUM — Two lockfiles in repo root
Both `bun.lock` AND `bun.lockb` exist. Only one should be present.
`bun.lockb` is the old binary format; `bun.lock` is the new text format.
**Fix: `git rm bun.lockb` and commit.**

---

### 🟡 MEDIUM — Junk directories in repo root
- `review_mvp/` — Python review pipeline, not part of this project
- `DEBUG_LOGS/` — local debugging artifacts
- `opencode.json.save` — editor temp file
- `CHANGELOG.md` is showing as a **directory**, not a file (visible in the tree output)
**Fix: Clean these up with `git rm -r`.**

---

### 🟡 MEDIUM — `nyehandel-proxy` not registered in `config.toml` correctly
`verify_jwt = false` on `nyehandel-proxy` is correct since it does its own 
JWT verification internally, but it also has no entry for `create-nyehandel-checkout` 
since it doesn't exist yet. Once Step 27 is done, `config.toml` needs an entry.
**Fix: Add `[functions.create-nyehandel-checkout]` with `verify_jwt = false` in Step 27.**

---

## What's Working Well

- `retry-failed-nyehandel-orders` — clean, auth correct, cron secret enforced
- `nyehandel-proxy` — good role-based auth, allowlist, graceful error handling
- `ops-b2b-queues` — solid cron pattern with x-cron-secret
- `nyehandel-webhook` — auth is correct (x-api-key), inbox pattern is good
- `sync-nyehandel` — admin-role enforcement is correct
- `config.toml` — JWT policies are correctly set for internal vs public functions
- `src/lib/api.ts` — clean `apiFetch` + `fetchNyehandel` pattern
- All auth pages — real Supabase auth, no mocks
- `CheckoutHandoff.tsx` — uses `getCartTotals` correctly, no hardcoded values
- `.env.example` — clean and complete, no secrets committed

---

## Prioritised Fix Order (What to Do Next)

### Phase 1 — One-time fixes before building checkout (do first, fast)

1. **Fix base URL** — update `NYEHANDEL_API_URL` secret in Supabase to 
   `https://api.nyehandel.se/api/v2` and update the fallback in all 3 functions
2. **Add X-identifier header** — 3 functions, 1 line each
3. **Fix `ops-webhook-inbox` path** — move file to correct location
4. **Fix `nyehandel-webhook` sync call** — replace stub with real fetch call
5. **Clean junk** — `bun.lockb`, `review_mvp/`, `DEBUG_LOGS/`, `opencode.json.save`

### Phase 2 — Steps 26–29 (the main work)

**Step 26 — Schema migration**
Write `20260318_nyehandel_first_orders.sql`:
- Drop `shopify_order_id`, `shopify_checkout_id` columns
- Rename or repurpose `idempotency_key` → internal UUID idempotency
- Change `checkout_status` values: `pending | confirmed | shipped | cancelled`
- Add `nyehandel_prefix text`, `tracking_id text`, `tracking_url text`, 
  `delivery_callback_received_at timestamptz`
- Drop `idx_orders_shopify_id`, add `idx_orders_nyehandel_order_id`
- Drop `source_shopify_order_id` from `ops_alerts`
- Update `src/integrations/supabase/types.ts` to match

**Step 27 — `create-nyehandel-checkout` edge function**
- Accept cart items (SKU + quantity) + customer info from frontend
- Call `GET /shipping-methods` and `GET /payment-methods` to validate names
- Call `POST /orders/simple` with correct Nyehandel payload
- Set `delivery_callback_url` to `nyehandel-delivery-callback` function URL
- Persist order row in Supabase with `checkout_status = 'pending'`
- Return `{ nyehandelOrderId, prefix }` to frontend
- Add to `config.toml` with `verify_jwt = false`

**Step 28 — `nyehandel-delivery-callback` edge function**  
(new name, replaces old `shopify-webhook` pattern)
- Receive tracking POST from Nylogistik when order ships
- Update order: `tracking_id`, `tracking_url`, `checkout_status = 'shipped'`
- Add to `config.toml` with `verify_jwt = false`

**Step 29 — Rewrite `push-order-to-nyehandel`**
- Remove all `shopifyOrderId` / `shopify_order_id` references
- Fix payload to match real Nyehandel `POST /orders/simple` format
- Add `X-identifier` header
- Fix `checkout_status` guard (replace `"paid"` check with new status)
- Lock CORS to internal only
- Remove `external_order_id` from payload entirely (Nyehandel generates its own IDs)

**Step 30 — Wire `CheckoutHandoff.tsx`**
- Call `create-nyehandel-checkout` via `apiFetch`
- Show loading/error states
- Re-enable the checkout button
- Redirect to `OrderConfirmation` with the order ID on success

### Phase 3 — Steps 39–40

- Step 39: Full UAT end-to-end
- Step 40: Security review (CORS locks, RLS audit, OWASP check)

---

## Summary Numbers

| Category | Count |
|----------|-------|
| Critical bugs | 4 |
| High issues | 4 |
| Medium issues | 5 |
| Functions working correctly | 7/11 |
| Frontend pages complete | 15/16 |
| Steps remaining to go-live | 26, 27, 28, 29, 30, 39, 40 |
| Estimated session to production | 2–3 focused sessions |
