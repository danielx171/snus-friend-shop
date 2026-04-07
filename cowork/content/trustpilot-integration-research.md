# Trustpilot Integration Research

> For Daniel's decision + Claude Code implementation
> Last updated: 2026-03-31

---

## Summary & Recommendation

**Start with the Free plan.** It gives us a claimed profile, basic widget, and the ability to collect organic reviews. Move to Plus ($259/mo) only after we have enough order volume to justify 200 automated invitations/month. The free plan is genuinely useful — don't skip it thinking we need to pay to get value.

---

## Plans & Pricing (as of March 2026)

| Plan | Monthly Cost | Annual Cost | Key Features |
|------|-------------|-------------|--------------|
| **Free** | $0 | $0 | Claim profile, basic widget, respond to reviews, profile page |
| **Plus** | $259/mo | $3,108/yr | 200 auto-invitations/mo, 8 TrustBox widgets, 3 user accounts, review reminders |
| **Premium** | $629/mo | $7,548/yr | More invitations, product reviews, advanced widgets, analytics |
| **Advanced** | $1,059/mo | $12,708/yr | Full API access, custom integrations, priority support |

**Key gotchas:**
- All paid plans require **12-month commitment, paid annually** — no month-to-month
- Billing is **per domain** — snusfriends.com is one domain, so one plan covers us
- Most users on G2/Capterra describe pricing as "expensive" for small businesses
- The jump from Free → Plus is the steepest value gap; after that, each tier adds incrementally

---

## What the Free Plan Gets Us

1. **Claimed business profile** at trustpilot.com/review/snusfriends.com
2. **Basic TrustBox widget** — can embed a simple star rating + review count on the site
3. **Respond to reviews** — manage reputation publicly
4. **Organic review collection** — customers can find and review us on Trustpilot without invitations
5. **Google Seller Ratings** — once we hit 100+ reviews, star ratings can appear in Google Ads (if we ever use them) and organic search results

**What Free does NOT include:**
- No automated review invitations (customers must find Trustpilot themselves)
- Only 1 basic widget (Plus gets 8 types)
- No product reviews (only service reviews)
- No analytics/insights

---

## What the Plus Plan Adds

1. **200 automated review invitations per month** — triggered by API or email after order delivery
2. **8 TrustBox widget types** — including Mini, Micro, Carousel, Grid, and Product widgets
3. **Review reminders** — auto follow-up if customer doesn't review (adds ~35% more reviews)
4. **3 user accounts** for the team
5. **Basic review insights** — sentiment, response rate

**At our current volume:** With ~50-100 orders/month initially, 200 invitations is plenty. The automated invitations are the main reason to upgrade — organic collection alone is very slow.

---

## Widget Implementation (TrustBox)

### How It Works

Trustpilot provides two code snippets:

1. **Bootstrap script** (goes in `<head>`, once per site):
```html
<!-- Trustpilot Bootstrap -->
<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
```

2. **Widget HTML** (goes wherever you want the widget):
```html
<!-- TrustBox widget - Micro Review Count -->
<div class="trustpilot-widget" data-locale="en-GB" data-template-id="TEMPLATE_ID" data-businessunit-id="YOUR_BU_ID" data-style-height="24px" data-style-width="100%" data-theme="dark">
  <a href="https://www.trustpilot.com/review/snusfriends.com" target="_blank" rel="noopener">Trustpilot</a>
</div>
```

### For Astro/React Implementation

Since we use Astro with React islands:
- Add the bootstrap script to the `<head>` in the Astro layout (`src/layouts/Shop.astro`)
- Place TrustBox divs in Astro pages (they're plain HTML — no React needed)
- For SPAs/dynamic content: call `window.Trustpilot.loadFromElement()` when TrustBox elements mount dynamically

### Recommended Widget Placements

| Location | Widget Type | Purpose |
|----------|------------|---------|
| **Homepage hero** (trust bar area) | Micro Review Count | Social proof at first impression |
| **Footer** (all pages) | Mini | Persistent trust signal |
| **Product pages** | Micro Star | Reinforce trust near Add to Cart |
| **Checkout page** | Micro Review Count | Reduce abandonment anxiety |
| **About page** | Review Carousel | Full review display |

---

## Review Invitation Flow

### Free Plan (Manual/Organic)
- Customers find Trustpilot themselves (via footer widget link, email signature, etc.)
- We can add a link in our order confirmation email: "Rate your experience on Trustpilot"
- Slow but costs nothing

### Plus Plan (Automated via API)

**Trigger:** After order ships (delivery callback confirms shipment)

**Flow:**
1. `nyehandel-delivery-callback` fires when order ships
2. New edge function (or addition to existing) calls Trustpilot Invitation API
3. Trustpilot sends branded review invitation email to customer
4. Customer clicks → writes review on Trustpilot
5. Reminder email sent automatically if no review after X days (+35% response rate)

**API endpoint:**
```
POST https://invitations-api.trustpilot.com/v1/private/business-units/{businessUnitId}/email-invitations
```

**Headers:**
```
Authorization: Bearer {API key from Trustpilot}
Content-Type: application/json
```

**Payload:**
```json
{
  "consumerEmail": "customer@email.com",
  "consumerName": "Daniel",
  "referenceId": "NB12345",
  "locale": "en-GB",
  "senderEmail": "noreply@snusfriends.com",
  "senderName": "SnusFriend",
  "replyTo": "support@snusfriends.com",
  "templateId": "TEMPLATE_ID",
  "redirectUri": "https://snusfriends.com",
  "tags": ["order"],
  "preferredSendTime": "2026-04-03T10:00:00Z"
}
```

**`preferredSendTime`:** Set to 3-5 days after shipment (give customer time to receive and try the product). This mirrors our existing review_request email timing (7-day delay).

### Conflict with Our Existing Review System

We already have:
- `send-review-request-emails` cron (daily 10:00 UTC, 7-day delay)
- Internal review system (ProductReviewsIsland)

**Recommendation:** Run both in parallel initially. Internal reviews are product-specific and stay on our site (SEO value). Trustpilot reviews are service-level (trust signal + Google Seller Ratings). They serve different purposes and don't conflict.

---

## Implementation Phases

### Phase 1: Free Plan (do now — 0 cost)
1. Claim snusfriends.com on Trustpilot Business
2. Add bootstrap script to Shop.astro layout
3. Add Micro widget to trust bar / footer
4. Add "Rate us on Trustpilot" link to order confirmation email
5. Respond to any organic reviews that come in

### Phase 2: Plus Plan (when order volume justifies $259/mo)
1. Upgrade to Plus
2. Build Trustpilot invitation edge function (or extend delivery callback)
3. Set up automated invitations with 3-5 day delay post-shipment
4. Add more widgets: product pages, checkout, about page carousel
5. Monitor review count → target 100 reviews for Google Seller Ratings eligibility

### Phase 3: Product Reviews (Premium plan — future)
1. If we want Trustpilot product reviews alongside our internal reviews
2. Requires Premium plan ($629/mo)
3. Only makes sense at significant scale

---

## Daniel's Action Items

- [ ] **Go to business.trustpilot.com** and claim snusfriends.com (free — takes 5 minutes)
- [ ] **Get the Business Unit ID** from the Trustpilot dashboard (needed for widget embed code)
- [ ] **Decide on Plus plan timing** — budget $259/mo when ready for automated invitations
- [ ] Share the BU ID with Claude Code so we can implement the widget

---

## Sources
- [Trustpilot Pricing & Plans](https://business.trustpilot.com/pricing)
- [Trustpilot Plus Plan Details](https://business.trustpilot.com/pricing/plus-plan)
- [TrustBox Widget Installation Guide](https://support.trustpilot.com/hc/en-us/articles/203840826-Add-a-TrustBox-widget-to-a-webpage)
- [Trustpilot Invitation API](https://developers.trustpilot.com/invitation-api/)
- [TrustBox for SPAs](https://support.trustpilot.com/hc/en-us/articles/115011421468--Add-a-TrustBox-widget-to-a-single-page-application)
- [Trustpilot Pricing Review (WiserReview)](https://wiserreview.com/blog/trustpilot-pricing/)
- [Trustpilot Pricing (G2)](https://www.g2.com/products/trustpilot/pricing)
