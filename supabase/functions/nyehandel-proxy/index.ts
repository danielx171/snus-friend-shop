import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

const ALLOWED_RESOURCES = ['products', 'inventory', 'orders', 'webhooks', 'sync-runs', 'sku-mappings'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'method_not_allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // Authenticate caller
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return new Response(
      JSON.stringify({ error: 'unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // Enforce that caller has admin or ops role using has_role helper
  const userId = userData.user.id;
  const [{ data: isAdmin, error: adminErr }, { data: isOps, error: opsErr }] = await Promise.all([
    supabase.rpc('has_role', { _role: 'admin', _user_id: userId }),
    supabase.rpc('has_role', { _role: 'ops', _user_id: userId }),
  ]);

  if (adminErr && opsErr) {
    console.error('role check failed', { adminErr, opsErr });
    return new Response(
      JSON.stringify({ error: 'role_check_failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  if (!isAdmin && !isOps) {
    return new Response(
      JSON.stringify({ error: 'forbidden' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // Validate resource parameter (allowlist)
  const url = new URL(req.url);
  const resource = url.searchParams.get('resource');

  if (!resource || !ALLOWED_RESOURCES.includes(resource) || resource.includes('/')) {
    return new Response(
      JSON.stringify({ error: 'Invalid resource parameter' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // Read server-side Nyehandel token
  const nyehandelToken = Deno.env.get('NYEHANDEL_API_TOKEN');
  const nyehandelBaseUrl = Deno.env.get('NYEHANDEL_API_URL') || 'https://api.nyehandel.se/api/v2';

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
        'X-Language': 'en',
        'X-identifier': Deno.env.get('NYEHANDEL_X_IDENTIFIER') ?? '',
      },
    });

    let parsed: unknown = null;
    const contentType = resp.headers.get('content-type') ?? '';

    if (contentType.toLowerCase().includes('application/json')) {
      try {
        parsed = await resp.json();
      } catch {
        const textBody = await resp.text();
        parsed = textBody;
      }
    } else {
      const textBody = await resp.text();
      parsed = textBody;
    }

    // For upstream errors, log details server-side but return a generic message to the client
    if (!resp.ok) {
      console.error('Nyehandel upstream error:', JSON.stringify({ status: resp.status, resource, body: parsed }));
      return new Response(
        JSON.stringify({ error: 'upstream_error', status: resp.status }),
        { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ data: parsed, status: resp.status }),
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
