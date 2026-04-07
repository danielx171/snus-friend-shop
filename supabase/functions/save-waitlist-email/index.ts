import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-expect-error — Deno types: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'method_not_allowed', requestId }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, source = 'membership' } = body as { email?: string; source?: string };

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: 'invalid_email', requestId }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY', { requestId });
      return new Response(
        JSON.stringify({ error: 'server_misconfigured', requestId }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Upsert — duplicate email+source is silently ignored (already subscribed)
    const { error } = await admin
      .from('waitlist_emails')
      .upsert(
        { email: email.toLowerCase().trim(), source },
        { onConflict: 'email,source', ignoreDuplicates: true }
      );

    if (error) {
      console.error('waitlist insert error', { error, requestId });
      return new Response(
        JSON.stringify({ error: 'db_error', detail: error.message, requestId }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('waitlist signup', { email: email.toLowerCase().trim(), source, requestId });

    // Sync to Klaviyo (fire-and-forget) — subscribe to Email List
    const klaviyoKey = Deno.env.get('KLAVIYO_PRIVATE_API_KEY');
    if (klaviyoKey && (source === 'blog-newsletter' || source === 'footer-newsletter' || source === 'membership')) {
      fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Klaviyo-API-Key ${klaviyoKey}`,
          'revision': '2024-10-15',
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [{ type: 'profile', attributes: { email: email.toLowerCase().trim() } }],
              },
            },
            relationships: {
              list: { data: { type: 'list', id: 'XSsBfF' } },
            },
          },
        }),
      }).catch((err) => {
        console.error('klaviyo sync error', { error: String(err), requestId });
      });
    }

    return new Response(
      JSON.stringify({ ok: true, requestId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('unexpected error', { err, requestId });
    return new Response(
      JSON.stringify({ error: 'unexpected_error', requestId }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
