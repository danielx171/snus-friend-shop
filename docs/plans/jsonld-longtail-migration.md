# JSON-LD Long-Tail Migration — Write Plan

**Status:** Plan only. No edits yet.
**Owner:** Claude Code (review), Codex (execute)
**Date:** 2026-04-15

## Context

Codex already shipped `src/components/astro/JsonLd.astro` (commit `1b7640be`) and migrated 10 high-traffic pages:
- `src/pages/index.astro`, `about.astro`, `community.astro`, `rewards.astro`
- `src/pages/nicotine-pouches.astro`, `products/[slug].astro`, `products/index.astro`
- `src/pages/brands/index.astro`, `brands/[slug].astro`
- `src/components/astro/Breadcrumb.astro`

Remaining: **101 files** with **189 inline `<script type="application/ld+json">` blocks**. Grep counts vary 1–3 per file.

The helper signature:
```tsx
<JsonLd data={schema} />             // single schema
<JsonLd items={[schema1, schema2]} /> // multiple schemas (rendered in array order)
```
Internally iterates and emits `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />`.

## Distribution (by number of inline scripts)

| Count | Files | Type |
|-------|-------|------|
| 1 | ~14 | Info/utility pages (single schema, sometimes via variable) |
| 2 | ~83 | Blog articles (BlogPosting + FAQPage) + a few info pages |
| 3 | 4 | How-to blog articles (BlogPosting + FAQPage + HowTo) |

---

## Batches

### Batch A — Pilot (2 files, lowest risk)

Already-extracted variables — near-zero semantic change, pure structural refactor:

1. `src/pages/nicotine-free-pouches.astro` — `webPageJsonLd` + `faqJsonLd` variables already defined. Textbook `<JsonLd items={[webPageJsonLd, faqJsonLd]} />`.
2. `src/pages/authors/erik-lindqvist.astro` — single `personSchema` variable. One-liner `<JsonLd data={personSchema} />`.

**Why first:** Zero inline object literals, trivial diff, easy to verify byte-for-byte.
**Gate:** Run `bun run check && bun run build`, diff `dist/` output for these two pages — rendered HTML should be identical except for the new `is:inline` attribute on the script tag (that's expected and preferred).

---

### Batch B — Single-schema info pages (14 files)

All emit exactly one JSON-LD block. Most still have inline object literals.

**B1 — Variables already extracted (easy):**
- `src/pages/countries/[slug].astro` — uses `jsonLd` var
- `src/pages/brands/[slug]/review.astro` — uses `jsonLd` var
- `src/pages/brands/[slug]/flavours.astro` — uses `jsonLd` var
- `src/pages/brands/[slug]/strengths.astro` — uses `jsonLd` var
- `src/pages/products/strength/[key].astro` — uses `jsonLd` var
- `src/pages/products/flavor/[key].astro` — uses `jsonLd` var

**B2 — Inline object literal, needs lift-to-frontmatter:**
- `src/pages/compare.astro` (WebPage)
- `src/pages/faq.astro` (FAQPage, placed deep in markup)
- `src/pages/beginners.astro`
- `src/pages/deals.astro`
- `src/pages/referral.astro`
- `src/pages/editorial-policy.astro`
- `src/pages/nicotine-pouch-brands-compared.astro`
- `src/pages/nicotine-pouch-flavours.astro`
- `src/pages/nicotine-strength-chart.astro`

**Convention for B2:** lift the inline `{...}` into a const named after the schema type (`const faqJsonLd = {...}`) in frontmatter, then render `<JsonLd data={faqJsonLd} />` in the same spot. Don't reorder relative to markup.

---

### Batch C — Blog BlogPosting + FAQPage (~77 files)

The bulk of the work. Same pattern everywhere:
```tsx
<script type="application/ld+json" set:html={JSON.stringify({ @type: "BlogPosting", ... })} />
<script type="application/ld+json" set:html={JSON.stringify({ @type: "FAQPage", ... })} />
```

Split by category to limit blast radius per commit:

**C1 — VS / comparison articles (~15):**
`zyn-vs-loop-2026`, `zyn-vs-skruf-2026`, `zyn-vs-velo-2026`, `zyn-vs-nordic-spirit`,
`velo-vs-loop-2026`, `velo-vs-nordic-spirit`, `velo-vs-on-nicotine-pouches`,
`loop-vs-skruf`, `klar-vs-fumi-2026`, `white-fox-vs-siberia-2026`,
`nicotine-pouches-vs-cigarettes`, `nicotine-pouches-vs-vaping`, `nicotine-pouches-vs-snus`,
`nicotine-pouches-vs-gum-vs-lozenges`, `switching-from-cigarettes-to-nicotine-pouches`

**C2 — Brand complete guides (~14):**
`zyn-nicotine-pouches-complete-guide`, `velo-nicotine-pouches-complete-guide`,
`on-nicotine-pouches-complete-guide`, `nordic-spirit-nicotine-pouches-complete-guide`,
`loop-nicotine-pouches-complete-guide`, `skruf-nicotine-pouches-complete-guide`,
`white-fox-nicotine-pouches-complete-guide`, `siberia-nicotine-pouches-complete-guide`,
`klar-nicotine-pouches-complete-guide`, `fumi-nicotine-pouches-complete-guide`,
`iceberg-nicotine-pouches-complete-guide`, `pablo-nicotine-pouches-complete-guide`,
`velo-flavours-complete-guide`, `zyn-flavours-complete-guide`

**C3 — "Best" listings (~20):**
`best-nicotine-pouches-2026`, `best-budget-nicotine-pouches`, `best-value-nicotine-pouches-2026`,
`best-strong-nicotine-pouches`, `best-slim-nicotine-pouches`, `best-mint-nicotine-pouches-2026`,
`best-berry-nicotine-pouches`, `best-citrus-nicotine-pouches`, `best-coffee-nicotine-pouches`,
`best-nicotine-pouches-all-day-use`, `best-nicotine-pouches-for-beginners-2026`,
`best-nicotine-pouches-for-quitting-smoking`, `best-nicotine-pouches-for-women`,
`best-nicotine-pouches-germany-2026`, `best-nicotine-pouches-netherlands-2026`,
`best-nicotine-pouches-sensitive-gums`, `best-nicotine-pouches-under-2-euros`,
`best-nicotine-pouches-gym-sports`, `best-nicotine-pouches-no-aftertaste`,
`best-nicotine-pouches-by-occasion`, `best-nicotine-pouches-uk-2026`,
`healthiest-nicotine-pouches-2026`, `strongest-nicotine-pouches-ranked-2026`,
`strongest-snus-brands-compared-beginners-warning`, `top-10-mint-flavours`,
`all-velo-flavors-ranked-2026`

**C4 — "Buying in [country]" articles (6):**
`buying-nicotine-pouches-norway-2026`, `buying-nicotine-pouches-finland-2026`,
`buying-nicotine-pouches-denmark-2026`, `buying-nicotine-pouches-austria-2026`,
`buying-nicotine-pouches-poland-2026`, `nicotine-pouches-legal-europe-2026`

**C5 — Everything else (educational / single-topic):**
`are-nicotine-pouches-safe`, `are-zyns-bad-for-you`, `can-you-swallow-nicotine-pouches`,
`how-long-do-nicotine-pouches-last`, `how-many-nicotine-pouches-a-day`,
`how-much-do-nicotine-pouches-cost`, `how-to-choose-your-strength`,
`nicotine-pouch-flavour-guide`, `nicotine-pouch-ingredients-explained`,
`nicotine-pouch-side-effects`, `nicotine-pouch-subscription-guide`,
`nicotine-pouch-tax-regulations-2026`, `nicotine-pouch-trends-new-brands-2026`,
`nicotine-reduction-guide` (info page, 2 schemas — belongs here too),
`rave-nicotine-pouches-review`, `what-are-nicotine-pouches`,
`zyn-strength-chart-every-level-explained`

**Convention for C:** Extract each inline literal into named consts (`const blogPostingJsonLd = {...}; const faqJsonLd = {...}`) in frontmatter, then one `<JsonLd items={[blogPostingJsonLd, faqJsonLd]} />` in the same head-adjacent position.

---

### Batch D — How-To articles (4 files, highest structured-data risk)

Three schemas, order matters, HowTo specifically triggers rich result carousels:

- `src/pages/blog/how-to-use-nicotine-pouches.astro` — HowTo + FAQPage + BlogPosting
- `src/pages/blog/how-to-store-nicotine-pouches.astro` — HowTo + BlogPosting + FAQPage
- `src/pages/blog/how-to-spot-fake-nicotine-pouches.astro` — HowTo + BlogPosting + FAQPage (uses `tenant.name`/`tenant.domain`)
- `src/pages/blog/how-to-choose-your-strength.astro` — HowTo + BlogPosting + FAQPage (uses `tenant`)

**Why last:** Three schemas per file, some already reference `tenant` computed values in object literals. Want the rhythm from A/B/C before touching these.
**Extra check:** Run Google Rich Results Test on the deployed URL for each file (or at minimum on `how-to-use-nicotine-pouches`) before shipping.

---

### Separate pass — blog/index.astro

Leave out of this sweep:
- `src/pages/blog/index.astro` already uses a computed `blogJsonLd` variable + an inline FAQPage literal at the bottom. Migration is easy but this is the highest-traffic non-homepage route. Ship on its own commit with manual verification on the deployed preview.

---

## Order of migration

1. **Batch A** (2 files) — pilot. `bun run check && bun run build`. Eyeball `dist/blog/...` HTML for byte-level equivalence (except `is:inline` attr).
2. **Batch B1** (6 files) — vars-already-extracted. Build + check.
3. **Batch B2** (9 files) — inline literals lifted to frontmatter. Build + check. Pick 2 pages, diff rendered HTML.
4. **Batch C1** (VS, 15) — build + check. Google Rich Results Test on 2 sample URLs on preview deploy.
5. **Batch C2** (brand guides, 14) — build + check.
6. **Batch C3** (best listings, 20) — build + check. Consider splitting C3 into C3a/C3b if one commit feels too big.
7. **Batch C4** (country buying, 6) — build + check.
8. **Batch C5** (educational, ~22) — build + check.
9. **Batch D** (how-to, 4) — build + check + Rich Results Test on all 4.
10. **Separate commit:** `blog/index.astro`.

Each batch = its own commit so revert stays surgical. Commit message format: `refactor(schema): migrate batch B2 to JsonLd helper (9 files)`.

---

## Leave alone (don't touch in this sweep)

- `src/pages/blog/index.astro` — high-traffic, do as standalone commit (see above).
- `src/components/astro/JsonLd.astro` — the helper itself.
- `src/components/astro/Breadcrumb.astro` — already uses the helper internally.
- `src/components/astro/SEO.astro` — if it emits JSON-LD internally (check), leave for a later layout pass.
- Any page currently in `WORK_IN_PROGRESS.md` from Codex (re-check at start of each batch).

---

## Regressions & risks

1. **Schema order** — Google caches and surfaces schemas; keep exact current order per file (first inline tag → items[0]). The helper renders in array order. If we reorder accidentally, rich result behavior may change for a few hours until re-crawl.
2. **`is:inline` attribute** — the helper adds it; inline scripts don't have it. This is a **net improvement** (prevents Astro from treating the `<script>` as a module entry point) and doesn't affect crawlers. But it does change the rendered HTML slightly. Document this in the commit message so anyone diffing prod assets doesn't panic.
3. **Placement relative to markup** — some files put FAQ schema deep in the body. Preserving exact placement is safer than moving to `<head>` in this sweep. Let that be its own optimization pass later.
4. **Double-wrapping** — passing `data={[...]}` instead of `items={[...]}` would wrap the array inside a single `<script>` tag as a JSON array — invalid for Google. The helper handles arrays in `data` by spreading (line 11 of `JsonLd.astro`), so it's actually safe — but convention is: single schema → `data`, multiple → `items`. Enforce in review.
5. **`tenant` references inside inline literals** — some how-to articles reference `tenant.name`, `tenant.domain` inside the object. Lifting these to frontmatter preserves evaluation timing (still at render time). No risk.
6. **Whitespace / key order in JSON output** — `JSON.stringify(obj)` is deterministic for key order at the top level (insertion order). If anyone re-formats an object during extraction and changes insertion order, the JSON output changes (still valid, but diff noise). Ask Codex to preserve key order exactly when lifting inline literals.
7. **`@astrojs/check` hint count** — Codex reported hints went 252 → 235 after the first 10-page migration. Expect another drop after this sweep. If hints *rise*, we broke something.
8. **CHANGELOG.md/CHANGELOG.md nested-directory bug** — unrelated, but visible in Codex's last commit. Flag for a separate cleanup task.
9. **WORK_IN_PROGRESS.md is missing** — we created it in the coordination pass but it doesn't exist in the repo now. Either Codex swept it up or it was never committed. Recreate before starting Batch A so both AIs can log progress.

---

## Verification per batch

```bash
git status --short                          # no unrelated drift
bun run lint                                # no new warnings on touched files
bun run check                               # hints should be flat or falling
bun run build                               # clean build
# On a random sample from the batch:
grep -c 'application/ld+json' dist/<path>.html   # count should match pre-migration
```

Before Batch D (how-to):
- `npx vercel` preview deploy
- Paste preview URL into https://search.google.com/test/rich-results for each how-to page
- Confirm HowTo carousel + FAQ render previews are intact

---

## Exact files for Batch A (start here)

1. `src/pages/nicotine-free-pouches.astro`
2. `src/pages/authors/erik-lindqvist.astro`

That's it. Small, boring, safe. Once it builds clean, the rest follows the same pattern.
