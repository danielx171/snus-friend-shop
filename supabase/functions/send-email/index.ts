declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EmailRequest = {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
};

type LineItem = {
  name: string;
  qty: number;
  price: string;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": Deno.env.get("SUPABASE_URL") ?? "",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-internal-function-secret",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Email layout                                                       */
/* ------------------------------------------------------------------ */

function wrapInLayout(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SnusFriend</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;padding:24px 32px;text-align:center;">
              <span style="font-size:24px;font-weight:700;color:#a3e635;letter-spacing:0.5px;">SnusFriend</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                <a href="https://snusfriends.com" style="color:#0f172a;text-decoration:none;font-weight:600;">snusfriends.com</a>
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                You received this email because of your activity on SnusFriend.
                If you believe this was sent in error, please contact us.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Templates                                                          */
/* ------------------------------------------------------------------ */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderOrderConfirmed(data: Record<string, unknown>): string {
  const orderId = escapeHtml(String(data.orderId ?? ""));
  const customerName = escapeHtml(String(data.customerName ?? "Customer"));
  const total = escapeHtml(String(data.total ?? "0.00"));
  const currency = escapeHtml(String(data.currency ?? "EUR"));
  const shippingMethod = data.shippingMethod ? String(data.shippingMethod) : "";
  const items = Array.isArray(data.items) ? (data.items as LineItem[]) : [];

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:center;">${Number(item.qty)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right;">${escapeHtml(item.price)}</td>
        </tr>`
    )
    .join("");

  return wrapInLayout(`
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Order Confirmed</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hi ${customerName}, thanks for your order! We've received your order
      <strong style="color:#0f172a;">#${orderId}</strong> and it's being prepared.
    </p>
    ${items.length > 0 ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <th style="padding:8px 0;border-bottom:2px solid #e2e8f0;font-size:13px;color:#64748b;text-align:left;font-weight:600;">Item</th>
        <th style="padding:8px 0;border-bottom:2px solid #e2e8f0;font-size:13px;color:#64748b;text-align:center;font-weight:600;">Qty</th>
        <th style="padding:8px 0;border-bottom:2px solid #e2e8f0;font-size:13px;color:#64748b;text-align:right;font-weight:600;">Price</th>
      </tr>
      ${itemRows}
    </table>
    ` : ""}
    ${shippingMethod ? `<p style="margin:0 0 16px;font-size:14px;color:#475569;"><strong>Shipping:</strong> ${escapeHtml(shippingMethod)}</p>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:16px;background-color:#f0fdf4;border-radius:8px;text-align:center;">
          <span style="font-size:13px;color:#64748b;">Total</span><br />
          <span style="font-size:22px;font-weight:700;color:#0f172a;">${currency} ${total}</span>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;text-align:center;">
      <a href="https://snusfriends.com" style="display:inline-block;padding:12px 28px;background-color:#0f172a;color:#a3e635;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">View Your Orders</a>
    </p>
  `);
}

function renderOrderShipped(data: Record<string, unknown>): string {
  const orderId = escapeHtml(String(data.orderId ?? ""));
  const customerName = escapeHtml(String(data.customerName ?? "Customer"));
  const trackingUrl = String(data.trackingUrl ?? "");
  const trackingId = escapeHtml(String(data.trackingId ?? ""));
  const carrier = escapeHtml(String(data.carrier ?? ""));

  const trackingBlock = trackingUrl
    ? `<a href="${escapeHtml(trackingUrl)}" style="display:inline-block;padding:12px 28px;background-color:#0f172a;color:#a3e635;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">Track Your Package</a>`
    : "";

  return wrapInLayout(`
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Your Order Has Shipped!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hi ${customerName}, great news — your order
      <strong style="color:#0f172a;">#${orderId}</strong> is on its way!
    </p>
    ${carrier ? `<p style="margin:0 0 8px;font-size:14px;color:#475569;"><strong>Carrier:</strong> ${carrier}</p>` : ""}
    ${trackingId ? `<p style="margin:0 0 24px;font-size:14px;color:#475569;"><strong>Tracking ID:</strong> ${trackingId}</p>` : ""}
    ${trackingBlock ? `<p style="margin:0 0 24px;text-align:center;">${trackingBlock}</p>` : ""}
    <p style="margin:0;font-size:14px;color:#94a3b8;">
      Delivery times vary by region. If you have any questions, visit
      <a href="https://snusfriends.com" style="color:#0f172a;">snusfriends.com</a>.
    </p>
  `);
}

function renderWelcome(data: Record<string, unknown>): string {
  const customerName = escapeHtml(String(data.customerName ?? "Friend"));

  return wrapInLayout(`
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Welcome to SnusFriend!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hi ${customerName}, welcome aboard! We're stoked to have you in the SnusFriend community.
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Here's what's waiting for you:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:12px 16px;background-color:#f0fdf4;border-radius:8px;margin-bottom:8px;">
          <strong style="color:#0f172a;">Spin the Wheel</strong>
          <span style="color:#475569;font-size:14px;"> — Daily free spins for discounts and rewards</span>
        </td>
      </tr>
      <tr><td style="padding:4px;"></td></tr>
      <tr>
        <td style="padding:12px 16px;background-color:#eff6ff;border-radius:8px;margin-bottom:8px;">
          <strong style="color:#0f172a;">Earn SnusPoints</strong>
          <span style="color:#475569;font-size:14px;"> — Complete quests, leave reviews, and earn points on every order</span>
        </td>
      </tr>
      <tr><td style="padding:4px;"></td></tr>
      <tr>
        <td style="padding:12px 16px;background-color:#fdf4ff;border-radius:8px;">
          <strong style="color:#0f172a;">Unlock Achievements</strong>
          <span style="color:#475569;font-size:14px;"> — Collect avatars and climb the leaderboard</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;text-align:center;">
      <a href="https://snusfriends.com/products" style="display:inline-block;padding:12px 28px;background-color:#0f172a;color:#a3e635;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">Browse Products</a>
    </p>
    <p style="margin:0;font-size:14px;color:#94a3b8;">
      Got questions? Reply to this email or visit <a href="https://snusfriends.com/contact" style="color:#0f172a;">snusfriends.com/contact</a>.
    </p>
  `);
}

function renderReviewRequest(data: Record<string, unknown>): string {
  const customerName = escapeHtml(String(data.customerName ?? "Friend"));
  const productName = escapeHtml(String(data.productName ?? "your recent purchase"));
  const productImageUrl = String(data.productImageUrl ?? "");
  const reviewUrl = escapeHtml(String(data.reviewUrl ?? "https://snusfriends.com"));
  const orderDate = escapeHtml(String(data.orderDate ?? ""));

  const productImageBlock = productImageUrl
    ? `<td style="width:80px;vertical-align:top;">
        <img src="${escapeHtml(productImageUrl)}" alt="${productName}" width="80" height="80" style="display:block;width:80px;height:80px;object-fit:cover;border:1px solid #e0e0e0;border-radius:6px;background-color:#ffffff;" />
      </td>
      <td style="width:16px;"></td>`
    : "";

  // Self-contained layout matching Cowork design — does NOT use wrapInLayout()
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We'd love to hear what you think</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1a2e1a;padding:40px 20px;text-align:center;">
              <span style="font-size:24px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">Snus</span><span style="font-size:24px;font-weight:600;color:#4a6741;letter-spacing:0.5px;">Friend</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <h2 style="font-size:18px;font-weight:600;color:#1a2e1a;margin:0 0 20px 0;line-height:1.4;">Hey ${customerName},</h2>

              <p style="font-size:15px;line-height:1.6;color:#333333;margin:0 0 16px 0;">We hope you're enjoying ${productName}! A few days have passed since it arrived, and we'd love to know what you think.</p>

              <p style="font-size:15px;line-height:1.6;color:#333333;margin:0 0 16px 0;">Genuine reviews from real customers help our community find the right products &mdash; and your honest thoughts make a real difference.</p>

              <!-- Product Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-left:4px solid #4a6741;border-radius:4px;margin:28px 0;">
                <tr>
                  <td style="padding:20px;">
                    <p style="font-size:13px;font-weight:600;color:#666666;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px 0;">You purchased</p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        ${productImageBlock}
                        <td style="vertical-align:top;">
                          <p style="font-size:15px;font-weight:600;color:#1a2e1a;margin:0 0 4px 0;line-height:1.4;">${productName}</p>
                          <p style="font-size:13px;color:#999999;margin:0;">Ordered ${orderDate}</p>
                          <p style="font-size:14px;line-height:1.5;color:#555555;margin:16px 0 0 0;">If you ordered multiple items, just pick your favourite one to review first.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:32px 0;">
                    <a href="${reviewUrl}" style="display:inline-block;background-color:#4a6741;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:6px;font-size:15px;font-weight:600;">Leave a Review</a>
                  </td>
                </tr>
              </table>

              <!-- Why Reviews -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;margin:0 0 28px 0;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="font-size:15px;font-weight:600;color:#1a2e1a;margin:0 0 12px 0;">Why your review matters</h3>
                    <p style="font-size:14px;line-height:1.6;color:#555555;margin:0;">Every review helps other shoppers make confident choices. We publish all honest opinions &mdash; the good, the brilliant, and the constructive. Your voice is part of what makes SnusFriend a real community.</p>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;line-height:1.6;color:#333333;margin:0 0 16px 0;">Questions or issues with your order? Just reply to this email or reach out to <a href="mailto:support@snusfriends.com" style="color:#4a6741;text-decoration:none;">support@snusfriends.com</a>.</p>

              <p style="font-size:14px;color:#555555;margin:28px 0 0 0;line-height:1.6;">
                Cheers,<br />
                <span style="font-weight:600;color:#1a2e1a;">The SnusFriend Team</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f5f5f5;padding:30px;text-align:center;border-top:1px solid #e0e0e0;">
              <p style="font-size:12px;line-height:1.6;color:#999999;margin:0 0 12px 0;">We only ask for honest reviews &mdash; we never incentivise positive feedback. Your authentic experience helps everyone.</p>
              <p style="font-size:12px;color:#e0e0e0;margin:0 0 12px 0;">&mdash;&mdash;&mdash;</p>
              <p style="font-size:12px;line-height:1.6;color:#999999;margin:0 0 12px 0;">
                <strong>SnusFriend</strong><br />
                Your nicotine pouch community<br />
                <a href="https://snusfriends.com" style="color:#4a6741;text-decoration:none;">snusfriends.com</a>
              </p>
              <p style="font-size:12px;margin:0 0 12px 0;">
                <a href="https://snusfriends.com/legal/privacy" style="color:#4a6741;text-decoration:none;">Privacy</a> &nbsp;&bull;&nbsp;
                <a href="https://snusfriends.com/legal/terms" style="color:#4a6741;text-decoration:none;">Terms</a> &nbsp;&bull;&nbsp;
                <a href="https://snusfriends.com/contact" style="color:#4a6741;text-decoration:none;">Contact</a>
              </p>
              <p style="font-size:11px;line-height:1.6;color:#999999;margin:16px 0 0 0;">
                You're receiving this because you purchased from SnusFriend.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const TEMPLATE_RENDERERS: Record<string, (data: Record<string, unknown>) => string> = {
  order_confirmed: renderOrderConfirmed,
  order_shipped: renderOrderShipped,
  welcome: renderWelcome,
  review_request: renderReviewRequest,
};

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": Deno.env.get("SUPABASE_URL") ?? "",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type, x-internal-function-secret",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed", requestId }, 405);
  }

  /* ---------- auth: internal function secret ---------- */
  const internalFunctionsSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
  if (!internalFunctionsSecret) {
    console.error(JSON.stringify({ requestId, event: "send_email_no_secret_configured" }));
    return jsonResponse({ error: "missing_internal_functions_secret", requestId }, 500);
  }

  const callerSecret = req.headers.get("x-internal-function-secret");
  if (callerSecret !== internalFunctionsSecret) {
    console.error(JSON.stringify({ requestId, event: "send_email_auth_failed" }));
    return jsonResponse({ error: "unauthorized", requestId }, 401);
  }

  /* ---------- env ---------- */
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error(JSON.stringify({ requestId, event: "send_email_missing_resend_key" }));
    return jsonResponse({ error: "missing_resend_api_key", requestId }, 500);
  }

  /* ---------- parse request ---------- */
  let payload: EmailRequest;
  try {
    payload = (await req.json()) as EmailRequest;
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400);
  }

  const { to, subject, template, data } = payload;

  if (!to || !subject || !template) {
    return jsonResponse({ error: "missing_fields", message: "to, subject, and template are required", requestId }, 400);
  }

  const renderer = TEMPLATE_RENDERERS[template];
  if (!renderer) {
    return jsonResponse({
      error: "unknown_template",
      message: `Template '${template}' not found. Available: ${Object.keys(TEMPLATE_RENDERERS).join(", ")}`,
      requestId,
    }, 400);
  }

  /* ---------- render template ---------- */
  const html = renderer(data ?? {});

  /* ---------- send via Resend ---------- */
  console.log(JSON.stringify({
    requestId,
    event: "send_email_sending",
    to,
    template,
    subject,
  }));

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SnusFriend <noreply@snusfriends.com>",
        to: [to],
        subject,
        html,
      }),
    });

    const resendBody = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error(JSON.stringify({
        requestId,
        event: "send_email_resend_error",
        status: resendResponse.status,
        resendError: resendBody,
      }));
      return jsonResponse({
        success: false,
        error: "resend_api_error",
        status: resendResponse.status,
        requestId,
      }, 502);
    }

    const emailId = resendBody.id ?? null;

    console.log(JSON.stringify({
      requestId,
      event: "send_email_success",
      emailId,
      to,
      template,
    }));

    return jsonResponse({ success: true, emailId, requestId });
  } catch (err) {
    console.error(JSON.stringify({
      requestId,
      event: "send_email_fetch_error",
      error: String(err),
    }));
    return jsonResponse({ success: false, error: "resend_fetch_failed", requestId }, 502);
  }
});
