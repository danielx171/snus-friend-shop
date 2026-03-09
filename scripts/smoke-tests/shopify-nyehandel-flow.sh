#!/usr/bin/env bash
set -euo pipefail

# Required env vars:
#   SUPABASE_URL
#   SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY
#   SHOPIFY_WEBHOOK_SECRET

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_ANON_KEY:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" || -z "${SHOPIFY_WEBHOOK_SECRET:-}" ]]; then
  echo "Missing required env vars."
  exit 1
fi

echo "1) Create checkout handoff"
CREATE_RESPONSE=$(curl -sS -X POST "${SUPABASE_URL}/functions/v1/create-shopify-checkout" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"shopifyVariantId":"mock_variant_id_1","quantity":1}],"totalPrice":4.99,"currency":"GBP"}')
echo "${CREATE_RESPONSE}"

echo "2) Simulate Shopify paid webhook"
RAW_PAYLOAD='{"id":900001,"email":"buyer@example.com","total_price":"4.99","currency":"GBP","financial_status":"paid","paid_at":"2026-03-09T12:00:00Z","shipping_address":{"first_name":"Test","last_name":"Buyer","address1":"123 Test St","city":"London","country":"GB","zip":"SW1A1AA"},"line_items":[{"variant_id":1,"sku":"mock_variant_id_1","quantity":1,"price":"4.99","title":"Cool Mint Slim"}]}'
HMAC=$(printf "%s" "${RAW_PAYLOAD}" | openssl dgst -sha256 -hmac "${SHOPIFY_WEBHOOK_SECRET}" -binary | openssl base64)

WEBHOOK_RESPONSE=$(curl -sS -X POST "${SUPABASE_URL}/functions/v1/shopify-webhook" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "x-shopify-topic: orders/paid" \
  -H "x-shopify-hmac-sha256: ${HMAC}" \
  -d "${RAW_PAYLOAD}")
echo "${WEBHOOK_RESPONSE}"

echo "3) Retry failed pushes (optional)"
RETRY_RESPONSE=$(curl -sS -X POST "${SUPABASE_URL}/functions/v1/retry-failed-nyehandel-orders" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}')
echo "${RETRY_RESPONSE}"

echo "Smoke flow completed."
