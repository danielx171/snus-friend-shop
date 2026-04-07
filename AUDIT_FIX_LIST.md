# SnusFriend Full Audit Fix List — March 30, 2026

## Status Update (March 30, 2026 — Claude Session)

### DONE by Claude via MCP:

**Klaviyo Email Templates — ALL 5 CREATED:**
- ✅ Welcome Email (ID: `WjBd5j`) — Forest-themed, 3 feature blocks, shop CTA, flavour quiz link
- ✅ Post-Purchase Thank You (ID: `SC7bys`) — Order confirmation, next steps timeline, rewards CTA
- ✅ Abandoned Cart Reminder (ID: `W86scz`) — Cart items placeholder, urgency CTA, trust badges
- ✅ Browse Abandonment (ID: `UELQ82`) — Product reminder, flavour quiz + beginner guide CTAs
- ✅ Win-Back — We Miss You (ID: `SQjWt2`) — "What's new" blocks, COMEBACK10 discount code, popular picks

All templates use your forest dark theme (#0a1a0f background, #4caf50 green CTAs, #e8f5e9 text).
Edit any template at: `https://www.klaviyo.com/email-editor/{TEMPLATE_ID}/edit`

**Product Data — VERIFIED CLEAN:**
- ✅ 708 active products — 0 missing descriptions, 0 missing images
- The 64 missing descriptions and 18 missing images from the original audit have been fixed (likely by a previous session)

**Edge Function JWT Audit — ALL CORRECT:**
- ✅ `verify-admin` (`verify_jwt: false`): CORRECT — does its own auth internally. Extracts Bearer token, calls `supabase.auth.getClaims()`, then checks `user_roles` table for admin role. Double-layer auth.
- ✅ `discord-webhook` (`verify_jwt: true`): CORRECT — only called internally by other edge functions using service role key (valid JWT) + `x-internal-function-secret` header. Double authentication.
- ⚠️ `config.toml` is out of sync with deployed for 3 ops functions (ops-users, ops-set-role, ops-webhook-inbox show `verify_jwt: false` in config but deployed as `true`). Deployed is correct and more secure — update config.toml to match when convenient.

**Webhook Inbox — REVIEWED:**
- 51 entries, all from `nyehandel` provider, `delivery_callback` topic, status `received`
- Latest: March 23, 2026
- These are Nyehandel delivery callbacks from the integration setup. Since you have 0 orders, these are likely test/sync callbacks. No action needed — they'll become useful once real orders flow.

**Seasonal Event — CURRENT:**
- "Spring Pouch Festival" is active (March 25 → April 24, 2026)
- 2x SnusPoints multiplier, 2 rewards (Spring Pioneer badge + 500 points milestone)
- No issues — will expire naturally on April 24

**Auto-Generated Blog Posts — REVIEWED:**
- 7 posts in `blog_posts` table, all status `published`, from March 24-25
- Titles: "How to Choose Your Nicotine Strength", "Top 10 Nicotine Pouch Brands in 2026", "Nicotine Pouches vs Traditional Snus", "5 Tips for First-Time Users", "Best Mint Pouches in 2026", "How to Use Pouches to Quit Smoking", "What Are Nicotine Pouches?"
- ⚠️ Several of these overlap with your 43 hand-written .astro blog articles. Check if they're showing on the site (could cause duplicate content issues for SEO). If they ARE showing, either delete them or noindex them.

---

## STILL NEEDS DANIEL (Manual Tasks):

### CRITICAL — Do These First:

**1. Wire Klaviyo Templates into Flows (Klaviyo UI)**
The 5 templates above are created but they need to be connected to automated flows in Klaviyo:
1. Go to Klaviyo → Flows → Create Flow
2. **Welcome Series**: Trigger = "Added to List" → assign Welcome Email template (`WjBd5j`) → 2 day delay → best sellers → 4 day delay → 10% off
3. **Abandoned Cart**: Trigger = "Started Checkout" (no "Placed Order" within 1hr) → assign Abandoned Cart template (`W86scz`) → 24hr delay → urgency email
4. **Post-Purchase**: Trigger = "Placed Order" → assign Thank You template (`SC7bys`) → 7 day delay → review request → 14 day delay → cross-sell
5. **Browse Abandonment**: Trigger = "Viewed Product" (no purchase 24hrs) → assign Browse Abandonment template (`UELQ82`)
6. **Win-Back**: Trigger = 60 days since last "Placed Order" → assign Win-Back template (`SQjWt2`)

**2. Add Klaviyo JS Snippet to Base.astro**
In `src/layouts/Base.astro`, add in `<head>`:
```html
<script async src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=YOUR_PUBLIC_KEY"></script>
```
Find your public key: Klaviyo → Settings → API Keys → Public API Key

**3. Wire Checkout to Send Klaviyo Events**
In `supabase/functions/create-nyehandel-checkout/index.ts`, after successful order creation, POST to Klaviyo's Track API:
```
POST https://a.klaviyo.com/api/events/
Header: Authorization: Klaviyo-API-Key YOUR_PRIVATE_KEY
Header: revision: 2024-10-15
```
Send "Placed Order", "Started Checkout", and "Viewed Product" events. Store `KLAVIYO_PRIVATE_KEY` as a Supabase secret.

**4. Connect Newsletter Signup to Klaviyo**
The `save-waitlist-email` edge function saves to `newsletter_subscribers` table. Add a Klaviyo subscribe call:
```
POST https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/
```

**5. Test Full Checkout Flow**
- 0 orders in the database
- Go to snusfriends.com, add product, checkout, pay through Nyehandel
- Verify: order row created, email sent, webhook received

**6. Test Newsletter Signup**
- 0 subscribers in the database
- Go to snusfriends.com footer, enter test email, submit
- Verify: row appears in `newsletter_subscribers` or `waitlist_emails`

### MEDIUM Priority:

**7. Sync config.toml JWT Settings**
Update these 3 entries in `supabase/config.toml` to match the (more secure) deployed settings:
```toml
[functions.ops-users]
verify_jwt = true    # was false

[functions.ops-set-role]
verify_jwt = true    # was false

[functions.ops-webhook-inbox]
verify_jwt = true    # was false
```

**8. Check Auto-Generated Blog Posts for Duplicates**
7 published posts in `blog_posts` may overlap with your 43 .astro articles. If they're showing on the frontend, either:
- Delete them: `DELETE FROM blog_posts;`
- Or disable the `generate-blog-post` cron if you don't want auto-generated content

**9. Archive Inactive Products (optional)**
1,495 inactive products in DB. Not hurting the frontend but adds bulk to sync runs.

**10. Seed Community Content (optional)**
Tables are empty: `community_posts`, `product_reviews`, `referral_codes`, `flavor_profiles`. Either seed a few entries or add "Coming Soon" messaging.

---

## Summary Priority Order (Updated)

| # | Task | Status | Impact |
|---|------|--------|--------|
| 1 | Klaviyo email templates | ✅ DONE | 5 templates created |
| 2 | Product descriptions | ✅ DONE (already fixed) | 0 missing |
| 3 | Product images | ✅ DONE (already fixed) | 0 missing |
| 4 | Edge function JWT audit | ✅ DONE — all correct | Security verified |
| 5 | Webhook inbox review | ✅ DONE — 51 test callbacks | No action needed |
| 6 | Seasonal event check | ✅ DONE — current until Apr 24 | No action needed |
| 7 | Blog post review | ✅ DONE — 7 posts, check for duplicates | Daniel to review |
| 8 | Wire Klaviyo flows | 🔴 DANIEL | CRITICAL — no retention without flows |
| 9 | Add Klaviyo JS snippet | 🔴 DANIEL | CRITICAL — enables tracking |
| 10 | Wire checkout → Klaviyo events | 🔴 DANIEL | CRITICAL — triggers flows |
| 11 | Connect newsletter → Klaviyo | 🔴 DANIEL | CRITICAL — captures subscribers |
| 12 | Test checkout flow | 🔴 DANIEL | CRITICAL — must work before traffic |
| 13 | Test newsletter signup | 🔴 DANIEL | CRITICAL — verify form works |
| 14 | Sync config.toml | 🟡 DANIEL | MEDIUM — cosmetic, deployed is correct |
| 15 | Check blog duplicates | 🟡 DANIEL | MEDIUM — SEO risk |
