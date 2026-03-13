# NYEHANDEL API

Status: Investigation required
Last updated: 2026-03-13

This document is the working note for `ROADMAP.md` Step 25.
Do not mark Step 25 complete until the open questions below are answered with evidence.

## Goal

Determine whether Nyehandel can own payment-session creation for the storefront and how order confirmation flows back into this repo.

## Open questions

- Does Nyehandel expose a payment or checkout session API for B2C storefront use?
- What authentication model is required for payment-session creation?
- Is there a callback or webhook for paid orders?
- If there is no webhook, what polling mechanism is supported or required?
- What identifiers must we persist in `orders` to correlate payment, order creation, and fulfillment?
- Are there required idempotency, signature, or replay-protection rules?
- What customer, address, and line-item payload shape is required?

## Evidence log

- No confirmed payment-session documentation has been captured in this repo yet.
- Existing deployment docs confirm current secrets for Nyehandel proxy and webhook handling, but not a storefront payment flow.

## Expected implementation targets after investigation

- `supabase/functions/create-nyehandel-checkout/index.ts`
- A Nyehandel callback or polling function to replace `shopify-webhook`
- Updates to `supabase/functions/push-order-to-nyehandel/index.ts`
- Possible `orders` schema changes if Nyehandel introduces new external identifiers or payment-state fields

## Exit criteria for Step 25

- Documented endpoint list
- Auth requirements captured
- Callback or polling strategy decided
- Required secrets listed
- Data contract for order creation captured
- Risks and unknowns called out before implementation starts
