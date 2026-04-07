/**
 * Order Status Email Templates — Ready to add to send-email/index.ts
 *
 * Two new templates:
 *   1. order_canceled  — sent to customer after successful cancellation
 *   2. order_updated   — sent to customer when ops updates their order (address change, etc.)
 *
 * Style: Matches existing order_confirmed/order_shipped templates (wrapInLayout).
 * Uses the same escapeHtml() and wrapInLayout() functions already in send-email/index.ts.
 *
 * Claude Code: add these functions and register them in TEMPLATE_RENDERERS.
 */

// ─── Template: order_canceled ────────────────────────────────────────────────

function renderOrderCanceled(data: Record<string, unknown>): string {
  const orderId = escapeHtml(String(data.orderId ?? ""));
  const customerName = escapeHtml(String(data.customerName ?? "Customer"));
  const total = escapeHtml(String(data.total ?? "0.00"));
  const currency = escapeHtml(String(data.currency ?? "EUR"));
  const reason = data.reason ? escapeHtml(String(data.reason)) : "";

  return wrapInLayout(`
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Order Cancelled</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hi ${customerName}, your order
      <strong style="color:#0f172a;">#${orderId}</strong> has been cancelled as requested.
    </p>
    ${reason ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:16px;background-color:#fef2f2;border-radius:8px;border-left:4px solid #ef4444;">
          <span style="font-size:13px;font-weight:600;color:#64748b;">Reason</span><br />
          <span style="font-size:14px;color:#334155;">${reason}</span>
        </td>
      </tr>
    </table>
    ` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:16px;background-color:#f8fafc;border-radius:8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;color:#64748b;">Refund amount</td>
              <td style="font-size:18px;font-weight:700;color:#0f172a;text-align:right;">${currency} ${total}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;">
      Your refund will be processed within <strong style="color:#0f172a;">3–5 business days</strong>
      back to your original payment method. The exact timing depends on your bank or card issuer.
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;">
      Changed your mind? You can always place a new order — we'd love to have you back.
    </p>
    <p style="margin:0;text-align:center;">
      <a href="https://snusfriends.com/products" style="display:inline-block;padding:12px 28px;background-color:#0f172a;color:#a3e635;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">Browse Products</a>
    </p>
  `);
}

// Subject: "Your order #{{orderId}} has been cancelled"

// ─── Template: order_updated ─────────────────────────────────────────────────

function renderOrderUpdated(data: Record<string, unknown>): string {
  const orderId = escapeHtml(String(data.orderId ?? ""));
  const customerName = escapeHtml(String(data.customerName ?? "Customer"));
  const changeType = escapeHtml(String(data.changeType ?? "updated"));
  const changeSummary = escapeHtml(String(data.changeSummary ?? ""));

  // changeType can be: "address_updated", "items_modified", "shipping_changed", "general"
  const changeLabels: Record<string, string> = {
    address_updated: "Shipping address updated",
    items_modified: "Order items modified",
    shipping_changed: "Shipping method changed",
    general: "Order updated",
  };

  const changeLabel = changeLabels[changeType] ?? "Order updated";

  return wrapInLayout(`
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Order Updated</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hi ${customerName}, we've made a change to your order
      <strong style="color:#0f172a;">#${orderId}</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:16px;background-color:#eff6ff;border-radius:8px;border-left:4px solid #3b82f6;">
          <span style="font-size:13px;font-weight:600;color:#3b82f6;text-transform:uppercase;letter-spacing:0.5px;">What changed</span><br />
          <span style="font-size:15px;font-weight:600;color:#0f172a;display:block;margin-top:4px;">${changeLabel}</span>
          ${changeSummary ? `<span style="font-size:14px;color:#475569;display:block;margin-top:8px;line-height:1.5;">${changeSummary}</span>` : ""}
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;">
      Everything else about your order stays the same. If this change doesn't look right,
      please <a href="https://snusfriends.com/contact" style="color:#0f172a;font-weight:600;text-decoration:none;">contact us</a>
      and we'll sort it out.
    </p>
    <p style="margin:0;text-align:center;">
      <a href="https://snusfriends.com/account" style="display:inline-block;padding:12px 28px;background-color:#0f172a;color:#a3e635;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">View Your Orders</a>
    </p>
  `);
}

// Subject: "Your order #{{orderId}} has been updated"

// ─── Registration in TEMPLATE_RENDERERS ──────────────────────────────────────
//
// Add to the existing TEMPLATE_RENDERERS object in send-email/index.ts:
//
//   const TEMPLATE_RENDERERS: Record<string, (data: Record<string, unknown>) => string> = {
//     order_confirmed: renderOrderConfirmed,
//     order_shipped: renderOrderShipped,
//     welcome: renderWelcome,
//     review_request: renderReviewRequest,
//     order_canceled: renderOrderCanceled,    // ← NEW
//     order_updated: renderOrderUpdated,      // ← NEW
//   };
//
// ─── Trigger data shapes ─────────────────────────────────────────────────────
//
// order_canceled:
//   {
//     to: "customer@email.com",
//     subject: "Your order #12345 has been cancelled",
//     template: "order_canceled",
//     data: {
//       orderId: "12345",
//       customerName: "Daniel",
//       total: "18.90",
//       currency: "EUR",
//       reason: "Customer request"  // optional
//     }
//   }
//
// order_updated:
//   {
//     to: "customer@email.com",
//     subject: "Your order #12345 has been updated",
//     template: "order_updated",
//     data: {
//       orderId: "12345",
//       customerName: "Daniel",
//       changeType: "address_updated",  // address_updated | items_modified | shipping_changed | general
//       changeSummary: "New address: 123 Main St, Berlin 10115, DE"  // optional detail
//     }
//   }
