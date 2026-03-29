# Cowork Outputs

Findings and deliverables from Cowork audit sessions. Read these before implementing any design or UX changes.

**Last updated:** 2026-03-29

---

## Audits (10 reports, 8,097 lines)

All from the comprehensive site audit run on 2026-03-29.

| File | What it covers | Key finding |
|------|---------------|-------------|
| `audits/VISUAL_AUDIT_FULL.md` | 27 pages scored 1-10 for visual quality | Average 6.0/10 — functional but generic, needs brand personality |
| `audits/ASTRO_BEST_PRACTICES_AUDIT.md` | Astro 6 config, client directives, images, ISR | Grade A+ — switch 2 islands from client:load to client:idle |
| `audits/SEO_DEEP_AUDIT.md` | JSON-LD, meta tags, sitemap, canonicals, robots | Strong foundation — expand short title tags, add BreadcrumbList |
| `audits/GEO_AUDIT.md` | AI citation testing on 10 queries | Zero citations — need source attribution, unique data assets |
| `audits/GAMIFICATION_AUDIT.md` | Spin wheel, quests, leaderboard, points | 8/10 technical, weak visibility — add points to header + cards |
| `audits/ACCESSIBILITY_AUDIT.md` | Forms, ARIA, contrast, touch targets, keyboard | Form errors not announced, age gate lacks dialog role, 24px buttons |
| `audits/PERFORMANCE_AUDIT.md` | JS bundles, fonts, images, SSG/SSR split | P0: 666KB products.json blocks mobile — needs pagination |
| `audits/COMPETITOR_FEATURE_GAP.md` | Haypp, Northerner, SnusDaddy comparison | Blog gap (0 vs 100+), no multi-currency, gamification is unique edge |
| `audits/CONTENT_STRATEGY_RECS.md` | Top 15 keyword gaps, content roadmap, 10K/mo plan | Target "can you swallow nicotine pouches" (1.5K/mo), publish 3/week |

## Design Reviews

| File | What it covers |
|------|---------------|
| `design-reviews/implementation-plan.md` | 4-sprint plan: First 8 Seconds → Browse Loop → Conversion → Polish |
| `design-reviews/iteration-scores.md` | Scoring history for 13 homepage designs across 4 iterations |
| `design-reviews/site-audit-mockup.html` | Visual before/after mockup for all 15 findings (open in browser) |

## Mockups

| File | What it covers |
|------|---------------|
| `mockups/DESIGN_MOCKUPS_V2.md` | 10 HTML/Tailwind mockups: blog hero, product card, footer, newsletter, etc. |
| `mockups/iteration-4-homepage.html` | Homepage design scoring 9.15/10 — target reference (open in browser) |
| `mockups/iteration-3-homepage.html` | Homepage design scoring 8.95/10 (open in browser) |

## How to use in Claude Code (terminal)

Point Claude at this folder:

```
Read the cowork/README.md and the relevant audit files before making changes.
```

Or for specific work:

```
Read cowork/audits/PERFORMANCE_AUDIT.md and fix the P0 products.json issue.
```

```
Read cowork/mockups/DESIGN_MOCKUPS_V2.md and implement mockup #4 (product card with Save badge).
```

## Priority summary (cross-audit)

**P0 — Fix now:**
- 666KB products.json on /products page (Performance audit)

**P1 — This sprint:**
- Zero AI citations — add source refs + unique data (GEO audit)
- Gamification invisible to visitors — points in header + cards (Gamification audit)
- Form errors not screen-reader announced (Accessibility audit)
- Short title tags on /faq, /about, /rewards (SEO audit)
- Switch OrderQuestTrigger + WishlistIsland to client:idle (Astro audit)

**P2 — Next sprint:**
- Blog content gap vs competitors (Content Strategy)
- Product card redesign with strength dots + ratings (Visual audit + Design mockups)
- Navigation mega menu for desktop (Visual audit)
- Enhanced footer with payment icons (Design mockups)
