declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

/* ------------------------------------------------------------------ */
/*  send-welcome-email                                                 */
/*  Called by a Supabase database webhook (pg_net) when a new user     */
/*  signs up. Sends a welcome email via the send-email function.       */
/* ------------------------------------------------------------------ */

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed", requestId }, 405);
  }

  /* ---------- auth: webhook secret ---------- */
  const webhookSecret = Deno.env.get("WELCOME_EMAIL_WEBHOOK_SECRET");
  if (!webhookSecret) {
    // Fall back to internal functions secret
    const internalSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
    const callerSecret = req.headers.get("x-internal-function-secret");
    if (!internalSecret || callerSecret !== internalSecret) {
      console.error(JSON.stringify({ requestId, event: "welcome_email_auth_failed" }));
      return jsonResponse({ error: "unauthorized", requestId }, 401);
    }
  } else {
    const callerSecret =
      req.headers.get("x-webhook-secret") ??
      req.headers.get("x-internal-function-secret");
    if (callerSecret !== webhookSecret) {
      // Also allow internal functions secret as fallback
      const internalSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
      if (!internalSecret || callerSecret !== internalSecret) {
        console.error(JSON.stringify({ requestId, event: "welcome_email_auth_failed" }));
        return jsonResponse({ error: "unauthorized", requestId }, 401);
      }
    }
  }

  /* ---------- parse payload ---------- */
  // Supabase database webhooks send: { type: "INSERT", table: "users", schema: "auth", record: {...}, old_record: null }
  // Direct calls send: { email, displayName }
  let email: string | undefined;
  let displayName: string | undefined;

  try {
    const body = await req.json();

    if (body.record) {
      // Database webhook payload
      const record = body.record as Record<string, unknown>;
      email = record.email as string | undefined;

      const meta = record.raw_user_meta_data as Record<string, unknown> | undefined;
      displayName = meta?.first_name
        ? String(meta.first_name)
        : meta?.full_name
          ? String(meta.full_name)
          : undefined;
    } else {
      // Direct call payload
      email = body.email as string | undefined;
      displayName = body.displayName as string | undefined;
    }
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400);
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    console.error(JSON.stringify({ requestId, event: "welcome_email_no_valid_email", email }));
    return jsonResponse({ error: "invalid_email", requestId }, 400);
  }

  /* ---------- env ---------- */
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const internalSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");

  if (!supabaseUrl || !internalSecret) {
    console.error(JSON.stringify({ requestId, event: "welcome_email_missing_env" }));
    return jsonResponse({ error: "missing_env", requestId }, 500);
  }

  /* ---------- send via send-email function ---------- */
  const supabaseFunctionsUrl = supabaseUrl.replace(".supabase.co", ".supabase.co/functions/v1");
  const customerName = displayName?.trim() || "Friend";

  console.log(JSON.stringify({
    requestId,
    event: "welcome_email_sending",
    email: email.trim(),
    customerName,
  }));

  try {
    const emailResponse = await fetch(`${supabaseFunctionsUrl}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-function-secret": internalSecret,
      },
      body: JSON.stringify({
        to: email.trim(),
        subject: `Welcome to SnusFriend, ${customerName}!`,
        template: "welcome",
        data: {
          customerName,
        },
      }),
    });

    const emailBody = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error(JSON.stringify({
        requestId,
        event: "welcome_email_send_failed",
        status: emailResponse.status,
        error: emailBody,
      }));
      return jsonResponse({ error: "email_send_failed", requestId }, 502);
    }

    console.log(JSON.stringify({
      requestId,
      event: "welcome_email_sent",
      emailId: emailBody.emailId ?? null,
    }));

    return jsonResponse({ ok: true, emailId: emailBody.emailId, requestId });
  } catch (err) {
    console.error(JSON.stringify({
      requestId,
      event: "welcome_email_fetch_error",
      error: String(err),
    }));
    return jsonResponse({ error: "email_fetch_failed", requestId }, 502);
  }
});
