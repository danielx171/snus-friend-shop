import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NyehandelVariant {
  id?: number;
  sku?: string;
  gtin?: string;
  stock?: number;
  weight?: number;
  prices?: Array<{ price?: number; currency_id?: number; tier?: number }>;
  options?: Array<{ type?: string; value?: string }>;
}

interface NyehandelProduct {
  id?: number;
  name?: string;
  status?: string;
  vat_rate?: number;
  variants?: NyehandelVariant[];
  categories?: unknown[];
  brand_name?: string;
  images?: Array<{ url?: string }>;
}

interface NyehandelPaginatedResponse {
  data?: NyehandelProduct[];
  meta?: { current_page?: number; last_page?: number; total?: number };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  /* ---------- auth: caller must be admin ---------- */
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !userData?.user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: roleData } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', userData.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!roleData) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }

  /* ---------- env ---------- */
  const nyehandelToken = Deno.env.get('NYEHANDEL_API_TOKEN');
  const nyehandelBaseUrl =
    Deno.env.get('NYEHANDEL_API_BASE_URL') ||
    Deno.env.get('NYEHANDEL_API_URL') ||
    'https://api.nyehandel.se/api/v2';
  const nyehandelXIdentifier = Deno.env.get('NYEHANDEL_X_IDENTIFIER') ?? '';

  if (!nyehandelToken) {
    return jsonResponse({ error: 'nyehandel_not_configured', message: 'NYEHANDEL_API_TOKEN not set' }, 503);
  }

  /* ---------- create sync run record ---------- */
  const startTime = Date.now();
  const { data: syncRun, error: insertError } = await adminClient
    .from('sync_runs')
    .insert({ type: 'catalog', status: 'running', started_at: new Date().toISOString() })
    .select('id')
    .single();

  if (insertError || !syncRun) {
    return jsonResponse({ error: 'Failed to create sync run', details: insertError?.message }, 500);
  }

  const syncRunId = syncRun.id;
  let totalProducts = 0;
  let totalVariants = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  try {
    /* ---------- paginated fetch from Nyehandel ---------- */
    let currentPage = 1;
    let lastPage = 1;
    const allProducts: NyehandelProduct[] = [];

    while (currentPage <= lastPage) {
      console.log(`sync-nyehandel: fetching page ${currentPage}/${lastPage}...`);

      const resp = await fetch(
        `${nyehandelBaseUrl}/products?page=${currentPage}&per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${nyehandelToken}`,
            Accept: 'application/json',
            'X-identifier': nyehandelXIdentifier,
          },
        },
      );

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(`Nyehandel API returned ${resp.status}: ${errText.slice(0, 300)}`);
      }

      const body = (await resp.json()) as NyehandelPaginatedResponse;
      const products = body.data ?? (Array.isArray(body) ? (body as NyehandelProduct[]) : []);
      allProducts.push(...products);

      // Update pagination info from meta
      if (body.meta) {
        lastPage = body.meta.last_page ?? 1;
      }

      currentPage++;
    }

    console.log(`sync-nyehandel: fetched ${allProducts.length} products across ${lastPage} page(s)`);

    /* ---------- process each product ---------- */
    for (const product of allProducts) {
      try {
        if (!product.id || !product.name) {
          errors++;
          errorDetails.push(`Skipping product with missing id or name`);
          continue;
        }

        const nyehandelId = String(product.id);
        const productSlug = slugify(product.name) || `product-${nyehandelId}`;

        // Upsert brand
        const brandName = product.brand_name || 'Unknown';
        const brandSlug = slugify(brandName) || 'unknown';
        const { data: brand } = await adminClient
          .from('brands')
          .upsert({ slug: brandSlug, name: brandName }, { onConflict: 'slug' })
          .select('id')
          .single();

        if (!brand) {
          errors++;
          errorDetails.push(`Brand upsert failed for: ${brandName}`);
          continue;
        }

        // Upsert product
        const imageUrl = product.images?.[0]?.url ?? null;
        const isActive = product.status === 'published';

        const { data: upsertedProduct, error: prodErr } = await adminClient
          .from('products')
          .upsert(
            {
              nyehandel_id: nyehandelId,
              brand_id: brand.id,
              slug: productSlug,
              name: product.name,
              image_url: imageUrl,
              is_active: isActive,
              flavor_key: 'mint',
              strength_key: 'normal',
              format_key: 'slim',
            },
            { onConflict: 'nyehandel_id' },
          )
          .select('id')
          .single();

        if (prodErr || !upsertedProduct) {
          // Slug conflict — try with nyehandel_id suffix
          const { data: retryProduct, error: retryErr } = await adminClient
            .from('products')
            .upsert(
              {
                nyehandel_id: nyehandelId,
                brand_id: brand.id,
                slug: `${productSlug}-${nyehandelId}`,
                name: product.name,
                image_url: imageUrl,
                is_active: isActive,
                flavor_key: 'mint',
                strength_key: 'normal',
                format_key: 'slim',
              },
              { onConflict: 'nyehandel_id' },
            )
            .select('id')
            .single();

          if (retryErr || !retryProduct) {
            errors++;
            errorDetails.push(`Product upsert failed: ${product.name} — ${retryErr?.message ?? prodErr?.message}`);
            continue;
          }

          // Process variants for the retry product
          await processVariants(adminClient, retryProduct.id, product.variants ?? []);
          totalProducts++;
          totalVariants += (product.variants ?? []).length;
          continue;
        }

        // Process variants
        await processVariants(adminClient, upsertedProduct.id, product.variants ?? []);
        totalProducts++;
        totalVariants += (product.variants ?? []).length;
      } catch (e) {
        errors++;
        errorDetails.push(`Product ${product.name ?? product.id}: ${String(e)}`);
      }
    }

    /* ---------- finalize sync run ---------- */
    const finalStatus = errors === 0 ? 'success' : totalProducts > 0 ? 'partial' : 'failed';
    const durationMs = Date.now() - startTime;

    await adminClient
      .from('sync_runs')
      .update({
        status: finalStatus,
        completed_at: new Date().toISOString(),
        duration_ms: durationMs,
        items_processed: totalProducts,
        errors,
        error_details: errorDetails.length > 0 ? errorDetails.slice(0, 50) : null,
      })
      .eq('id', syncRunId);

    console.log(
      `sync-nyehandel: done — ${totalProducts} products, ${totalVariants} variants, ${errors} errors, ${durationMs}ms`,
    );

    return jsonResponse({
      syncRunId,
      status: finalStatus,
      productsProcessed: totalProducts,
      variantsProcessed: totalVariants,
      errors,
      errorDetails: errorDetails.slice(0, 20),
      durationMs,
    });
  } catch (err) {
    console.error('sync-nyehandel fatal error:', err);
    await adminClient
      .from('sync_runs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
        error_details: { message: String(err) },
      })
      .eq('id', syncRunId);

    return jsonResponse({ error: 'sync_failed', message: String(err), syncRunId }, 500);
  }
});

/* ------------------------------------------------------------------ */
/*  Variant processing                                                 */
/* ------------------------------------------------------------------ */

async function processVariants(
  adminClient: ReturnType<typeof createClient>,
  productId: string,
  variants: NyehandelVariant[],
): Promise<void> {
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    if (!variant.sku) continue;

    const price = variant.prices?.[0]?.price ?? 0;
    // Nyehandel prices are in lowest currency unit (e.g. 4900 = 49.00)
    const priceDecimal = price / 100;

    const variantData: Record<string, unknown> = {
      product_id: productId,
      sku: variant.sku,
      price: priceDecimal,
      is_default: i === 0,
      pack_size: 1, // Nyehandel variants don't use pack_size; default to 1
      gtin: variant.gtin ?? null,
      nyehandel_variant_id: variant.id != null ? String(variant.id) : null,
    };

    // Upsert by SKU (unique constraint)
    await adminClient.from('product_variants').upsert(variantData, { onConflict: 'sku' });

    // Upsert inventory
    if (variant.stock != null) {
      const { data: variantRow } = await adminClient
        .from('product_variants')
        .select('id')
        .eq('sku', variant.sku)
        .maybeSingle();

      if (variantRow) {
        await adminClient.from('inventory').upsert(
          {
            variant_id: variantRow.id,
            quantity: variant.stock,
            warehouse: 'nordicpouch',
          },
          { onConflict: 'variant_id' },
        );
      }
    }
  }
}
