import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ALLOWED_RESOURCES = ['products', 'inventory', 'webhooks', 'sync-runs', 'sku-mappings'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate caller
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  // Check admin role server-side using service role client
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: roleData } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', userData.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!roleData) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // Validate resource parameter (allowlist)
  const url = new URL(req.url);
  const resource = url.searchParams.get('resource');

  if (!resource || !ALLOWED_RESOURCES.includes(resource)) {
    return new Response(
      JSON.stringify({ error: 'Invalid resource parameter' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // Read server-side Nyehandel token
  const nyehandelToken = Deno.env.get('NYEHANDEL_API_TOKEN');
  const nyehandelBaseUrl = Deno.env.get('NYEHANDEL_API_URL') || 'https://api.nyehandel.se/v1';

  if (!nyehandelToken) {
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
    console.error('Nyehandel API error:', err);
    return new Response(
      JSON.stringify({ error: 'service_unavailable' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
