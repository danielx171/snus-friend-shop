import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  // Auth check – caller must be admin
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

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

  // Parse sync type from query
  const url = new URL(req.url);
  const syncType = url.searchParams.get('type') || 'catalog'; // catalog | inventory

  // Create sync run record
  const startTime = Date.now();
  const { data: syncRun, error: insertError } = await adminClient
    .from('sync_runs')
    .insert({ type: syncType, status: 'running', started_at: new Date().toISOString() })
    .select('id')
    .single();

  if (insertError || !syncRun) {
    return new Response(JSON.stringify({ error: 'Failed to create sync run', details: insertError?.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const syncRunId = syncRun.id;

  try {
    const nyehandelToken = Deno.env.get('NYEHANDEL_API_TOKEN');
    const nyehandelBaseUrl = Deno.env.get('NYEHANDEL_API_URL') || 'https://api.nyehandel.se/v1';

    if (!nyehandelToken) {
      // No external API configured – mark run as failed
      await adminClient.from('sync_runs').update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
        error_details: { message: 'NYEHANDEL_API_TOKEN not configured' },
      }).eq('id', syncRunId);

      return new Response(JSON.stringify({ error: 'nyehandel_not_configured', syncRunId }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resource = syncType === 'catalog' ? 'products' : 'inventory';
    const resp = await fetch(`${nyehandelBaseUrl}/${resource}`, {
      headers: { 'Authorization': `Bearer ${nyehandelToken}`, 'Accept': 'application/json' },
    });

    if (!resp.ok) {
      await adminClient.from('sync_runs').update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
        error_details: { message: `Nyehandel API returned ${resp.status}` },
      }).eq('id', syncRunId);

      return new Response(JSON.stringify({ error: 'upstream_error', status: resp.status, syncRunId }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await resp.json();
    const items = Array.isArray(body) ? body : (body.data ?? []);
    let processed = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    if (syncType === 'catalog') {
      for (const item of items) {
        try {
          // Upsert brand
          const brandSlug = (item.brand || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const { data: brand } = await adminClient
            .from('brands')
            .upsert({ slug: brandSlug, name: item.brand || 'Unknown', manufacturer: item.manufacturer }, { onConflict: 'slug' })
            .select('id')
            .single();

          if (!brand) { errors++; continue; }

          const productSlug = (item.name || `product-${item.id}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const { error: prodErr } = await adminClient.from('products').upsert({
            nyehandel_id: String(item.id || item.product_id || item.sku),
            brand_id: brand.id,
            slug: productSlug,
            name: item.name || 'Unnamed',
            flavor_key: item.flavor || item.flavor_key || 'mint',
            strength_key: item.strength || item.strength_key || 'normal',
            format_key: item.format || item.format_key || 'slim',
            nicotine_mg: item.nicotine_mg ?? item.nicotine ?? 0,
            portions_per_can: item.portions_per_can ?? item.portions ?? 20,
            image_url: item.image_url || item.image || null,
            manufacturer: item.manufacturer,
            badge_keys: item.badges || item.badge_keys || [],
            is_active: item.is_active !== false,
          }, { onConflict: 'nyehandel_id' });

          if (prodErr) {
            // Fallback: try upsert on slug
            await adminClient.from('products').upsert({
              nyehandel_id: String(item.id || item.product_id || item.sku),
              brand_id: brand.id,
              slug: productSlug + '-' + Date.now(),
              name: item.name || 'Unnamed',
              flavor_key: item.flavor || item.flavor_key || 'mint',
              strength_key: item.strength || item.strength_key || 'normal',
              format_key: item.format || item.format_key || 'slim',
              nicotine_mg: item.nicotine_mg ?? item.nicotine ?? 0,
              portions_per_can: item.portions_per_can ?? item.portions ?? 20,
              image_url: item.image_url || item.image || null,
              manufacturer: item.manufacturer,
              badge_keys: item.badges || item.badge_keys || [],
              is_active: item.is_active !== false,
            }, { onConflict: 'slug' });
          }

          // Upsert variant prices if present
          if (item.prices && typeof item.prices === 'object') {
            for (const [packKey, price] of Object.entries(item.prices)) {
              const packSize = parseInt(packKey.replace('pack', ''), 10);
              if (!isNaN(packSize) && typeof price === 'number') {
                // Get product id
                const { data: prod } = await adminClient.from('products').select('id').eq('nyehandel_id', String(item.id || item.product_id || item.sku)).single();
                if (prod) {
                  await adminClient.from('product_variants').upsert({
                    product_id: prod.id,
                    pack_size: packSize,
                    price,
                    sku: item.sku ? `${item.sku}-${packSize}` : null,
                  }, { onConflict: 'product_id,pack_size' });
                }
              }
            }
          }

          processed++;
        } catch (e) {
          errors++;
          errorDetails.push(String(e));
        }
      }
    } else {
      // Inventory sync
      for (const item of items) {
        try {
          const sku = item.sku || item.variant_sku;
          if (!sku) { errors++; continue; }
          
          const { data: variant } = await adminClient
            .from('product_variants')
            .select('id')
            .eq('sku', sku)
            .maybeSingle();

          if (variant) {
            await adminClient.from('inventory').upsert({
              variant_id: variant.id,
              quantity: item.quantity ?? item.available ?? 0,
              warehouse: item.warehouse || item.location || 'default',
            }, { onConflict: 'variant_id' });
            processed++;
          } else {
            errors++;
            errorDetails.push(`No variant for SKU: ${sku}`);
          }
        } catch (e) {
          errors++;
          errorDetails.push(String(e));
        }
      }
    }

    const finalStatus = errors === 0 ? 'success' : (processed > 0 ? 'partial' : 'failed');
    const durationMs = Date.now() - startTime;

    await adminClient.from('sync_runs').update({
      status: finalStatus,
      completed_at: new Date().toISOString(),
      duration_ms: durationMs,
      items_processed: processed,
      errors,
      error_details: errorDetails.length > 0 ? errorDetails.slice(0, 20) : null,
    }).eq('id', syncRunId);

    return new Response(JSON.stringify({
      syncRunId,
      status: finalStatus,
      itemsProcessed: processed,
      errors,
      durationMs,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('Sync error:', err);
    await adminClient.from('sync_runs').update({
      status: 'failed',
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - startTime,
      error_details: { message: String(err) },
    }).eq('id', syncRunId);

    return new Response(JSON.stringify({ error: 'sync_failed', syncRunId }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
