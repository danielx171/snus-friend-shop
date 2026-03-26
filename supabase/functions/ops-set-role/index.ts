import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    if (req.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

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

    // Parse body
    const body = await req.json();
    const { user_id, role, action } = body as { user_id?: string; role?: string; action?: string };

    if (!user_id || !role || !action) {
      return json({ error: 'Missing user_id, role, or action' }, 400);
    }

    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(role)) {
      return json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` }, 400);
    }

    if (action !== 'grant' && action !== 'revoke') {
      return json({ error: 'Action must be "grant" or "revoke"' }, 400);
    }

    // Prevent removing own admin
    if (action === 'revoke' && role === 'admin' && user_id === callerId) {
      return json({ error: 'Cannot revoke your own admin role' }, 400);
    }

    if (action === 'grant') {
      const { error } = await adminClient
        .from('user_roles')
        .upsert({ user_id, role }, { onConflict: 'user_id,role', ignoreDuplicates: true });

      if (error) {
        console.error('grant role error:', error.message);
        return json({ error: 'Failed to grant role' }, 500);
      }
      console.log(`Role ${role} granted to ${user_id} by ${callerId}`);
      return json({ ok: true, message: `Role "${role}" granted` });
    } else {
      const { error } = await adminClient
        .from('user_roles')
        .delete()
        .eq('user_id', user_id)
        .eq('role', role);

      if (error) {
        console.error('revoke role error:', error.message);
        return json({ error: 'Failed to revoke role' }, 500);
      }
      console.log(`Role ${role} revoked from ${user_id} by ${callerId}`);
      return json({ ok: true, message: `Role "${role}" revoked` });
    }
  } catch (err) {
    console.error('ops-set-role error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
});
