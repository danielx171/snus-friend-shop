import process from 'node:process';
import { getOption } from './google-auth';
import { fetchOrganicSearchSnapshot } from './dataforseo-client';
import { DEFAULT_RANK_LIMIT } from './seo-audit-config';
import { chunk, getSupabaseAdmin } from './supabase-admin';

const args = process.argv.slice(2);
const keywordFilter = getOption(args, 'keyword');
const maxKeywords = Number.parseInt(getOption(args, 'limit') ?? '20', 10);
const maxResults = Number.parseInt(getOption(args, 'max-results') ?? `${DEFAULT_RANK_LIMIT}`, 10);

const normalizeHost = (url: string) => {
  const hostname = new URL(url).hostname.toLowerCase();
  return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
};

const matchesTrackedDomain = (url: string, trackedDomain: string) => {
  const hostname = normalizeHost(url);
  return hostname === trackedDomain || hostname.endsWith(`.${trackedDomain}`);
};

try {
  const supabase = getSupabaseAdmin();
  const { data: configRows, error: configError } = await supabase
    .from('seo_config')
    .select('key, value')
    .in('key', ['rank_track_domain']);

  if (configError) throw configError;

  const config = Object.fromEntries((configRows ?? []).map((row) => [row.key, row.value]));
  const trackedDomain = config.rank_track_domain?.trim()?.replace(/^www\./, '');

  if (!trackedDomain) {
    throw new Error(
      'seo_config.rank_track_domain is missing. Seed the tracked domain before rank tracking.',
    );
  }

  let keywordsQuery = supabase
    .from('seo_keywords')
    .select('keyword, priority')
    .eq('is_active', true)
    .order('priority', { ascending: true })
    .limit(Number.isFinite(maxKeywords) ? maxKeywords : 20);

  if (keywordFilter) {
    keywordsQuery = keywordsQuery.ilike('keyword', `%${keywordFilter}%`);
  }

  const { data: keywordRows, error: keywordError } = await keywordsQuery;
  if (keywordError) throw keywordError;

  const rows = [];

  for (const keywordRow of keywordRows ?? []) {
    const snapshot = await fetchOrganicSearchSnapshot({
      keyword: keywordRow.keyword,
      maxResults,
    });

    const firstMatch = snapshot.searchResults.find(
      (item) => item.link && matchesTrackedDomain(item.link, trackedDomain),
    );

    rows.push({
      keyword: keywordRow.keyword,
      position: firstMatch?.position ?? null,
      url_found: firstMatch?.link ?? null,
      search_results: snapshot.searchResults,
    });
  }

  if (rows.length === 0) {
    console.log('No active keywords matched the current filters. Nothing to insert.');
    process.exit(0);
  }

  for (const batch of chunk(rows, 100)) {
    if (batch.length === 0) continue;
    const { error } = await supabase.from('seo_rank_tracking').insert(batch);
    if (error) throw error;
  }

  const rankedCount = rows.filter((row) => typeof row.position === 'number').length;
  console.log(
    `Saved ${rows.length} keyword snapshots to seo_rank_tracking. ${rankedCount} keywords returned at least one ${trackedDomain} result.`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    'Rank tracking failed. Confirm DATAFORSEO_LOGIN/DATAFORSEO_PASSWORD are available and seo_config contains rank_track_domain.',
  );
  console.error(message);
  process.exit(1);
}
