import process from 'node:process';
import { getOption } from './google-auth';
import { fetchPagespeedReport, summarizePagespeedReport, type Strategy } from './pagespeed-client';
import { DEFAULT_PAGESPEED_PATHS, toAbsoluteUrl } from './seo-audit-config';
import { chunk, getSupabaseAdmin } from './supabase-admin';

const args = process.argv.slice(2);
const onlyPath = getOption(args, 'path');
const limit = Number.parseInt(getOption(args, 'limit') ?? `${DEFAULT_PAGESPEED_PATHS.length}`, 10);

const targetPaths = onlyPath
  ? [onlyPath.startsWith('http') ? onlyPath : toAbsoluteUrl(onlyPath)]
  : DEFAULT_PAGESPEED_PATHS.slice(0, Number.isFinite(limit) ? limit : DEFAULT_PAGESPEED_PATHS.length).map(
      toAbsoluteUrl,
    );

const strategies: Strategy[] = ['mobile', 'desktop'];

try {
  const supabase = getSupabaseAdmin();
  const rows = [];

  for (const targetUrl of targetPaths) {
    for (const strategy of strategies) {
      const report = await fetchPagespeedReport({ strategy, targetUrl });
      const summary = summarizePagespeedReport(report);
      rows.push({
        url: targetUrl,
        device: strategy,
        performance_score: summary.performanceScore,
        accessibility_score: summary.accessibilityScore,
        best_practices_score: summary.bestPracticesScore,
        seo_score: summary.seoScore,
        lcp_ms: summary.lcpMs,
        fid_ms: null,
        cls: summary.cls,
        inp_ms: summary.inpMs,
        ttfb_ms: summary.ttfbMs,
        raw_data: {
          id: report.id,
          loadingExperience: report.loadingExperience ?? null,
          originLoadingExperience: report.originLoadingExperience ?? null,
          lighthouseResult: report.lighthouseResult ?? null,
          topOpportunities: summary.opportunities.map((item) => ({
            title: item.title,
            displayValue: item.displayValue ?? null,
            numericValue: item.numericValue ?? null,
          })),
        },
      });
    }
  }

  for (const batch of chunk(rows, 50)) {
    if (batch.length === 0) continue;
    const { error } = await supabase.from('seo_pagespeed_audits').insert(batch);
    if (error) throw error;
  }

  console.log(`Saved ${rows.length} PageSpeed snapshots across ${targetPaths.length} URLs.`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    'PageSpeed sync failed. Confirm SUPABASE_SERVICE_ROLE_KEY is set and PAGESPEED_API_KEY is a server-safe key for CLI usage.',
  );
  console.error(message);
  process.exit(1);
}
