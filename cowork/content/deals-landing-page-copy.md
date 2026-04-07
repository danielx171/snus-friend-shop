# /deals Landing Page — Copy

> For Claude Code to implement as `src/pages/deals.astro`
> SSG page, no React islands needed. Newsletter signup form is the only interactive element
> (reuse existing newsletter nanostore / Klaviyo integration).

---

## SEO Meta

```
title: "Discount Codes & Deals | SnusFriend"
description: "Find active SnusFriend discount codes, learn how to use them, and sign up for exclusive deals on nicotine pouches. New subscriber codes available."
```

## Breadcrumb
`Home > Deals & Discounts`

---

## Hero Section

**Headline:** Deals & Discount Codes

**Subheadline:** Save on your favourite nicotine pouches. We share codes through our newsletter, seasonal promotions, and loyalty rewards — here's everything you need to know.

---

## Section 1: How Discount Codes Work

**Heading:** How to use a discount code

Using a code takes about five seconds. During checkout, click **"Have a discount code?"** in your order summary. Enter your code, press Apply, and the discount is deducted from your total before you pay. That's it.

A few details worth knowing: only one code can be used per order, codes aren't case-sensitive (typing "welcome10" works the same as "WELCOME10"), and some codes have a minimum order value or an expiry date. If a code isn't working, check for typos first — then check whether it's still within its valid period.

---

## Section 2: Where to Find Codes

**Heading:** Where to find discount codes

**Newsletter (most reliable):**
Subscribers get early access to promotions and exclusive codes that aren't shared anywhere else. New subscribers receive a welcome discount. It's the single best way to save.

**Seasonal promotions:**
We run occasional site-wide deals tied to events, new brand launches, or stock clearances. These are announced on the homepage and in the newsletter.

**Loyalty rewards:**
As you shop and engage with the community, you earn SnusPoints. Higher tiers unlock better perks — including exclusive vouchers for Legend-tier members. Check your [rewards progress](/rewards) to see where you stand.

**Social media:**
We occasionally drop flash codes on our social channels. Follow us to catch them.

---

## Section 3: Newsletter Signup CTA

**Heading:** Get your first discount code

**Body:** Sign up for the SnusFriend newsletter and we'll send you an exclusive welcome code. No spam — just deals, new arrivals, and the occasional flavour recommendation.

**Email input placeholder:** Your email address

**Button text:** Get My Code

**Fine print:** We send 1–2 emails per month. Unsubscribe anytime. See our [privacy policy](/legal/privacy).

---

## Section 4: FAQ (collapsed accordion)

**Heading:** Common questions about discounts

**Q: Can I use more than one code per order?**
No — one code per order. If you have multiple codes, use the one with the biggest discount and save the others for next time.

**Q: My code isn't working. What do I do?**
Check for typos first. Then check whether the code has expired or requires a minimum order value. Some codes exclude certain products or brands. If it still doesn't work, [contact us](/contact) and we'll take a look.

**Q: Do codes work on all products?**
Most codes apply to the full catalogue, but some are brand-specific or exclude limited-edition items. The terms are shown when you receive the code.

**Q: How often do you release new codes?**
It varies — newsletter subscribers are always the first to know. We don't run constant sales (our prices are already competitive), but we do share codes regularly through the newsletter and seasonal promotions.

---

## JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Deals & Discount Codes",
  "description": "Find active SnusFriend discount codes, learn how to use them, and sign up for exclusive deals on nicotine pouches.",
  "url": "https://snusfriends.com/deals",
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I use more than one discount code per order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, only one code per order. Use the one with the biggest discount and save the others for next time."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use a discount code at SnusFriend?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "During checkout, click 'Have a discount code?' in the order summary. Enter your code, press Apply, and the discount is deducted from your total."
        }
      }
    ]
  }
}
```

---

## Design Notes

- Layout: Same as `/rewards` — clean, sectioned, with subtle background colour blocks
- Newsletter form: Reuse existing `newsletter-signup` component / Klaviyo integration
- Accordion FAQ: Reuse FAQ accordion pattern from `/faq`
- No product listings on this page — it's informational, not a shop page
- Internal links to `/rewards`, `/products`, `/contact`, `/legal/privacy`, `/faq`
