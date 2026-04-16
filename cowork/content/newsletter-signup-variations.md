# SnusFriend Newsletter Signup — Copy Variations

**Current baseline (footer):**
- Heading: "Stay in the loop"
- Subtext: "New drops, deals & guides — no spam."
- Button: "Subscribe"
- Confirmation: (None)

---

## Variation A: Discount Code Incentive

**Best for:** Checkout page, exit-intent popup, dedicated landing page
**Conversion driver:** Immediate monetary value
**Tone:** Direct, reward-focused

### Copy

| Element | Copy |
|---------|------|
| **Heading** | Get 10% off your first order |
| **Subtext** | Join 5,000+ mates and unlock an exclusive discount code. New drops and deals in your inbox, no spam. |
| **Button** | Unlock discount |
| **Post-signup confirmation** | Check your inbox for your 10% code — valid on your next order. |

### Notes
- Strongest for **cold traffic** (new visitors, checkout abandonment)
- **Action required:** Confirm with Daniel whether discount codes can be auto-generated via edge function; if not, manual admin step needed
- Risk: May attract price-hunters rather than loyal customers
- Works well paired with exit-intent timing (catches browsers before they leave)

---

## Variation B: Exclusive Access & Early Drops

**Best for:** Footer (secondary CTA), brand pages, blog articles
**Conversion driver:** FOMO, community belonging
**Tone:** Informal, insider-y

### Copy

| Element | Copy |
|---------|------|
| **Heading** | Be first to the new drops |
| **Subtext** | Suss out limited releases and exclusive brand collabs before they're gone. Plus guides and the odd cheeky deal. |
| **Button** | Stay in the know |
| **Post-signup confirmation** | Welcome — you're now on the inside track for new releases. |

### Notes
- Works best as **always-visible footer presence** (builds habit)
- Appeals to **engaged browsers** (people actively browsing brands/flavours)
- No discount promise needed — relies on scarcity and status
- Strong for retention over acquisition
- "Cheeky deal" signals personality; "suss out" = British English slang ✓

---

## Variation C: Rewards Programme Integration

**Best for:** Homepage hero, product pages, account dashboard
**Conversion driver:** Loyalty programme gamification
**Tone:** Playful, benefit-stacked

### Copy

| Element | Copy |
|---------|------|
| **Heading** | Earn 50 bonus SnusPoints today |
| **Subtext** | Join the SnusFriends Rewards and rack up points on every order. Plus early access to new brands and exclusive quests. |
| **Button** | Claim my points |
| **Post-signup confirmation** | Done — 50 SnusPoints added to your account. Start earning more on your first order. |

### Notes
- **Best for:** Existing loyalty programme push (homepage, PDP, post-purchase)
- Directly ties to your spinning wheel, quests, avatars system
- Appeals to **repeat customers and engaged community**
- Requires: Points edge function to auto-credit 50 points on signup confirmation
- Strongest lifetime value (drives repeat orders via unlock goals)
- "Rack up" = British-friendly informal phrasing ✓

---

## Recommendation for A/B Testing

| Variation | Primary Goal | Audience | Placement |
|-----------|--------------|----------|-----------|
| **A** | Acquisition (trial conversion) | Cold traffic, first-time browsers | Checkout, exit-intent popup |
| **B** | Retention (habit building) | Warm traffic, engaged browsers | Footer, brand pages, newsletter archive |
| **C** | Community depth (lifetime value) | Warm users, repeat customers | Homepage, product pages, account |

**Suggested rollout:** Deploy B as footer baseline (low-lift, always-on), test A on checkout/popups (short-term boost), promote C on homepage once discount code strategy is clarified.

---

## Technical Implementation Notes

- **Newsletter function:** Already exists (saves to `newsletter_subscribers`)
- **Variation A:** Needs discount code generation logic (confirm with Daniel)
- **Variation C:** Needs points credit on signup confirmation; requires `points_transactions` insert
- **Confirmation emails:** Set reply-to or "no-reply" to avoid confusion
- **Unsubscribe link:** GDPR-required in confirmation email (likely already handled by Supabase)
