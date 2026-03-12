import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    // --- Auth check ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const callerId = claimsData.claims.sub;
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: roleCheck } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', callerId)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleCheck) {
      return json({ error: 'Forbidden' }, 403);
    }

    // --- Pagination ---
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '50', 10)));

    // List auth users via admin API
    const { data: { users }, error: listErr } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (listErr) {
      console.error('listUsers error:', listErr.message);
      return json({ error: 'Failed to list users' }, 500);
    }

    // Fetch roles for these users
    const userIds = users.map((u) => u.id);
    const { data: roles } = await adminClient
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds);

    const roleMap: Record<string, string[]> = {};
    for (const r of roles || []) {
      if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
      roleMap[r.user_id].push(r.role);
    }

    const result = users.map((u) => ({
      id: u.id,
      email: u.email ?? null,
      created_at: u.created_at,
      roles: roleMap[u.id] || [],
    }));

    return json({ users: result, page, perPage });
  } catch (err) {
    console.error('ops-users error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
});
