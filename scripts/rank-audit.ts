import process from 'node:process';
import { getOption } from './google-auth';
import { DEFAULT_RANK_LIMIT } from './seo-audit-config';
import { chunk, getSupabaseAdmin } from './supabase-admin';

interface GoogleSearchItem {
  title?: string;
  link?: string;
  displayLink?: string;
  snippet?: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
}

interface GoogleApiErrorPayload {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

const args = process.argv.slice(2);
const keywordFilter = getOption(args, 'keyword');
const maxKeywords = Number.parseInt(getOption(args, 'limit') ?? '20', 10);
const maxResults = Number.parseInt(getOption(args, 'max-results') ?? `${DEFAULT_RANK_LIMIT}`, 10);
const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY?.trim() || null;

const normalizeHost = (url: string) => {
  const hostname = new URL(url).hostname.toLowerCase();
  return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
};

const matchesTrackedDomain = (url: string, trackedDomain: string) => {
  const hostname = normalizeHost(url);
  return hostname === trackedDomain || hostname.endsWith(`.${trackedDomain}`);
};

const fetchResults = async ({
  apiKey,
  cx,
  keyword,
  start,
}: {
  apiKey: string;
  cx: string;
  keyword: string;
  start: number;
}) => {
  const params = new URLSearchParams({
    key: apiKey,
    cx,
    q: keyword,
    num: '10',
    start: String(start),
  });

  const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);

  if (!response.ok) {
    const text = await response.text();
    let parsedError: GoogleApiErrorPayload | null = null;

    try {
      parsedError = JSON.parse(text) as GoogleApiErrorPayload;
    } catch {
      parsedError = null;
    }

    const googleMessage = parsedError?.error?.message ?? text;

    if (
      response.status === 403 &&
      googleMessage.includes('does not have the access to Custom Search JSON API')
    ) {
      throw new Error(
        [
          `Custom Search JSON API access is blocked for the current Google Cloud project while checking "${keyword}".`,
          'Google closed Custom Search JSON API to new customers; only grandfathered projects can use it through January 1, 2027.',
          'Use a grandfathered project or switch audit:rank to another SERP provider.',
        ].join(' '),
      );
    }

    throw new Error(`Custom Search request failed for "${keyword}": ${response.status} ${text}`);
  }

  return (await response.json()) as GoogleSearchResponse;
};

try {
  if (!apiKey) {
    throw new Error(
      'Missing GOOGLE_CUSTOM_SEARCH_API_KEY. Add a read-only Google Programmable Search key before running bun run audit:rank.',
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: configRows, error: configError } = await supabase
    .from('seo_config')
    .select('key, value')
    .in('key', ['google_cse_cx', 'rank_track_domain']);

  if (configError) throw configError;

  const config = Object.fromEntries((configRows ?? []).map((row) => [row.key, row.value]));
  const cx = config.google_cse_cx?.trim();
  const trackedDomain = config.rank_track_domain?.trim()?.replace(/^www\./, '');

  if (!cx) {
    throw new Error('seo_config.google_cse_cx is missing. Seed the CSE id before rank tracking.');
  }

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
    const topItems: GoogleSearchItem[] = [];

    for (let start = 1; start <= maxResults; start += 10) {
      const response = await fetchResults({
        apiKey,
        cx,
        keyword: keywordRow.keyword,
        start,
      });

      const items = response.items ?? [];
      topItems.push(...items);

      if (items.length < 10) break;

      const match = topItems.find((item) => item.link && matchesTrackedDomain(item.link, trackedDomain));
      if (match) break;
    }

    const firstMatchIndex = topItems.findIndex(
      (item) => item.link && matchesTrackedDomain(item.link, trackedDomain),
    );

    rows.push({
      keyword: keywordRow.keyword,
      position: firstMatchIndex >= 0 ? firstMatchIndex + 1 : null,
      url_found: firstMatchIndex >= 0 ? topItems[firstMatchIndex]?.link ?? null : null,
      search_results: topItems.map((item, index) => ({
        position: index + 1,
        title: item.title ?? null,
        link: item.link ?? null,
        displayLink: item.displayLink ?? null,
        snippet: item.snippet ?? null,
      })),
    });
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
    'Rank tracking failed. Confirm GOOGLE_CUSTOM_SEARCH_API_KEY is available and seo_config contains google_cse_cx + rank_track_domain.',
  );
  console.error(message);
  process.exit(1);
}
