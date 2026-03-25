import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { getCorsHeaders } from "../_shared/cors.ts";

/**
 * Batch review summary regeneration.
 * Queries products with 3+ reviews and calls generate-review-summary
 * for those where the summary is stale (review count changed by 3+).
 *
 * Auth: x-cron-secret (for pg_cron) or x-internal-function-secret.
 */

const MIN_REVIEWS = 3;
const REVIEW_DELTA_THRESHOLD = 3;

Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req.headers.get('origin'));
  const jsonHeaders = { ...cors, 'Content-Type': 'application/json' };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  const requestId = crypto.randomUUID();

  try {
    // Auth
    const cronSecret = Deno.env.get('CRON_SECRET');
    const internalSecret = Deno.env.get('INTERNAL_FUNCTIONS_SECRET');
    const providedCron = req.headers.get('x-cron-secret');
    const providedInternal = req.headers.get('x-internal-function-secret');

    const isAuthorized =
      (cronSecret && providedCron === cronSecret) ||
      (internalSecret && providedInternal === internalSecret);

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', requestId }),
        { status: 401, headers: jsonHeaders }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceKey) {
      console.error('Missing env vars', { requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: jsonHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Get review counts per product
    const { data: reviewCounts, error: countErr } = await supabase
      .rpc('get_review_counts_by_product');

    if (countErr) {
      // Fallback: manual query if RPC doesn't exist
      console.warn('RPC get_review_counts_by_product failed, using manual query', { error: countErr });
    }

    // Manual fallback: get products with enough reviews
    const { data: products, error: prodErr } = await supabase
      .from('product_reviews')
      .select('product_id')
      .eq('flagged', false);

    if (prodErr) {
      console.error('Failed to query product_reviews', { error: prodErr, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: jsonHeaders }
      );
    }

    // Count reviews per product
    const countMap = new Map<string, number>();
    for (const row of products ?? []) {
      countMap.set(row.product_id, (countMap.get(row.product_id) ?? 0) + 1);
    }

    // Filter to products with MIN_REVIEWS or more
    const eligibleProducts = Array.from(countMap.entries())
      .filter(([, count]) => count >= MIN_REVIEWS)
      .map(([productId, count]) => ({ productId, reviewCount: count }));

    if (eligibleProducts.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, skipped: 0, errors: 0, requestId }),
        { status: 200, headers: jsonHeaders }
      );
    }

    // Get existing summaries
    const productIds = eligibleProducts.map(p => p.productId);
    const { data: existingSummaries } = await supabase
      .from('review_summaries')
      .select('product_id, review_count_at_generation')
      .in('product_id', productIds);

    const summaryMap = new Map<string, number>();
    for (const s of existingSummaries ?? []) {
      summaryMap.set(s.product_id, s.review_count_at_generation);
    }

    // Determine which need regeneration
    const toRegenerate = eligibleProducts.filter(({ productId, reviewCount }) => {
      const existing = summaryMap.get(productId);
      if (existing === undefined) return true; // No summary yet
      return Math.abs(reviewCount - existing) >= REVIEW_DELTA_THRESHOLD;
    });

    let processed = 0;
    let skipped = eligibleProducts.length - toRegenerate.length;
    let errors = 0;

    // Call generate-review-summary for each (sequentially to avoid overloading)
    for (const { productId } of toRegenerate) {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/generate-review-summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-function-secret': internalSecret ?? cronSecret ?? '',
          },
          body: JSON.stringify({ product_id: productId }),
        });

        if (res.ok) {
          processed++;
        } else {
          const errBody = await res.text().catch(() => '');
          console.error('generate-review-summary failed', { productId, status: res.status, body: errBody, requestId });
          errors++;
        }
      } catch (err) {
        console.error('generate-review-summary fetch error', { productId, error: String(err), requestId });
        errors++;
      }
    }

    console.log('batch-review-summaries complete', { processed, skipped, errors, eligible: eligibleProducts.length, requestId });

    return new Response(
      JSON.stringify({ processed, skipped, errors, eligible: eligibleProducts.length, requestId }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    console.error('Unhandled error', { error: String(err), requestId });
    return new Response(
      JSON.stringify({ error: 'internal', requestId }),
      { status: 500, headers: jsonHeaders }
    );
  }
});
