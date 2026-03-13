# UAT Preflight Checklist (Step 24) — ARCHIVED

> **ARCHIVED — Shopify phase (completed 2026-03-12)**
> This runbook was written for the Shopify-first checkout flow. `create-shopify-checkout` and `shopify-webhook` were deleted on 2026-03-13 as part of the Nyehandel-first architecture pivot. The runbook below is no longer executable. A replacement UAT runbook for the Nyehandel-first flow will be written as part of Step 39.

---

*Original runbook preserved below for historical reference only.*

Manual for end-to-end UAT of the flow:
Frontend Checkout -> Shopify paid order -> Supabase `orders` update -> Nyehandel push -> `synced` status.

## 1) Scope and boundaries

- UAT scope: checkout/order/Nyehandel chain only.
- Do not test or modify Pipedrive/WhatsApp/Cowork automation.
- Keep work in Supabase/Shopify integration boundaries.

## 2) Required runtime env/secrets

These variables are required by current implementation.

### Edge Functions env (required)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_WEBHOOK_SECRET`
- `NYEHANDEL_API_URL`
- `NYEHANDEL_API_TOKEN`
- `INTERNAL_FUNCTIONS_SECRET`
- `RETRY_FAILED_ORDERS_SECRET`

### Vault secrets for scheduled retry job

- `SUPABASE_FUNCTIONS_BASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RETRY_FAILED_ORDERS_SECRET`

## 3) Function auth/security preflight

- Confirm `supabase/config.toml` has:
  - `[functions.push-order-to-nyehandel] verify_jwt = true`
  - `[functions.retry-failed-nyehandel-orders] verify_jwt = true`
- Confirm webhook allowlist is configured:
  - `SHOPIFY_STORE_DOMAIN` must match Shopify webhook header `x-shopify-shop-domain` exactly.
- Confirm internal function chaining secret is configured:
  - `INTERNAL_FUNCTIONS_SECRET` set in all relevant function environments.

## 4) DB/migrations preflight

- Ensure latest migrations are applied, including:
  - `20260309143000_setup_retry_cron.sql`
  - `20260310101500_harden_retry_cron_auth_and_url.sql`
- Confirm tables/columns used by chain exist:
  - `orders`
  - `webhook_inbox`
  - `orders.nyehandel_sync_status`, `orders.nyehandel_order_id`, `orders.last_sync_error`

## 5) Step 24 E2E UAT runbook

Run in this exact order.

1. Create checkout from frontend
   - Open app and start checkout from cart.
   - Expected: redirect to real Shopify checkout URL.

2. Complete payment in Shopify test mode
   - Use Shopify test payment flow.
   - Expected: order appears in Shopify admin as paid.

3. Verify `orders` row in Supabase
   - Expected minimum:
     - `shopify_order_id` populated
     - `checkout_status = 'paid'`
     - `paid_at` populated
     - `line_items_snapshot` populated

4. Verify webhook ingestion
   - In `webhook_inbox`, latest Shopify event should be persisted.
   - Expected:
     - `provider = 'shopify'`
     - `topic` for paid event
     - `status = 'processed'` (or `failed` with actionable error)

5. Verify Nyehandel push outcome
   - In `orders`, expected:
     - `nyehandel_sync_status = 'synced'`
     - `nyehandel_order_id` populated
     - `last_sync_error` is `null`

6. If push fails, verify retry path
   - Expected:
     - row moves to `nyehandel_sync_status = 'failed'`
     - retry endpoint can process failed rows and transition to `synced`

## 6) Suggested SQL checks during UAT

Use SQL editor and replace placeholders.

```sql
-- 1) Latest relevant order
select id, shopify_order_id, checkout_status, paid_at, nyehandel_sync_status, nyehandel_order_id, last_sync_error, updated_at
from public.orders
order by updated_at desc
limit 5;
```

```sql
-- 2) Latest webhook events
select id, provider, topic, status, received_at, processed_at
from public.webhook_inbox
where provider = 'shopify'
order by received_at desc
limit 10;
```

## 7) Pass/fail criteria for Step 24

- PASS when all are true for at least one fresh paid test order:
  - Checkout redirect works from frontend.
  - Paid webhook accepted and processed.
  - `orders.checkout_status = 'paid'`.
  - `orders.nyehandel_sync_status = 'synced'`.
  - `orders.nyehandel_order_id` exists.
  - No manual DB patching required.
- FAIL if any link in chain requires manual workaround or inconsistent status remains.

## 8) Evidence to capture in UAT notes

- Timestamp of test order.
- Shopify order id.
- Supabase `orders.id`.
- `webhook_inbox.id` for the paid webhook.
- Final `nyehandel_sync_status` and `nyehandel_order_id`.
- Any error payloads/status codes if failure occurred.

## 9) UAT log template

```md
# Step 24 UAT Log

## Test metadata

- Date:
- Environment:
- Tester:
- Build/commit:

## Env preflight

- SUPABASE_URL:
- SUPABASE_SERVICE_ROLE_KEY:
- SHOPIFY_STORE_DOMAIN:
- SHOPIFY_STOREFRONT_ACCESS_TOKEN:
- SHOPIFY_WEBHOOK_SECRET:
- NYEHANDEL_API_URL:
- NYEHANDEL_API_TOKEN:
- INTERNAL_FUNCTIONS_SECRET:
- RETRY_FAILED_ORDERS_SECRET:

## E2E run record

### 1) Frontend checkout handoff

- Result:
- Notes:

### 2) Shopify test payment

- Result:
- Shopify order id:
- Notes:

### 3) Supabase orders verification

- orders.id:
- shopify_order_id:
- checkout_status:
- paid_at:
- line_items_snapshot present:
- Notes:

### 4) Webhook inbox verification

- webhook_inbox.id:
- provider:
- topic:
- status:
- received_at:
- processed_at:
- Notes:

### 5) Nyehandel push verification

- nyehandel_sync_status:
- nyehandel_order_id:
- last_sync_error:
- Notes:

### 6) Retry path (if applicable)

- Was retry needed:
- Retry result:
- Notes:

## Final verdict

- Step 24 status (PASS/FAIL):
- Blocking issues:
- Follow-up actions:
```
