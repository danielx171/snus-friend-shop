# Supabase Auth Email Templates — Setup Guide

## The Bug

The current confirmation email shows raw HTML (`table width="100%" cellpadding="0"...`) because the Supabase Auth email template in the dashboard has two problems:

1. **Supabase default text is still present** — The "Confirm your signup / Follow this link to confirm your user:" text at the top is Supabase's built-in template. Our custom HTML was added BELOW it instead of REPLACING it entirely.

2. **HTML not being rendered** — The custom template HTML is being displayed as plain text instead of being interpreted as HTML. This happens when the template content type isn't set to HTML, or when the HTML is malformed.

## How to Fix

Go to **Supabase Dashboard > Authentication > Email Templates**

### Confirmation Email

- **Subject:** `Confirm your SnusFriend account`
- **Body:** Replace the ENTIRE content with the HTML from `email-confirmation-template.html`
- Make sure to **delete all existing content first** — don't paste below the default template

The template uses `{{ .ConfirmationURL }}` which is Supabase's Go template variable for the confirmation link.

### Password Reset Email

- **Subject:** `Reset your SnusFriend password`
- **Body:** Use the HTML from `email-password-reset-template.html`
- Template variable: `{{ .ConfirmationURL }}` (same variable name for reset)

### Magic Link Email (if enabled)

- **Subject:** `Your SnusFriend login link`
- **Body:** Use the HTML from `email-magic-link-template.html`
- Template variable: `{{ .ConfirmationURL }}`

## Design Decisions

The email templates match the SnusFriend dark theme:

- **Background:** `#0c1018` (site background)
- **Card:** `#161d2b` (elevated surface)
- **Accent:** `#22c55e` → `#15803d` gradient (green CTA, matches site)
- **Brand color:** `#a3e635` (lime-400, used for logo and links)
- **Text:** `#f1f5f9` heading, `#94a3b8` body, `#64748b` fine print

Email-safe techniques used:
- Table-based layout (no CSS grid/flexbox — not supported in Outlook/Gmail)
- Inline styles only (no `<style>` blocks — stripped by many email clients)
- MSO conditional comments for Outlook button rendering
- Unicode emoji instead of images (no image hosting dependency)
- Fallback plain-text link below the CTA button
- `role="presentation"` on layout tables for accessibility

## Testing

After pasting the templates:
1. Create a test account with a throwaway email
2. Check rendering in Gmail (web + app), Apple Mail, and Outlook
3. Verify the confirmation link works and redirects to the site
4. Check that the 50 bonus points are credited after confirmation
