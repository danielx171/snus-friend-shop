# NYEHANDEL API

Status: ✅ Investigation complete — Step 25 answered
Last updated: 2026-03-18

This document answers all open questions from the original Step 25 investigation.
**Step 25 is ready to be marked complete.**

Source: Live docs read in full at https://docs.nyapi.se

---

## Goal

Determine whether Nyehandel can own payment-session creation for the storefront
and how order confirmation flows back into this repo.

---

## Answers to Open Questions

**Does Nyehandel expose a payment or checkout session API for B2C storefront use?**
Yes. The correct endpoint is `POST /orders/simple`. It is specifically designed for
headless B2C storefronts — you send SKUs, quantities, customer info, and shipping/payment
method names. Nyehandel handles all pricing and payment processing internally. You do
NOT send prices — Nyehandel uses its own stored prices.

**What authentication model is required for payment-session creation?**
Two headers required on every request:
```
X-identifier: {identifier from Nyehandel admin}
Authorization: Bearer {API key from Nyehandel admin}
```
These must be stored as Supabase Secrets and never committed to GitHub.

**Is there a callback or webhook for paid orders?**
Yes — two mechanisms:

1. `delivery_callback_url` field on `POST /orders/simple` — Nyehandel POSTs tracking
   data (tracking_id, tracking_url per parcel) to this URL when an order is shipped.
   Set this to your Supabase Edge Function URL.

2. Webhook configuration in Nyehandel admin panel — for broader order events
   (created, updated, status changes). Configure to POST to your edge functions.

**If there is no webhook, what polling mechanism is supported or required?**
Not needed — webhooks are confirmed available. For orders specifically,
`GET /orders` supports filtering by `created_at`, `updated_at`, `status` etc.
as a fallback polling strategy if needed.

**What identifiers must we persist in `orders` to correlate payment, order creation, and fulfillment?**
`POST /orders/simple` returns:
```json
{ "data": { "id": 12345, "prefix": "SF" } }
```
Persist both `id` (Nyehandel's internal order ID) and `prefix` in your `orders` table.
The `id` is used for all subsequent order operations (GET, update, deliver, cancel).

**Are there required idempotency, signature, or replay-protection rules?**
Not documented. The API uses standard Bearer token auth. No idempotency keys
or signature headers are mentioned in the official docs.

**What customer, address, and line-item payload shape is required?**
```json
{
  "prefix": "SF",
  "currency_iso": "GBP",
  "locale": "en-gb",
  "delivery_callback_url": "https://your-edge-fn-url/webhooks/delivery",
  "marking": "optional order reference",
  "checkout_message": "optional note to warehouse (max 255 chars)",
  "customer": {
    "type": "person",
    "email": "required",
    "phone": "optional"
  },
  "billing_address": {
    "firstname": "required",
    "lastname": "required",
    "address": "required",
    "postcode": "required",
    "city": "required",
    "country": "required — 2-char ISO code e.g. GB"
  },
  "shipping_address": "optional — same shape as billing_address",
  "shipping": { "name": "exact name from GET /shipping-methods" },
  "payment": { "name": "exact name from GET /payment-methods" },
  "items": [
    { "type": "product", "sku": "ZYN-COOL-MINT-6", "quantity": 2 }
  ]
}
```

---

## Implementation Targets (confirmed)

### `supabase/functions/push-order-to-nyehandel/index.ts`
Already exists. Should call `POST /orders/simple` with the payload above.
Returns Nyehandel order ID to persist in the `orders` table.

### `supabase/functions/sync-nyehandel/index.ts`
Already exists. Calls `GET /products` to sync catalog. Upserts into Supabase
by `nyehandel_id`. Variants arrive nested inside each product response.

### Delivery webhook handler
New edge function needed at the `delivery_callback_url`.
Receives tracking data from Nyehandel when orders ship:
```json
{
  "parcels": [{ "tracking_id": "string", "tracking_url": "https://..." }]
}
```

### Shipping and payment method lookup
Before checkout, fetch available options:
- `GET /shipping-methods` — returns shipping options to show customer
- `GET /payment-methods` — returns payment options (paginated, page + limit params)
Use the `name` field from these responses directly in the order payload.

---

## Required Secrets (Supabase Secrets, never in .env or GitHub)

| Secret name | Description |
|-------------|-------------|
| `NYEHANDEL_BEARER_TOKEN` | API key from Nyehandel admin |
| `NYEHANDEL_IDENTIFIER` | X-identifier from Nyehandel admin |

---

## Risks and Known Unknowns

- **Headless endpoints marked Developing** — `/headless/pages`, `/headless/system`,
  `/headless/categories` are all flagged as beta. Do not rely on these in production yet.

- **Price update gotcha** — when updating variant prices via `PUT /variants/batch`,
  sibling prices (same currency + customer group) are fully replaced, not merged.
  Always send the complete desired price array.

- **Stock vs inventories conflict** — on `PUT /variants/{id}`, if you send
  `inventories` (warehouse-specific), the top-level `stock` field is silently ignored.

- **No payment session API** — Nyehandel does not expose a Stripe-style
  payment intent or session. Payment is handled entirely inside Nyehandel after
  order creation. This means you cannot show a custom payment UI — the customer
  must complete payment through Nyehandel's flow.

- **Default language is Swedish** — add `X-Language: en` header to all requests
  to get English responses.

---

## Exit Criteria — All Met ✅

- ✅ Documented endpoint list → see NYEHANDEL_API_REFERENCE.md
- ✅ Auth requirements captured → Bearer token + X-identifier
- ✅ Callback/polling strategy decided → delivery_callback_url webhook
- ✅ Required secrets listed → above table
- ✅ Data contract for order creation captured → payload shape above
- ✅ Risks and unknowns called out → risks section above
