import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'method_not_allowed', requestId }),
        { status: 405, headers: JSON_HEADERS }
      );
    }

    // Auth via JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', requestId }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY', { requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    // Verify the JWT by creating a client with the user's token
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', requestId }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    // Parse body
    const body = await req.json();
    const code = body?.code;

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'missing_code', requestId }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    // Call RPC with service role (security definer function)
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data, error } = await adminClient.rpc('redeem_referral_code', {
      p_code: code,
      p_new_user_id: user.id,
    });

    if (error) {
      console.error('redeem_referral_code RPC error', { error, requestId });
      return new Response(
        JSON.stringify({ error: 'rpc_error', message: error.message, requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({ ...data, requestId }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch (err) {
    console.error('Unexpected error in redeem-referral', { error: err, requestId });
    return new Response(
      JSON.stringify({ error: 'internal', requestId }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
});
