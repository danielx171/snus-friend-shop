import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function requireAdmin(admin: ReturnType<typeof createClient>, token: string) {
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) return { ok: false as const, status: 401, body: { error: 'unauthorized' } };

  const userId = userData.user.id;

  const { data: roleRow } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (!roleRow) return { ok: false as const, status: 403, body: { error: 'forbidden' } };
  return { ok: true as const, userId };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'GET') return json(405, { error: 'method_not_allowed' });

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return json(401, { error: 'unauthorized' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('SB_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SB_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json(500, { error: 'missing_env' });

  const token = authHeader.replace('Bearer ', '');
  const admin = createClient(supabaseUrl, serviceRoleKey);

  const gate = await requireAdmin(admin, token);
  if (!gate.ok) return json(gate.status, gate.body);

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '50') || 50, 200);

  const { data, error } = await admin
    .from('webhook_inbox')
    .select('id, provider, topic, status, attempts, received_at, processed_at, payload')
    .order('received_at', { ascending: false })
    .limit(limit);

  if (error) return json(500, { error: 'db_failed' });

  return json(200, { events: data ?? [] });
});
