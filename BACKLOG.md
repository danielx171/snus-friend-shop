# SnusFriend Backlog

**Last updated:** 2026-04-13
**Single source of truth** for open work. Reconstructed from CURRENT_PRIORITIES, MASTER_PLAN, AUDIT_FIX_LIST, and the Apr 11 Codex coverage map after the web ultraplan session was lost.

## How to read this

Each item has an owner tag and a priority tier:

| Tag | Meaning |
|-----|---------|
| 🧠 | Claude Code can do alone — code change in this repo |
| 👤 | Daniel must do — secrets, UI, account creation, decisions |
| ✍️ | Cowork deliverable — copy, research, legal, audit |
| 🔌 | External service or 3rd party — Klaviyo UI, solicitor, Trustpilot, etc. |

Priority tiers:

- **P0** — launch-critical or revenue-blocking. Top of every session.
- **P1** — active build work. SEO growth + conversion polish.
- **P2** — trust, tech debt, polish. Ship when P0/P1 has headroom.
- **P3** — strategic / future. Revisit after the site hits revenue floor.

---

## P0 — Launch-critical

### Secrets + infra (all 👤 Daniel)

- [ ] 👤 Set `RESEND_API_KEY` in Supabase Vault — without it customers get **no** order confirmation emails
- [ ] 👤 Set `DEEPSEEK_API_KEY` — powers AI review summaries (optional but wired)
- [ ] 👤 Set `DISCORD_WEBHOOK_REVIEWS` — review channel alerts
- [ ] 👤 Set `DISCORD_WEBHOOK_ACHIEVEMENTS` — achievement channel alerts
- [ ] 👤 Enable Leaked Password Protection (Supabase → Auth → Settings)
- [ ] 👤 Set `app_metadata.role = 'admin'` for ops users → unblocks ops dashboard
- [ ] 👤 UptimeRobot: add Vercel prod (10 min) + Supabase healthcheck (5 min) + email alerts

### Email automation (🔌 Klaviyo UI + 🧠 code)

- [ ] 🔌 Wire Welcome flow in Klaviyo → template `WjBd5j` (trigger: Added to List)
- [ ] 🔌 Wire Abandoned Cart flow → template `W86scz` (trigger: Started Checkout, no Placed Order 1h)
- [ ] 🔌 Wire Post-Purchase flow → template `SC7bys` (trigger: Placed Order, +7d review, +14d cross-sell)
- [ ] 🔌 Wire Browse Abandonment flow → template `UELQ82` (trigger: Viewed Product, no purchase 24h)
- [ ] 🔌 Wire Win-Back flow → template `SQjWt2` (trigger: 60d since last Placed Order)
- [ ] 🧠 Add Klaviyo JS snippet to `src/layouts/Base.astro` once 👤 provides public key
- [ ] 🧠 POST Klaviyo "Placed Order" + "Started Checkout" + "Viewed Product" events from `create-nyehandel-checkout`
- [ ] 🧠 Connect `save-waitlist-email` → Klaviyo profile-subscription-bulk-create-jobs API

### Trust + legal

- [ ] 🔌 Solicitor sign-off on `/terms`, `/privacy`, `/cookies`
- [ ] 👤 Trustpilot business profile + footer widget (~20 min account creation; paste embed code and I'll wire it)

### Launch verification (👤 Daniel, one real run each)

- [ ] 👤 End-to-end checkout: add → pay via Nyehandel → verify order row + email + webhook
- [ ] 👤 End-to-end newsletter signup: footer form → verify row in `waitlist_emails` / `newsletter_subscribers`
- [ ] 🧠 Daily smoke-check script: cart flow, theme persistence, Sentry fresh issues, PageSpeed `/` + `/nicotine-pouches`

---

## P1 — Active build

### SEO growth (🧠 Claude can start; ✍️ where noted)

- [ ] 🧠 Expand `editorial-facts.ts` usage — kill drifting "700+", "35+ brands", "55+ brands" phrases across articles
- [ ] ✍️ Close Quick Answer gaps (58/80 → 80/80) — brief: `cowork/content/BRIEF-COWORK-BATCH4-QUICK-ANSWERS-REVISED.md`
- [ ] ✍️ Add formal Sources sections (10/80 today) + authority links (28/80) — brief: `cowork/content/BRIEF-COWORK-SOURCES-AUTHORITY.md`
- [ ] 🧠 Normalize blog visible date formatting (mixed across articles today)
- [ ] 🧠 Add `dateModified` to `nicotine-pouch-trends-new-brands-2026` + `nicotine-pouches-vs-gum-vs-lozenges`
- [ ] 🧠 Schema-shape cleanup on 5 flagged articles: `best-nicotine-pouches-no-aftertaste`, `best-strong-nicotine-pouches`, `how-much-do-nicotine-pouches-cost`, `how-to-store-nicotine-pouches`, `klar-vs-fumi-2026`
- [ ] 🧠 Product meta descriptions — 548 PDPs over 155 chars; template fix, not manual edits
- [ ] 🧠 Brand/PDP indexation — `/brands/zyn` + sampled PDPs unknown to Google; fix internal-link discovery + resubmit GSC
- [ ] 🧠 PDP non-descriptive link audit — sampled PDP scored 92 SEO due to link text
- [ ] ✍️ Title CTR refresh on low-CTR GSC pages — awaiting Codex GSC list

### Conversion / UX (🧠)

- [ ] 🧠 Homepage LCP 82 → 90+ (~4s → <2.5s) — profile element, defer non-critical islands
- [ ] 🧠 Logged-in account performance — tab-aware SSR, pass known user/session into islands, defer referral widgets
- [x] 🧠 `products.json` slim — Apr 13 measured: 241KB uncompressed, **39.5KB gzipped**. Vercel serves gzipped by default. Shortening keys would save ~22KB gzipped but breaks 3 React consumers for invisible user benefit. Closed — target was based on uncompressed size, which doesn't matter over the wire.
- [ ] ✍️ Homepage copy refresh — awaiting `cowork/content/homepage-copy-variations.md`
- [x] 🧠 Blog read-time field on cards — `getReadTime(slug)` helper + tag-based heuristic; renders on all blog cards (74/74).
- [ ] 🧠 Blog product-card relevance audit — many articles now use cards; check intent match article-by-article
- [ ] 🧠 Brand page real logos — monogram placeholder fallback live; need real asset integration per brand

---

## P2 — Trust, tech debt, polish

### Content + editorial (✍️)

- [ ] ✍️ Medical reviewer framework — brief: `cowork/content/BRIEF-COWORK-MEDICAL-REVIEW-FRAMEWORK.md` (no fictional clinician)
- [ ] ✍️ Finland/Norway legal reconciliation — brief: `cowork/content/BRIEF-COWORK-LEGAL-RECONCILIATION.md`
- [ ] ✍️ OG image design specs — brief: `cowork/content/BRIEF-COWORK-OG-IMAGE-SPECS.md`

### Observability (🧠)

- [ ] 🧠 Sentry sweep — Apr 13 only 1 unresolved issue left (`SNUSFRIENDS-A` React hydration "early update" warning, 1 user, 1 event); investigate which island mutates state pre-hydration. Tag future deploys with release version.
- [ ] 🧠 Sync `supabase/config.toml` JWT settings — 3 ops functions (`ops-users`, `ops-set-role`, `ops-webhook-inbox`) marked false in config but deployed true

### Bundle + perf (🧠)

- [x] 🧠 `lucide-react` — Apr 13 verified: 37MB is install-only; Rollup already tree-shakes named imports into per-icon chunks (see `chevron-up.weO0KTtv.js` etc.). Bundle size unchanged when tested with deep-imports. Closed — no action needed.
- [x] 🧠 `framer-motion` — Apr 13 verified: already in its own chunk (120KB), loaded only by AchievementGridIsland + SpinWheelIsland. Homepage doesn't load it. Closed — no action needed.
- [ ] 🧠 Image optimization — Astro `<Image>` for WebP/AVIF, responsive srcset, blur placeholder

### Duplication cleanup (🧠, from Apr 12 audit)

- [ ] 🧠 `makeToggle` helper dedup — currently duplicated in `register.astro` + `update-password.astro`
- [ ] 🧠 `escapeHtml` dedup — reimplemented in 3 edge functions (`email-templates.ts`, `send-email`, `contact-form`)
- [ ] 🧠 `src/lib/api.ts` — migrate `VITE_*` envs → `PUBLIC_*` (Astro 6 convention)
- [x] 🧠 Blog count drift — reconciled: 81 articles, 81 registry slugs (actually in sync; old docs were stale)

### Type + lint (🧠)

- [ ] 🧠 Fix `bun run lint` — 6 errors in `scripts/generate-og-images.ts`
- [ ] 🧠 Fix `bun run check` — 67 errors (Astro.locals typing gap)

### Brand polish (🧠)

- [ ] 🧠+✍️ Brand pages visual identity — current monogram fallback (gradient + Space Grotesk initials) is the right "cheap" treatment. Upgrade path needs real SVG logos (not in `public/brand-logos/`). Track as Cowork asset sourcing.
- [ ] 🧠 Exit-intent offer on PDP/cart (low-friction; not a persistent blocker)

---

## P3 — Strategic / future

### Commerce

- [ ] 🧠 Multi-currency (SEK, GBP, DKK, NOK, PLN) — competitors all have this
- [ ] 🧠 Membership tiers (Bronze→Silver→Gold→Platinum) — `points_balances.lifetime_earned` already drives the calculation
- [ ] 🧠 Subscription model — DB + edge function scaffolding retained (`subscriptions` table, `manage-subscription`, `process-subscriptions` cron). UI gated off via `rewards.subscriptions.enabled = false` in `src/config/rewards.ts` because NYE is hosted-checkout only — true auto-orders need a payment-rail decision (Stripe recurring / Adyen tokenization / NYE merchant-initiated). One-flag flip to revive once the rail is chosen.
- [ ] 🧠 Sample / trial packs (Northerner + Nicokick have this)

### Retention + reviews

- [x] 🧠 Review incentivization — 50 SnusCoins per review (one-per-product idempotency via `review_rewards` ledger + `award-review-reward` edge fn). 14-day follow-up reminder still pending (P2 follow-up).
- [x] 🧠 "Be the first to review" CTA on unreviewed products — renders on PDPs with `p.ratings === 0`.
- [x] 🧠 Compare button on product cards — `$compareIds` nanostore (max 4) + `CompareToggleButton` on every card + `HeaderCompareBadge` count link to `/compare`.

### Content expansion

- [ ] ✍️ Video content — 15–30s product unboxing/review clips on brand pages (opportunity gap across all retailers)
- [ ] ✍️ Country-specific guides — Germany, Poland, Austria (300–500/mo each)
- [ ] ✍️ Backlink outreach — 30+ targets: harm-reduction orgs, EU health/science publications, tobacco-harm-reduction blogs, university researchers

### Internationalisation

- [ ] 🧠 `hreflang` for DE / SV translations

### Architecture + ops

- [ ] 🧠 White-label multi-brand architecture (3–6 months; DEPLOYMENT_CHECKLIST.md already has spin-up flow)
- [ ] 🧠 Community seeding — `community_posts`, `product_reviews`, `referral_codes`, `flavor_profiles` tables empty
- [ ] 🧠 Ops dashboard migration review — queues/alerts UI polish
- [ ] 🧠 Check auto-generated `blog_posts` for duplicate content with hand-written `.astro` articles

### Tooling (👤)

- [ ] 👤 Ahrefs / Brand Radar MCP (AI citation + backlink tracking)
- [ ] 👤 Screaming Frog EULA + full crawl
- [ ] 👤 Figma MCP integration (next visual sprint)
- [ ] 🧠 `alert-manager` + `rank-tracker` skill activation
- [ ] 🧠 `memory-management` skill activation

---

## Blocked / awaiting

| Item | Blocked on | Priority |
|------|-----------|----------|
| All Klaviyo flows (5) | 👤 Daniel + 🔌 Klaviyo UI click-through | P0 |
| Klaviyo JS snippet + events | 👤 Daniel public/private API keys | P0 |
| Trustpilot widget | 👤 Daniel account + embed code | P0 |
| Solicitor legal sign-off | 🔌 External legal review | P0 |
| Title CTR refresh | ✍️ Codex GSC low-CTR list | P1 |
| Homepage copy | ✍️ `homepage-copy-variations.md` | P1 |
| Quick Answer gap close | ✍️ BATCH4-QUICK-ANSWERS-REVISED | P1 |
| Sources/authority links | ✍️ SOURCES-AUTHORITY brief | P1 |
| Medical reviewer framework | ✍️ MEDICAL-REVIEW-FRAMEWORK | P2 |
| FI/NO legal reconciliation | ✍️ LEGAL-RECONCILIATION | P2 |
| OG image specs | ✍️ OG-IMAGE-SPECS | P2 |
| Video content | ✍️ Production effort | P3 |
| Backlink outreach | ✍️ Cowork + 🔌 outreach | P3 |

Everything not in this table is unblocked — Claude can start immediately.

---

## Sources

- `CURRENT_PRIORITIES.md` (Apr 13 refresh)
- `ROADMAP.md` (Steps 1–56 done)
- `MASTER_PLAN.md` (Mar 30)
- `AUDIT_FIX_LIST.md` (Mar 30, superseded — kept for Klaviyo wiring specifics)
- `cowork/content/codex-audit-coverage-map-apr11.md` (latest consolidated Codex view)
- `cowork/content/codex-site-wide-audit-apr10-evening.md`
- `cowork/content/codex-full-tool-audit-apr10.md`
- Apr 12 duplication audit (in-session, committed as `9ecc6985`)
