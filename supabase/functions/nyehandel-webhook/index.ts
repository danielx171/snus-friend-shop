import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-nyehandel-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYNC_TRIGGERS = ['product/created', 'product/updated', 'product/deleted', 'inventory/updated', 'inventory/sync', 'price/updated'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // --- Shared-secret auth (server-to-server) ---
  const webhookSecret = Deno.env.get('NYEHANDEL_WEBHOOK_SECRET');
  if (!webhookSecret) {
    console.error('NYEHANDEL_WEBHOOK_SECRET is not configured');
    return json({ error: 'Server misconfiguration' }, 500);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
    console.warn('Webhook auth failed – invalid or missing Authorization header');
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await req.json();
    const topic = body.topic || body.event || 'unknown';
    const provider = body.provider || 'nyehandel';

    // Extract a searchable summary (order id, product id, etc.)
    const orderId = body.order_id || body.orderId || body.data?.order_id || body.data?.id || null;
    const summary = orderId ? `order:${orderId}` : topic;

    // Write to webhook_inbox
    const { data: webhook, error: insertError } = await adminClient
      .from('webhook_inbox')
      .insert({
        provider,
        topic: summary,
        status: 'received',
        attempts: 1,
        received_at: new Date().toISOString(),
        payload: body,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Failed to insert webhook:', insertError);
      return json({ error: 'insert_failed' }, 500);
    }

    console.log(`Webhook stored: id=${webhook.id} topic=${topic} summary=${summary}`);

    // Check if this topic should trigger a sync
    let syncTriggered = false;
    if (SYNC_TRIGGERS.includes(topic)) {
      const syncType = topic.startsWith('inventory') ? 'inventory' : 'catalog';
      try {
        await adminClient.from('sync_runs').insert({
          type: syncType,
          status: 'running',
          started_at: new Date().toISOString(),
          error_details: { triggered_by: `webhook:${webhook.id}` },
        });
        syncTriggered = true;
      } catch (e) {
        console.error('Failed to queue sync:', e);
      }
    }

    // Mark processed
    await adminClient.from('webhook_inbox').update({
      status: 'processed',
      processed_at: new Date().toISOString(),
    }).eq('id', webhook.id);

    return json({ received: true, webhookId: webhook.id, syncTriggered });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return json({ error: 'processing_failed' }, 500);
  }
});
