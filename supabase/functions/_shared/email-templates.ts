// supabase/functions/_shared/email-templates.ts
// Reusable email templates for SnusFriend transactional emails.
// Import from other edge functions to compose emails without going through send-email.

const BRAND_COLOR = '#a3e635'; // lime-400
const BG_COLOR = '#121620'; // dark navy
const TEXT_COLOR = '#e2e8f0';
const MUTED_COLOR = '#94a3b8';
const CARD_BG = '#1e293b';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:${BG_COLOR};font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:20px;font-weight:700;color:${BRAND_COLOR};">SnusFriend</span>
    </div>
    ${content}
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid ${CARD_BG};text-align:center;">
      <p style="font-size:12px;color:${MUTED_COLOR};margin:0;">
        SnusFriend &middot; Premium Nicotine Pouches<br/>
        <a href="https://snusfriends.com" style="color:${BRAND_COLOR};text-decoration:none;">snusfriends.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function orderConfirmationEmail(
  orderId: string,
  total: string,
  itemCount: number,
): { subject: string; html: string } {
  const safeId = escapeHtml(orderId.slice(0, 8).toUpperCase());
  const safeTotal = escapeHtml(total);
  return {
    subject: `Order confirmed — ${safeId}`,
    html: baseTemplate(`
      <h1 style="color:${TEXT_COLOR};font-size:22px;margin:0 0 8px;">Order Confirmed</h1>
      <p style="color:${MUTED_COLOR};font-size:14px;margin:0 0 24px;">Thanks for your order! We're getting it ready.</p>
      <div style="background:${CARD_BG};border-radius:12px;padding:20px;">
        <p style="color:${TEXT_COLOR};font-size:14px;margin:0 0 8px;"><strong>Order:</strong> ${safeId}</p>
        <p style="color:${TEXT_COLOR};font-size:14px;margin:0 0 8px;"><strong>Items:</strong> ${Number(itemCount)}</p>
        <p style="color:${TEXT_COLOR};font-size:14px;margin:0;"><strong>Total:</strong> ${safeTotal}</p>
      </div>
      <div style="text-align:center;margin-top:24px;">
        <a href="https://snusfriends.com/account" style="display:inline-block;background:${BRAND_COLOR};color:${BG_COLOR};font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">View Your Order</a>
      </div>
    `),
  };
}

export function shippingNotificationEmail(
  orderId: string,
  trackingUrl: string | null,
): { subject: string; html: string } {
  const safeId = escapeHtml(orderId.slice(0, 8).toUpperCase());
  const trackingBlock = trackingUrl
    ? `<div style="text-align:center;margin-top:24px;">
        <a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:${BRAND_COLOR};color:${BG_COLOR};font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">Track Your Shipment</a>
      </div>`
    : '';

  return {
    subject: `Your order is on its way!`,
    html: baseTemplate(`
      <h1 style="color:${TEXT_COLOR};font-size:22px;margin:0 0 8px;">Your Order Has Shipped</h1>
      <p style="color:${MUTED_COLOR};font-size:14px;margin:0 0 24px;">Order ${safeId} is on its way to you.</p>
      ${trackingBlock}
    `),
  };
}

export function welcomeEmail(
  displayName: string,
): { subject: string; html: string } {
  const safeName = escapeHtml(displayName);
  return {
    subject: `Welcome to SnusFriend, ${safeName}!`,
    html: baseTemplate(`
      <h1 style="color:${TEXT_COLOR};font-size:22px;margin:0 0 8px;">Welcome, ${safeName}!</h1>
      <p style="color:${MUTED_COLOR};font-size:14px;margin:0 0 24px;">You've joined the SnusFriend community. Here's what you can do:</p>
      <ul style="color:${TEXT_COLOR};font-size:14px;padding-left:20px;">
        <li style="margin-bottom:8px;">Spin the wheel daily for free rewards</li>
        <li style="margin-bottom:8px;">Complete quests to earn SnusPoints</li>
        <li style="margin-bottom:8px;">Unlock achievements and climb the leaderboard</li>
        <li style="margin-bottom:8px;">Join the community and share reviews</li>
      </ul>
      <div style="text-align:center;margin-top:24px;">
        <a href="https://snusfriends.com/rewards" style="display:inline-block;background:${BRAND_COLOR};color:${BG_COLOR};font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">Explore Rewards</a>
      </div>
    `),
  };
}

export function passwordResetEmail(
  resetUrl: string,
): { subject: string; html: string } {
  return {
    subject: 'Reset your SnusFriend password',
    html: baseTemplate(`
      <h1 style="color:${TEXT_COLOR};font-size:22px;margin:0 0 8px;">Password Reset</h1>
      <p style="color:${MUTED_COLOR};font-size:14px;margin:0 0 24px;">We received a request to reset your password. Click below to set a new one.</p>
      <div style="text-align:center;margin-top:24px;">
        <a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:${BRAND_COLOR};color:${BG_COLOR};font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password</a>
      </div>
      <p style="color:${MUTED_COLOR};font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
    `),
  };
}
