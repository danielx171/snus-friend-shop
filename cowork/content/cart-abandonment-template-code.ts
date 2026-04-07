// ──────────────────────────────────────────────────────────────────
// Cart Abandonment Email — to add to email-templates.ts
// ──────────────────────────────────────────────────────────────────
// Add this exported function to supabase/functions/_shared/email-templates.ts
// It matches the existing pattern (escapeHtml, baseTemplate, returns {subject, html}).
//
// NOTE: The baseTemplate in email-templates.ts currently uses a simpler dark theme
// (#121620 bg, plain text logo). The HTML mockup in cowork/mockups/ uses the
// upgraded theme (#0c1018 bg, table layout, accent bar). When we upgrade all
// templates to the new design, swap baseTemplate accordingly. For now this code
// works with the EXISTING baseTemplate to stay consistent with the other emails.
// ──────────────────────────────────────────────────────────────────

export interface CartItem {
  name: string;
  brand: string;
  image: string;
  strength: string;
  flavor: string;
  format: string;
  quantity: number;
  price: string; // formatted, e.g. "4.29"
}

export function cartAbandonmentEmail(
  items: CartItem[],
  subtotal: string,
  checkoutUrl: string,
  pointsTotal: number,
): { subject: string; html: string } {
  const safeCheckoutUrl = escapeHtml(checkoutUrl);
  const safeSubtotal = escapeHtml(subtotal);

  const itemRows = items
    .map((item) => {
      const safeName = escapeHtml(item.name);
      const safeBrand = escapeHtml(item.brand);
      const safeImage = escapeHtml(item.image);
      const safeStrength = escapeHtml(item.strength);
      const safeFlavor = escapeHtml(item.flavor);
      const safeFormat = escapeHtml(item.format);
      const safePrice = escapeHtml(item.price);

      return `
        <div style="background:${CARD_BG};border-radius:12px;padding:16px;margin-bottom:8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="72" valign="top">
                <div style="width:64px;height:64px;border-radius:50%;overflow:hidden;background:#253044;">
                  <img src="${safeImage}" alt="${safeName}" width="64" height="64"
                    style="display:block;width:64px;height:64px;object-fit:contain;border-radius:50%;" />
                </div>
              </td>
              <td style="padding-left:12px;" valign="top">
                <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:0.06em;">${safeBrand}</p>
                <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:${TEXT_COLOR};">${safeName}</p>
                <p style="margin:0 0 6px;font-size:12px;color:#64748b;">${safeStrength} &middot; ${safeFlavor} &middot; ${safeFormat}</p>
                <p style="margin:0;">
                  <span style="font-size:13px;color:${MUTED_COLOR};">Qty: ${Number(item.quantity)}</span>
                  <span style="font-size:16px;font-weight:700;color:${TEXT_COLOR};margin-left:16px;">&euro;${safePrice}</span>
                </p>
              </td>
            </tr>
          </table>
        </div>`;
    })
    .join('\n');

  return {
    subject: 'You left something behind — your cart is waiting',
    html: baseTemplate(`
      <h1 style="color:${TEXT_COLOR};font-size:22px;margin:0 0 8px;">You Left Something Behind</h1>
      <p style="color:${MUTED_COLOR};font-size:14px;margin:0 0 24px;">Your cart is still waiting for you. Complete your order before your favourites run out.</p>

      ${itemRows}

      <div style="border-top:1px solid ${CARD_BG};padding-top:12px;margin-top:8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td><span style="font-size:14px;color:${MUTED_COLOR};">Subtotal (${items.length} item${items.length > 1 ? 's' : ''})</span></td>
            <td align="right"><span style="font-size:16px;font-weight:700;color:${TEXT_COLOR};">&euro;${safeSubtotal}</span></td>
          </tr>
          <tr>
            <td style="padding-top:4px;"><span style="font-size:12px;color:#22c55e;">&#10003; Free shipping on orders over &euro;50</span></td>
            <td align="right" style="padding-top:4px;"><span style="font-size:12px;font-weight:600;color:#22c55e;">+${Number(pointsTotal)} pts</span></td>
          </tr>
        </table>
      </div>

      <div style="text-align:center;margin-top:24px;">
        <a href="${safeCheckoutUrl}" style="display:inline-block;background:${BRAND_COLOR};color:${BG_COLOR};font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;">Complete Your Order &rarr;</a>
      </div>

      <p style="text-align:center;font-size:13px;color:#f59e0b;margin-top:16px;">&#9888; Popular items sell out fast — we can't guarantee availability</p>

      <div style="background:${CARD_BG};border-radius:10px;padding:14px;margin-top:20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%" align="center"><p style="margin:0;font-size:14px;">&#128666;</p><p style="margin:2px 0 0;font-size:11px;color:${MUTED_COLOR};">Fast EU delivery</p></td>
            <td width="33%" align="center" style="border-left:1px solid #253044;border-right:1px solid #253044;"><p style="margin:0;font-size:14px;">&#128274;</p><p style="margin:2px 0 0;font-size:11px;color:${MUTED_COLOR};">Secure checkout</p></td>
            <td width="33%" align="center"><p style="margin:0;font-size:14px;">&#127873;</p><p style="margin:2px 0 0;font-size:11px;color:${MUTED_COLOR};">Earn points</p></td>
          </tr>
        </table>
      </div>

      <p style="font-size:13px;color:#64748b;margin-top:20px;text-align:center;">
        Questions? Reply to this email or contact <a href="mailto:hello@snusfriends.com" style="color:${BRAND_COLOR};text-decoration:none;">hello@snusfriends.com</a>
      </p>
    `),
  };
}

// ──────────────────────────────────────────────────────────────────
// Usage example (in a cron edge function or event trigger):
//
// import { cartAbandonmentEmail } from '../_shared/email-templates.ts';
//
// const { subject, html } = cartAbandonmentEmail(
//   [
//     {
//       name: 'Cool Mint',
//       brand: 'ZYN',
//       image: 'https://images.nyehandel.com/...',
//       strength: 'Strong',
//       flavor: 'Mint',
//       format: 'Slim · 24p',
//       quantity: 2,
//       price: '8.58',
//     },
//   ],
//   '8.58',
//   'https://snusfriends.com/checkout?cart=abc123',
//   86,
// );
// ──────────────────────────────────────────────────────────────────
