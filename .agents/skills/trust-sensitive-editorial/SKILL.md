---
name: trust-sensitive-editorial
description: Use when editing SnusFriend blog posts, brand pages, or comparison pages that touch health, legal, manufacturer, or ownership claims. Covers conservative wording, attribution, reuse of shared brand facts, and when to add trust callouts instead of stronger unsupported claims.
---

# Trust-Sensitive Editorial

Use this skill for YMYL-style content on SnusFriend, especially:
- health and safety articles
- legal/regulation pages
- brand ownership or manufacturer claims
- comparison pages that could overstate evidence

## Core rules

- Prefer precise, conservative wording over punchy claims.
- Do not present medical, legal, or manufacturer facts as timeless if they may drift.
- If a claim is not strong enough to stand without a source, weaken the claim or attribute it.
- Avoid writing copy that sounds like medical advice.

## Canonical sources

- `src/data/brand-facts.ts`
- `src/components/astro/BrandFactCallout.astro`
- `src/data/editorial-facts.ts` for counts and catalog facts

## Implementation checklist

- Reuse `brand-facts` instead of scattering ownership/manufacturer facts across pages.
- Add `BrandFactCallout` when a page needs a visible attribution or uncertainty note.
- Keep commercial bridges factual and low-pressure on health/legal pages.
- If the repo docs say a trust pass is still open, note the remaining uncertainty in the handoff.
