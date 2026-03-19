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
  /** Some accounts return brand_name, others return brand: { name } */
  brand_name?: string;
  brand?: { id?: number; name?: string };
  images?: Array<{ url?: string }>;
  specifications?: Array<{ key?: string; value?: string }>;
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

/** Extract a spec value by key from the Nyehandel specifications array */
function getSpec(specs: Array<{ key?: string; value?: string }> | undefined, key: string): string | null {
  if (!specs) return null;
  const match = specs.find((s) => s.key?.toLowerCase() === key.toLowerCase());
  return match?.value ?? null;
}

/** Map a Nyehandel spec value to our flavor_key enum */
function toFlavorKey(spec: string | null): string {
  if (!spec) return 'mint';
  const lower = spec.toLowerCase();
  if (lower.includes('berry') || lower.includes('blueberry') || lower.includes('raspberry')) return 'berry';
  if (lower.includes('citrus') || lower.includes('lemon') || lower.includes('orange')) return 'citrus';
  if (lower.includes('coffee') || lower.includes('espresso')) return 'coffee';
  if (lower.includes('licorice') || lower.includes('liquorice')) return 'licorice';
  if (lower.includes('cola')) return 'cola';
  if (lower.includes('tropical') || lower.includes('mango')) return 'tropical';
  if (lower.includes('vanilla')) return 'vanilla';
  if (lower.includes('fruit')) return 'fruit';
  return 'mint'; // default
}

/** Map nicotine mg/pouch to our strength_key enum */
function toStrengthKey(mgPerPouch: number | null): string {
  if (mgPerPouch == null) return 'normal';
  if (mgPerPouch <= 4) return 'normal';
  if (mgPerPouch <= 8) return 'strong';
  if (mgPerPouch <= 12) return 'extraStrong';
  return 'ultraStrong';
}

/** Map format spec to our format_key enum */
function toFormatKey(spec: string | null): string {
  if (!spec) return 'slim';
  const lower = spec.toLowerCase();
  if (lower.includes('mini')) return 'mini';
  if (lower.includes('large')) return 'large';
  if (lower.includes('original')) return 'original';
  return 'slim'; // default
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

  /* ---------- optional page param for single-page sync ---------- */
  const url = new URL(req.url);
  const requestedPage = url.searchParams.get('page');
  const singlePageMode = requestedPage != null;
  const startPage = singlePageMode ? Math.max(1, parseInt(requestedPage, 10) || 1) : 1;

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
    /* ---------- paginated fetch + process from Nyehandel ---------- */
    let currentPage = startPage;
    let lastPage = startPage; // will be updated from API meta

    while (currentPage <= lastPage) {
      console.log(`sync-nyehandel: fetching page ${currentPage}...`);

      const resp = await fetch(
        `${nyehandelBaseUrl}/products?page=${currentPage}&per_page=50`,
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

      if (body.meta) {
        lastPage = body.meta.last_page ?? 1;
      }

      console.log(`sync-nyehandel: page ${currentPage}/${lastPage} — ${products.length} products`);

      /* ---------- process products from this page immediately ---------- */
      for (const product of products) {
      try {
        if (!product.id || !product.name) {
          errors++;
          errorDetails.push(`Skipping product with missing id or name`);
          continue;
        }

        const nyehandelId = String(product.id);
        const productSlug = slugify(product.name) || `product-${nyehandelId}`;

        // Upsert brand — handle both brand_name and brand.name shapes
        const brandName = product.brand?.name || product.brand_name || 'Unknown';
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

        // Extract product attributes from specifications
        const specs = product.specifications;
        const flavorSpec = getSpec(specs, 'Flavour') ?? getSpec(specs, 'Flavor');
        const formatSpec = getSpec(specs, 'Format');
        const nicotineMgStr = getSpec(specs, 'Nicotine (mg/pouch)') ?? getSpec(specs, 'Nicotine mg/g');
        const nicotineMg = nicotineMgStr ? parseFloat(nicotineMgStr) : 0;
        const portionsStr = getSpec(specs, 'Number of Portions');
        const portions = portionsStr ? parseInt(portionsStr, 10) : 20;

        // Upsert product
        const imageUrl = product.images?.[0]?.url ?? null;
        const isActive = product.status === 'published';

        const productFields = {
          brand_id: brand.id,
          name: product.name,
          image_url: imageUrl,
          is_active: isActive,
          flavor_key: toFlavorKey(flavorSpec),
          strength_key: toStrengthKey(nicotineMg),
          format_key: toFormatKey(formatSpec),
          nicotine_mg: nicotineMg,
          portions_per_can: portions || 20,
        };

        // Check if product already exists by nyehandel_id
        const { data: existing } = await adminClient
          .from('products')
          .select('id')
          .eq('nyehandel_id', nyehandelId)
          .maybeSingle();

        let upsertedProduct: { id: string } | null = null;

        if (existing) {
          // Update existing product
          await adminClient
            .from('products')
            .update(productFields)
            .eq('id', existing.id);
          upsertedProduct = existing;
        } else {
          // Insert new product
          const { data: inserted, error: insertErr } = await adminClient
            .from('products')
            .insert({ ...productFields, nyehandel_id: nyehandelId, slug: productSlug })
            .select('id')
            .single();

          if (insertErr || !inserted) {
            // Slug conflict — try with nyehandel_id suffix
            const { data: retryInsert, error: retryErr } = await adminClient
              .from('products')
              .insert({ ...productFields, nyehandel_id: nyehandelId, slug: `${productSlug}-${nyehandelId}` })
              .select('id')
              .single();

            if (retryErr || !retryInsert) {
              errors++;
              errorDetails.push(`Product insert failed: ${product.name} — ${retryErr?.message ?? insertErr?.message}`);
              continue;
            }
            upsertedProduct = retryInsert;
          } else {
            upsertedProduct = inserted;
          }
        }

        if (!upsertedProduct) {
          errors++;
          errorDetails.push(`Product upsert resolved null: ${product.name}`);
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
    } // end for products on this page

      // In single-page mode, stop after one page
      if (singlePageMode) break;
      currentPage++;
    } // end while pages

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
      page: singlePageMode ? startPage : undefined,
      lastPage,
      nextPage: singlePageMode && startPage < lastPage ? startPage + 1 : undefined,
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

    const variantFields = {
      product_id: productId,
      price: priceDecimal,
      is_default: i === 0,
      pack_size: 1,
    };

    // Check if variant already exists by sku
    const { data: existingVariant } = await adminClient
      .from('product_variants')
      .select('id')
      .eq('sku', variant.sku)
      .maybeSingle();

    let variantId: string | null = null;

    if (existingVariant) {
      await adminClient
        .from('product_variants')
        .update(variantFields)
        .eq('id', existingVariant.id);
      variantId = existingVariant.id;
    } else {
      const { data: inserted } = await adminClient
        .from('product_variants')
        .insert({ ...variantFields, sku: variant.sku })
        .select('id')
        .single();
      variantId = inserted?.id ?? null;
    }

    // Upsert inventory
    if (variant.stock != null && variantId) {
      // Check if inventory row exists
      const { data: existingInv } = await adminClient
        .from('inventory')
        .select('id')
        .eq('variant_id', variantId)
        .maybeSingle();

      if (existingInv) {
        await adminClient
          .from('inventory')
          .update({ quantity: variant.stock, warehouse: 'nordicpouch' })
          .eq('id', existingInv.id);
      } else {
        await adminClient
          .from('inventory')
          .insert({ variant_id: variantId, quantity: variant.stock, warehouse: 'nordicpouch' });
      }
    }
  }
}
