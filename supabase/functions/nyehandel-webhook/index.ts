import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-nyehandel-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Topics that should trigger a sync
const SYNC_TRIGGERS = [
  "product/created",
  "product/updated",
  "product/deleted",
  "inventory/updated",
  "inventory/sync",
  "price/updated",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const expected = Deno.env.get("NYEHANDEL_WEBHOOK_SECRET");
  const provided = req.headers.get("x-api-key");

  if (!expected) {
    return new Response(JSON.stringify({ error: "missing_webhook_secret" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!provided || provided !== expected) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await req.json();
    const topic = body.topic || body.event || "unknown";
    const provider = body.provider || "nyehandel";

    // Write to webhook_inbox
    const { data: webhook, error: insertError } = await adminClient
      .from("webhook_inbox")
      .insert({
        provider,
        topic,
        status: "received",
        attempts: 1,
        received_at: new Date().toISOString(),
        payload: body,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to insert webhook:", insertError);
      return new Response(JSON.stringify({ error: "insert_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if this topic should trigger a sync
    let syncTriggered = false;
    if (SYNC_TRIGGERS.includes(topic)) {
      // Determine sync type
      const syncType = topic.startsWith("inventory") ? "inventory" : "catalog";

      // Call sync-nyehandel edge function (fire & forget with service role)
      try {
        const syncUrl = `${supabaseUrl}/functions/v1/sync-nyehandel?type=${syncType}`;
        // We use a service-role based approach: create a temporary admin session
        // For now, just record that a sync was queued
        await adminClient.from("sync_runs").insert({
          type: syncType,
          status: "running",
          started_at: new Date().toISOString(),
          error_details: { triggered_by: `webhook:${webhook.id}` },
        });
        syncTriggered = true;
      } catch (e) {
        console.error("Failed to queue sync:", e);
      }

      // Update webhook status
      await adminClient
        .from("webhook_inbox")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
        })
        .eq("id", webhook.id);
    } else {
      // Non-sync webhook – mark as processed
      await adminClient
        .from("webhook_inbox")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
        })
        .eq("id", webhook.id);
    }

    return new Response(
      JSON.stringify({
        received: true,
        webhookId: webhook.id,
        syncTriggered,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: "processing_failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
