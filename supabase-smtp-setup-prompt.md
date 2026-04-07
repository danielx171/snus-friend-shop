# Supabase Custom SMTP Setup — Prompt for Claude Chat

Copy and paste this entire prompt into a new Claude chat session. It will walk you through configuring Resend as the custom SMTP provider for Supabase Auth emails (confirmation, password reset, magic link).

---

## Prompt

I need to configure custom SMTP for my Supabase project so that auth emails (email confirmation, password reset) are sent from my own domain instead of Supabase's built-in mailer. Here are my details:

**Supabase project:** bozdnoctcszbhemdjsek
**Domain:** snusfriends.com
**Email provider:** Resend (resend.com)
**From address I want:** noreply@snusfriends.com

Please walk me through every step to set this up. Here's what I need:

### Step 1 — Resend Setup
1. Log into Resend (resend.com)
2. Go to Domains → Add Domain → enter `snusfriends.com`
3. Resend will give me DNS records (SPF, DKIM, etc.) to add to my DNS
4. I manage DNS on **Cloudflare** — tell me exactly which records to add
5. Verify the domain in Resend
6. Go to API Keys → Create a new API key scoped to `snusfriends.com` → copy it

### Step 2 — Supabase SMTP Configuration
1. Go to Supabase Dashboard → Authentication → SMTP Settings
2. Enable "Custom SMTP"
3. Enter these settings:
   - **Sender email:** `noreply@snusfriends.com`
   - **Sender name:** `SnusFriend`
   - **Host:** `smtp.resend.com`
   - **Port:** `465`
   - **Username:** `resend`
   - **Password:** (the Resend API key from Step 1)
4. Save

### Step 3 — Customize Email Templates
In Supabase Dashboard → Authentication → Email Templates, update these templates to match our brand:

**Confirmation email:**
- Subject: `Confirm your SnusFriend account`
- Body: Welcome message with confirm link, mention they'll earn 50 points for joining

**Password Reset:**
- Subject: `Reset your SnusFriend password`
- Body: Clean password reset with link

**Magic Link (if enabled):**
- Subject: `Your SnusFriend login link`

### Step 4 — Test
1. Create a test account with a real email I control
2. Check that the confirmation email arrives from `noreply@snusfriends.com`
3. Check email headers to confirm DKIM and SPF pass

### Important Notes
- The Resend API key is the SMTP password — don't share it
- Port 465 uses implicit TLS (recommended over port 587)
- After this, ALL Supabase auth emails (confirmation, password reset, invite, magic link) will go through Resend
- Our transactional emails (welcome, order confirmed, shipped, review request) already use Resend via edge functions — this just adds the auth emails to the same pipeline
- The existing `send-welcome-email` edge function and its trigger will continue working separately — that's our custom welcome email with points info, distinct from the Supabase confirmation email

Walk me through it step by step and tell me when to paste screenshots so you can verify each step is correct.
