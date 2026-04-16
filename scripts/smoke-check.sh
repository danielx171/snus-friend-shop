#!/usr/bin/env bash
# Post-deploy smoke check.
# Usage: bun run smoke [BASE_URL]
# Defaults to https://snusfriends.com. Exits 1 on any failure.

set -uo pipefail
BASE_URL="${1:-https://snusfriends.com}"
fails=0

check() {
  local path="$1" expect="$2" marker="$3"
  local tmp code
  tmp=$(mktemp)
  code=$(curl -sSL -o "$tmp" -w "%{http_code}" --max-time 15 "${BASE_URL}${path}" 2>/dev/null)
  if [ "$code" != "$expect" ]; then
    echo "FAIL  $path  (HTTP $code, expected $expect)"
    fails=$((fails+1))
    rm -f "$tmp"
    return
  fi
  if [ -n "$marker" ] && ! grep -qE "$marker" "$tmp"; then
    echo "FAIL  $path  (200 but missing marker: $marker)"
    fails=$((fails+1))
    rm -f "$tmp"
    return
  fi
  rm -f "$tmp"
  echo "ok    $path"
}

echo "Smoke-check against $BASE_URL"
check "/"                                   200 "Shop by Brand"
check "/nicotine-pouches"                   200 "Filter"
check "/brands/zyn"                         200 "ZYN"
check "/products/zyn-cool-mint-slim-s2"     200 "ZYN Cool Mint"
check "/rewards"                            200 "SnusCoins|Vault|Rewards"
check "/blog"                               200 "blog"
check "/robots.txt"                         200 "User-agent"
check "/sitemap-index.xml"                  200 "sitemapindex"
check "/data/products.json"                 200 '"slug"'

if [ "$fails" -gt 0 ]; then
  echo
  echo "$fails check(s) failed."
  exit 1
fi
echo
echo "All smoke checks passed."
