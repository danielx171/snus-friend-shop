#!/usr/bin/env bash
# IndexNow ping — notifies Bing/Yandex of updated URLs
# Protocol: https://www.indexnow.org/documentation
#
# Usage:
#   ./scripts/indexnow-ping.sh
#
# Run this after publishing new or updated pages in production.

set -euo pipefail

HOST="snusfriends.com"
KEY="db992231-33ea-4c7c-b011-dbb470236e76"
KEY_LOCATION="https://${HOST}/${KEY}.txt"

PAYLOAD=$(cat <<EOF
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": [
    "https://${HOST}/",
    "https://${HOST}/blog",
    "https://${HOST}/nicotine-pouches",
    "https://${HOST}/brands",
    "https://${HOST}/sitemap-index.xml"
  ]
}
EOF
)

echo "Pinging IndexNow API..."
echo "Payload:"
echo "${PAYLOAD}"
echo ""

RESPONSE=$(curl -s -o /dev/stderr -w "%{http_code}" \
  -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "${PAYLOAD}" 2>&1) || true

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

echo ""
echo "HTTP status: ${HTTP_CODE}"

case "${HTTP_CODE}" in
  200) echo "Success — URLs accepted and queued for crawling." ;;
  202) echo "Accepted — URLs received (crawl scheduled)." ;;
  400) echo "Error 400 — Bad request. Check payload format." ;;
  403) echo "Error 403 — Forbidden. Key file may be missing or mismatched." ;;
  422) echo "Error 422 — Unprocessable entity. URLs may not belong to the host." ;;
  429) echo "Error 429 — Too many requests. Wait before retrying." ;;
  *)   echo "Unexpected status ${HTTP_CODE}." ;;
esac
