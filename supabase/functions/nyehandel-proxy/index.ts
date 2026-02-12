import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate caller
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  // Parse request
  const url = new URL(req.url);
  const resource = url.searchParams.get('resource'); // e.g. "products", "inventory", "webhooks"

  if (!resource) {
    return new Response(
      JSON.stringify({ error: 'Missing ?resource= query param' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // Read server-side Nyehandel token
  const nyehandelToken = Deno.env.get('NYEHANDEL_API_TOKEN');
  const nyehandelBaseUrl = Deno.env.get('NYEHANDEL_API_URL') || 'https://api.nyehandel.se/v1';

  if (!nyehandelToken) {
    // Return empty data with a flag so the client knows to fall back to mock
    return new Response(
      JSON.stringify({ error: 'nyehandel_not_configured', data: null }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const apiUrl = `${nyehandelBaseUrl}/${resource}`;
    const resp = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${nyehandelToken}`,
        'Accept': 'application/json',
      },
    });

    const body = await resp.json();
    return new Response(
      JSON.stringify({ data: body, status: resp.status }),
      { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'upstream_error', message: String(err) }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
