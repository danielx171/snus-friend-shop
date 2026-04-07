# ZYN Complete Guide — FAQ Section

Target file: `src/pages/blog/zyn-nicotine-pouches-complete-guide.astro`
Insert before the "Browse ZYN" section (before the H2 at line ~274).

---

## HTML FAQ Section (details/summary format)

```html
<section style="margin-top: 48px; padding-top: 24px; border-top: 1px solid hsl(var(--border));">
  <h2>Frequently Asked Questions About ZYN</h2>

  <details style="margin-top: 16px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
    <summary style="font-weight: 600; cursor: pointer; font-size: 16px;">Where is ZYN made?</summary>
    <p style="margin-top: 12px;">ZYN is made by Swedish Match, now owned by Philip Morris International (PMI). The pouches are manufactured in Sweden and in Owensboro, Kentucky (for the US market). European ZYN products come from Swedish production facilities, which is part of why the brand carries strong credibility — Sweden is the birthplace of oral nicotine.</p>
  </details>

  <details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
    <summary style="font-weight: 600; cursor: pointer; font-size: 16px;">How many ZYN flavours are there?</summary>
    <p style="margin-top: 12px;">The European ZYN range includes approximately 15–20 flavours across mint, citrus, coffee, berry, fruit, and licorice categories. The US range is slightly different. Core European flavours include Cool Mint, Citrus, Espressino, Macchiato, Bellini, Spearmint, Apple Mint, and Violet Licorice. Each flavour is typically available in 2–3 strength levels.</p>
  </details>

  <details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
    <summary style="font-weight: 600; cursor: pointer; font-size: 16px;">What is the strongest ZYN pouch?</summary>
    <p style="margin-top: 12px;">The strongest ZYN available in Europe is ZYN Strong Slim at 9.5 mg per pouch (also labelled as "S4" in some markets). In the US, ZYN goes up to 6 mg per pouch (US labelling differs from European). For context, 9.5 mg is classified as "strong" — heavier users looking for extra-strong (12+ mg) options would need to explore brands like White Fox, LOOP Hyper Strong, or Siberia.</p>
  </details>

  <details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
    <summary style="font-weight: 600; cursor: pointer; font-size: 16px;">Is ZYN better than VELO?</summary>
    <p style="margin-top: 12px;">Neither is objectively better — it depends on what you prioritise. ZYN is known for cleaner, more subtle flavours and a drier pouch that sits invisibly under the lip. VELO offers bolder flavour profiles, moister pouches with faster flavour release, and a wider European range (50+ SKUs vs ZYN's ~20). ZYN is the safe all-rounder; VELO is for users who want more intensity and variety. Read our full <a href="/blog/zyn-vs-velo-2026">ZYN vs VELO comparison</a>.</p>
  </details>

  <details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
    <summary style="font-weight: 600; cursor: pointer; font-size: 16px;">How much nicotine is in a ZYN pouch?</summary>
    <p style="margin-top: 12px;">European ZYN pouches range from 1.5 mg (Mini) to 9.5 mg (Strong Slim) per pouch. Your body absorbs roughly 30–40% of the labelled amount through the gum lining. A 6 mg ZYN delivers approximately 1.8–2.4 mg of absorbed nicotine per session — comparable to one cigarette. The strength tiers are: Mini S1 (1.5 mg), Slim S2 (3 mg), Slim S3 (6 mg), and Strong Slim S4 (9.5 mg).</p>
  </details>

  <details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
    <summary style="font-weight: 600; cursor: pointer; font-size: 16px;">Are ZYNs safe?</summary>
    <p style="margin-top: 12px;">ZYN pouches are substantially less harmful than cigarettes — they contain no tobacco, produce no smoke, and eliminate exposure to tar, carbon monoxide, and the 7,000+ chemicals in cigarette smoke. However, they are not risk-free: nicotine is addictive and has cardiovascular effects (increased heart rate, blood pressure). Common side effects include mild gum irritation and hiccups. ZYN is intended for adult nicotine users, not non-users or people under 18. Read our detailed <a href="/blog/are-zyns-bad-for-you">ZYN health analysis</a>.</p>
  </details>

  <details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
    <summary style="font-weight: 600; cursor: pointer; font-size: 16px;">How long does a ZYN pouch last?</summary>
    <p style="margin-top: 12px;">A ZYN slim pouch typically lasts 25–40 minutes, with noticeable flavour for the first 20–30 minutes. Mini pouches are slightly shorter at 20–30 minutes. ZYN's drier formulation means a slower, more gradual release compared to moister competitors like VELO — many users consider this a strength, as the experience is more even and less prone to "flavour dump" in the first few minutes.</p>
  </details>

  <details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
    <summary style="font-weight: 600; cursor: pointer; font-size: 16px;">What is the most popular ZYN flavour?</summary>
    <p style="margin-top: 12px;">ZYN Cool Mint is the best-selling ZYN flavour worldwide — and it is not close. Cool Mint accounts for an estimated 40–50% of all ZYN sales. Citrus is the second most popular, followed by Spearmint and Espressino. If you are trying ZYN for the first time, Cool Mint in 6 mg Slim is the default recommendation. Browse all options in our <a href="/blog/zyn-flavours-complete-guide">ZYN flavour guide</a>.</p>
  </details>
</section>
```

---

## FAQPage JSON-LD Schema

Insert as `<script type="application/ld+json">` in the frontmatter area alongside the existing BlogPosting schema.

```json
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is ZYN made?","acceptedAnswer":{"@type":"Answer","text":"ZYN is made by Swedish Match, now owned by Philip Morris International (PMI). The pouches are manufactured in Sweden and in Owensboro, Kentucky (for the US market). European ZYN products come from Swedish production facilities."}},{"@type":"Question","name":"How many ZYN flavours are there?","acceptedAnswer":{"@type":"Answer","text":"The European ZYN range includes approximately 15–20 flavours across mint, citrus, coffee, berry, fruit, and licorice categories. Core flavours include Cool Mint, Citrus, Espressino, Macchiato, Bellini, Spearmint, Apple Mint, and Violet Licorice. Each flavour is typically available in 2–3 strength levels."}},{"@type":"Question","name":"What is the strongest ZYN pouch?","acceptedAnswer":{"@type":"Answer","text":"The strongest ZYN available in Europe is ZYN Strong Slim at 9.5 mg per pouch (also labelled as S4 in some markets). For users wanting extra-strong options (12+ mg), brands like White Fox, LOOP Hyper Strong, or Siberia go higher."}},{"@type":"Question","name":"Is ZYN better than VELO?","acceptedAnswer":{"@type":"Answer","text":"Neither is objectively better — it depends on preferences. ZYN is known for cleaner, more subtle flavours and a drier pouch. VELO offers bolder profiles, moister pouches with faster release, and a wider European range (50+ SKUs vs ZYN's ~20). ZYN is the all-rounder; VELO is for users who want more intensity and variety."}},{"@type":"Question","name":"How much nicotine is in a ZYN pouch?","acceptedAnswer":{"@type":"Answer","text":"European ZYN pouches range from 1.5 mg (Mini) to 9.5 mg (Strong Slim) per pouch. Your body absorbs roughly 30–40% of the labelled amount. A 6 mg ZYN delivers approximately 1.8–2.4 mg of absorbed nicotine — comparable to one cigarette."}},{"@type":"Question","name":"Are ZYNs safe?","acceptedAnswer":{"@type":"Answer","text":"ZYN pouches are substantially less harmful than cigarettes — no tobacco, no smoke, no tar. However, nicotine is addictive and has cardiovascular effects. Common side effects include mild gum irritation and hiccups. ZYN is intended for adult nicotine users, not non-users or minors."}},{"@type":"Question","name":"How long does a ZYN pouch last?","acceptedAnswer":{"@type":"Answer","text":"A ZYN slim pouch typically lasts 25–40 minutes, with noticeable flavour for the first 20–30 minutes. Mini pouches last 20–30 minutes. ZYN's drier formulation means a slower, more gradual release compared to moister competitors."}},{"@type":"Question","name":"What is the most popular ZYN flavour?","acceptedAnswer":{"@type":"Answer","text":"ZYN Cool Mint is the best-selling ZYN flavour worldwide, accounting for an estimated 40–50% of all ZYN sales. Citrus is second, followed by Spearmint and Espressino."}}]}
```
