import { getCorsHeaders } from "../_shared/cors.ts";

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — must be empty */
  website?: string;
}

const VALID_SUBJECTS = new Set([
  "order",
  "product",
  "shipping",
  "returns",
  "account",
  "other",
]);

const SUBJECT_LABELS: Record<string, string> = {
  order: "Order enquiry",
  product: "Product question",
  shipping: "Shipping & delivery",
  returns: "Returns & refunds",
  account: "Account & rewards",
  other: "Something else",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function jsonResponse(
  body: unknown,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ------------------------------------------------------------------ */
/*  Simple in-memory rate limiter (per-IP, resets on cold start)       */
/* ------------------------------------------------------------------ */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // 3 submissions per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

/* ------------------------------------------------------------------ */
/*  Email HTML                                                         */
/* ------------------------------------------------------------------ */

function buildContactEmailHtml(payload: ContactPayload): string {
  const { name, email, subject, message } = payload;
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Contact Form Submission</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
          <tr>
            <td style="background-color:#0f172a;padding:24px 32px;text-align:center;">
              <span style="font-size:24px;font-weight:700;color:#a3e635;letter-spacing:0.5px;">SnusFriend</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:20px;color:#0f172a;">New Contact Form Submission</h1>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#64748b;font-weight:600;width:80px;vertical-align:top;">Name</td>
                  <td style="padding:8px 0;font-size:14px;color:#334155;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#64748b;font-weight:600;vertical-align:top;">Email</td>
                  <td style="padding:8px 0;font-size:14px;color:#334155;"><a href="mailto:${escapeHtml(email)}" style="color:#0f172a;">${escapeHtml(email)}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#64748b;font-weight:600;vertical-align:top;">Subject</td>
                  <td style="padding:8px 0;font-size:14px;color:#334155;">${escapeHtml(subjectLabel)}</td>
                </tr>
              </table>
              <div style="padding:16px;background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:600;">Message</p>
                <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Reply directly to this email to respond to the customer.
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
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  const origin = req.headers.get("origin");
  const cors = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed", requestId }, 405, cors);
  }

  /* ---------- rate limit ---------- */
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";

  if (isRateLimited(clientIp)) {
    console.warn(
      JSON.stringify({ requestId, event: "contact_form_rate_limited", ip: clientIp }),
    );
    return jsonResponse(
      { error: "rate_limited", message: "Too many submissions. Please try again in a minute.", requestId },
      429,
      cors,
    );
  }

  /* ---------- parse ---------- */
  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400, cors);
  }

  /* ---------- honeypot ---------- */
  if (payload.website && payload.website.trim() !== "") {
    // Bot filled the honeypot — silently accept to avoid detection
    console.warn(
      JSON.stringify({ requestId, event: "contact_form_honeypot_triggered" }),
    );
    return jsonResponse({ success: true, requestId }, 200, cors);
  }

  /* ---------- validate ---------- */
  const { name, email, subject, message } = payload;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return jsonResponse(
      { error: "missing_fields", message: "All fields are required.", requestId },
      400,
      cors,
    );
  }

  if (name.trim().length > 200 || message.trim().length > 5000) {
    return jsonResponse(
      { error: "field_too_long", message: "Name or message exceeds maximum length.", requestId },
      400,
      cors,
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return jsonResponse(
      { error: "invalid_email", message: "Please provide a valid email address.", requestId },
      400,
      cors,
    );
  }

  if (!VALID_SUBJECTS.has(subject)) {
    return jsonResponse(
      { error: "invalid_subject", message: "Invalid subject category.", requestId },
      400,
      cors,
    );
  }

  /* ---------- env ---------- */
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error(
      JSON.stringify({ requestId, event: "contact_form_missing_resend_key" }),
    );
    return jsonResponse(
      { error: "server_error", message: "Email service not configured.", requestId },
      500,
      cors,
    );
  }

  const supportEmail = Deno.env.get("SUPPORT_EMAIL") ?? "support@snusfriends.com";

  /* ---------- build & send ---------- */
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
  const emailSubjectLine = `[Contact Form] ${subjectLabel} — ${name.trim()}`;
  const html = buildContactEmailHtml({
    name: name.trim(),
    email: email.trim(),
    subject,
    message: message.trim(),
  });

  console.log(
    JSON.stringify({
      requestId,
      event: "contact_form_sending",
      from_email: email.trim(),
      subject: emailSubjectLine,
    }),
  );

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SnusFriend Contact <noreply@snusfriends.com>",
        to: [supportEmail],
        reply_to: email.trim(),
        subject: emailSubjectLine,
        html,
      }),
    });

    const resendBody = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error(
        JSON.stringify({
          requestId,
          event: "contact_form_resend_error",
          status: resendResponse.status,
          resendError: resendBody,
        }),
      );
      return jsonResponse(
        { error: "email_send_failed", message: "Failed to send your message. Please try again.", requestId },
        502,
        cors,
      );
    }

    console.log(
      JSON.stringify({
        requestId,
        event: "contact_form_sent",
        emailId: resendBody.id ?? null,
      }),
    );

    return jsonResponse({ success: true, requestId }, 200, cors);
  } catch (err) {
    console.error(
      JSON.stringify({
        requestId,
        event: "contact_form_fetch_error",
        error: String(err),
      }),
    );
    return jsonResponse(
      { error: "email_send_failed", message: "Failed to send your message. Please try again.", requestId },
      502,
      cors,
    );
  }
});
