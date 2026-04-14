---
name: snusfriend-design-system
description: Use when creating, updating, or reviewing SnusFriend storefront UI, page copy, or merchandising surfaces. Covers the site's premium-but-approachable tone, proof-led marketing rules, dynamic catalog counts, and the key data/config sources to reuse instead of hardcoding.
---

# SnusFriend Design System

Use this skill for SnusFriend-specific frontend work when the task touches:
- homepage, PDP, category, rewards, blog, or cart UI
- merchandising copy and trust messaging
- reusable storefront components that should match the house style

## Core rules

- Keep the tone premium, warm, and informed. Never drift into clinical, aggressive, or gimmicky language.
- Prefer proof-led copy over unsupported superlatives.
- Do not write claims like "Europe's #1" or "largest" unless the page already includes a durable, source-backed reason to say it.
- Never hardcode live product or brand counts in copy when a helper already exists.

## Canonical sources

- Live catalog/editorial counts: `src/data/editorial-facts.ts`
- Rewards system: `src/config/rewards.ts`
- Brand + flavor + strength colors: `src/data/brand-colors.ts`
- Product-facing labels: `src/data/product-labels.ts`
- Shared trust facts for risky editorial claims: `src/data/brand-facts.ts`

## Visual direction

- The site should feel polished and premium, but still easy to shop quickly.
- Keep sections airy and readable rather than cramming in novelty.
- Use contrast and hierarchy to guide attention before adding extra decoration.
- Reuse existing semantic tokens and shadcn patterns before inventing one-off styles.

## Copy direction

- Lead with what the shopper gets: range, shipping clarity, rewards, comparison help.
- Keep claims factual and specific.
- When discussing brands, flavours, or manufacturer relationships, prefer conservative wording and attribution if facts may drift over time.
- If a number can vary by market, make that scope explicit.

## Implementation checklist

- Reuse existing data/config imports instead of duplicating labels or counts.
- Preserve mobile usability and avoid adding above-the-fold heaviness without a clear gain.
- If the task touches trust-sensitive copy, check whether `src/data/brand-facts.ts` should be used or updated.
- If the task changes a high-visibility section, sanity-check the result against homepage/rewards/blog voice for consistency.
