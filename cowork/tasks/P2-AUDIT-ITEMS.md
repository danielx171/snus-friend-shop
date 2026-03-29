# P2 Audit Items -- Cowork Task Brief

**Created:** 2026-03-29
**Source:** Cross-audit P2 findings from `cowork/README.md`, visual audit, competitor gap analysis, and content strategy recommendations.
**Assignee:** Cowork (content, copy, and research only -- no code)

Deliver all files to `cowork/` or `blog-drafts/` as noted per task. Claude Code will handle implementation.

---

## Task 1: Post-Purchase Review Request Email

**Task:** Write a transactional email template that asks customers to review their purchase. The site currently has zero product reviews -- this is the single most important content gap holding back conversion trust signals.

**Context:**
- SnusFriend has a review system built (ProductReviewsIsland component, verified purchase badges) but zero reviews submitted.
- Competitors (Haypp, Northerner) rely on Trustpilot; SnusFriend is the only one with on-site reviews -- but the feature is empty.
- The email should be sent 5-7 days after delivery, when the customer has tried the product.
- Brand voice: friendly, informal, European English (not American). Short sentences. No corporate jargon.
- The site domain is snusfriends.com and the brand name is SnusFriend.

**Deliverable:**
1. 3 subject line options (aim for 40-50 characters, mobile-friendly)
2. Email body text with these personalisation placeholders:
   - `{customer_name}` -- first name
   - `{product_name}` -- the product they bought (e.g. "VELO Freeze X-Strong")
   - `{order_date}` -- formatted date of purchase
   - `{review_url}` -- direct link to the product page review section
   - `{product_image_url}` -- product thumbnail
3. A clear CTA button ("Leave a Review" or similar)
4. A brief fallback for orders with multiple products (e.g. "You recently ordered {product_count} items -- pick one to review first")
5. A one-line footer disclaimer about review guidelines (honest opinions, no incentives for positive reviews)

**Format:** HTML email template (inline styles, 600px max-width, single-column layout). Use SnusFriend forest green (#1a2e1a) as the header colour, white body, and the primary green for the CTA button.

**Priority:** P1 -- this unblocks the entire review ecosystem.

---

## Task 2: About Page Imagery + Copy Refresh

**Task:** Rewrite the "About SnusFriend" page copy and provide image/graphic direction for each section.

**Context:**
The current about page (`src/pages/about.astro`) has:
- A dark green hero banner with tagline "We started SnusFriend with a simple belief..."
- A stats row (product count, brand count, 43 guides, EU free shipping)
- Four value cards: Honest Pricing, Fast Delivery, Real Selection, Community First
- A "Who We Are" section (generic text about being EU-based, small team, personal attention)
- A "Responsible Use" section
- Two CTAs: "Start Shopping" and "Read Our Guides"

The copy is functional but generic. It reads like a template. The competitor gap analysis shows Haypp and Northerner have mature "about" pages with personality and trust signals. SnusFriend needs copy that:
- Tells a believable founder story (solo founder, EU-based, nicotine pouch enthusiast)
- Explains what makes SnusFriend different (gamification, curated selection, community focus, no-BS pricing)
- Builds trust for first-time visitors (real humans, real warehouse, real support)
- Mentions the rewards programme as a differentiator (spin wheel, quests, avatars -- no competitor has this)

**Deliverable:**
1. Rewritten hero tagline and subheading (2-3 options)
2. Rewritten "Our Mission" paragraph
3. Rewritten "Who We Are" section (2-3 paragraphs, personality-driven)
4. Four refreshed value card titles and descriptions
5. Image/graphic suggestions for each section. Be specific:
   - Hero: what kind of image or illustration? (e.g. flat-lay product photo, illustration of pouches, team photo placeholder)
   - Values section: icon suggestions or small illustrations
   - "Who We Are": what visual would work here? (e.g. warehouse photo, map of EU shipping reach, team illustration)
6. A new "Why SnusFriend?" comparison section (3 bullets: us vs. generic competitors)

**Format:** Markdown with clearly labelled sections. Image suggestions as descriptive text (Cowork does not create images, but the descriptions help Claude Code source or create them).

**Priority:** P2

---

## Task 3: Social Media Platform Research + Bio Copy

**Task:** Research which social media platforms are most effective for a nicotine pouch retailer targeting adults (18+) in Europe, and write launch-ready bio copy for the top 3 platforms.

**Context:**
- SnusFriend is an EU-based nicotine pouch shop (snusfriends.com). Products are legal but restricted to adults.
- Google Ads bans nicotine products, so all growth is organic (SEO, content, community, social).
- The competitor gap analysis shows Haypp and Northerner have active social media; SnusFriend has "basic" presence (currently no social links in the footer or header).
- The audience is 18-45, predominantly male, across EU countries (Germany, Netherlands, Nordics, UK, France).
- Nicotine/tobacco content faces advertising restrictions on most platforms. The research needs to account for what is actually allowed.

**Deliverable:**
1. Platform ranking (top 5) with pros/cons for a nicotine pouch brand. For each platform:
   - Content restrictions for nicotine products (what can/cannot be posted)
   - Organic reach potential
   - Audience fit (age, geography, interest overlap)
   - Content format that works (short video, images, text posts, stories)
   - Example competitor accounts to study
2. Recommended launch order (start with 1-2 platforms, expand later)
3. Bio copy for the top 3 platforms (character-count-appropriate):
   - Instagram (150 chars)
   - TikTok (80 chars)
   - Reddit (subreddit strategy or profile bio)
   - Or whichever platforms rank highest
4. Content pillar suggestions (3-5 recurring themes, e.g. "New drop Tuesdays", "Flavour of the week", "Strength guide clips")

**Format:** Markdown research document.

**Priority:** P2

---

## Task 4: Newsletter Signup Incentive Copy

**Task:** Write 3 variations of newsletter signup copy with different incentive hooks to replace the current generic text.

**Context:**
The current newsletter signup in the site footer reads:
- Heading: "Stay in the loop"
- Subtext: "New drops, deals & guides -- no spam."
- Button: "Subscribe"

This is buried in the footer and offers no specific incentive. The newsletter saves to a `newsletter_subscribers` table via a Supabase edge function. The site uses a rewards/points system (SnusFriends Rewards) with spin wheel, quests, and avatars.

**Deliverable:**
Three complete variations, each with:
1. Heading (5-8 words)
2. Subtext (1-2 sentences, under 120 characters)
3. Button text (2-4 words)
4. Post-signup confirmation message (1 sentence)

The three variations should use different incentive angles:
- **Variation A: Discount code** -- e.g. "Get 10% off your first order" (note: confirm with Daniel if a discount code can actually be generated before going live with this)
- **Variation B: Exclusive content / early access** -- e.g. "Be the first to know about new brands and limited drops"
- **Variation C: Rewards points** -- e.g. "Sign up and earn 50 bonus SnusPoints" (ties into the existing loyalty programme)

Each variation should also include a brief note on when/where it works best (footer, popup, dedicated landing page, checkout page).

**Format:** Markdown with all three variations clearly separated.

**Priority:** P2

---

## Task 5: "What's New" Page Refresh -- Customer-Facing Copy

**Task:** Rewrite the "What's New" page content from developer release notes into customer-friendly feature announcements.

**Context:**
The current page (`src/pages/whats-new.astro`) reads like a developer changelog:
- "v1.5.0 -- Astro Migration: Rebuilt from the ground up on Astro for blazing-fast page loads..."
- "v1.4.0 -- Community & Gamification: User profiles with customisable avatars..."
- "v1.3.0 -- Checkout & Payments: Nyehandel payment integration..."

Customers do not care about version numbers, Astro, Supabase, or PostHog. They care about: can I find what I want faster? Is there something new to try? Did you fix that annoying thing?

The page should feel like a "here's what we've been working on for you" announcement, not a GitHub release log.

**Deliverable:**
Rewritten content for 3-4 "update" entries. Each entry should have:
1. A customer-friendly title (e.g. "Earn Rewards While You Shop" instead of "Community & Gamification")
2. A date (keep the existing dates)
3. A 2-3 sentence description written for shoppers
4. 4-6 bullet points reframed as customer benefits (e.g. "Review products and help other shoppers find their perfect pouch" instead of "Product review system with verified purchase badges")
5. Optional: a "Try it now" link suggestion (e.g. link to /rewards, /flavor-quiz, /products)

Also provide:
- A new page title suggestion (instead of "What's New -- Latest Drops & Feature Updates")
- A new intro paragraph

**Format:** Markdown with each entry clearly separated. Claude Code will map this into the Astro page data structure.

**Priority:** P3

---

## Delivery Instructions

- Drop completed files into `cowork/content/` with filenames matching the task:
  - `review-request-email.html` (Task 1)
  - `about-page-copy.md` (Task 2)
  - `social-media-research.md` (Task 3)
  - `newsletter-signup-variations.md` (Task 4)
  - `whats-new-rewrite.md` (Task 5)
- If a task requires follow-up questions or decisions from Daniel, note them clearly at the top of the file under a "Questions for Daniel" heading.
- Do not write code. Do not create `.astro`, `.tsx`, or `.ts` files. Claude Code handles all implementation.
