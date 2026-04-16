import process from 'node:process';
import { google } from 'googleapis';
import {
  SEARCH_CONSOLE_SCOPE,
  getDateRange,
  getDays,
  getGoogleAuth,
  getPrimaryArg,
  requireSetting,
} from './google-auth';
import { DEFAULT_GSC_SYNC_DAYS } from './seo-audit-config';
import { chunk, getSupabaseAdmin } from './supabase-admin';

const args = process.argv.slice(2);
const siteUrl = requireSetting(
  'SEARCH_CONSOLE_PROPERTY',
  getPrimaryArg(args) ?? process.env.SEARCH_CONSOLE_PROPERTY ?? null,
);
const days = getDays(args, DEFAULT_GSC_SYNC_DAYS);
const rowLimit = 25_000;
const { startDate, endDate } = getDateRange(days);

const auth = getGoogleAuth(SEARCH_CONSOLE_SCOPE);
const searchConsole = google.searchconsole({ version: 'v1', auth });

interface SearchAnalyticsRow {
  keys?: string[];
  clicks?: number | null;
  impressions?: number | null;
  ctr?: number | null;
  position?: number | null;
}

const fetchRows = async () => {
  const rows: SearchAnalyticsRow[] = [];
  let startRow = 0;

  while (true) {
    const response = await searchConsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date', 'query', 'page'],
        rowLimit,
        startRow,
        dataState: 'final',
      },
    });

    const pageRows = response.data.rows ?? [];
    rows.push(...pageRows);

    if (pageRows.length < rowLimit) break;
    startRow += pageRows.length;
  }

  return rows;
};

try {
  const rows = await fetchRows();
  const payload = rows.map((row) => ({
    date: row.keys?.[0] ?? startDate,
    query: row.keys?.[1] ?? null,
    page: row.keys?.[2] ?? null,
    clicks: Math.round(row.clicks ?? 0),
    impressions: Math.round(row.impressions ?? 0),
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  }));

  const supabase = getSupabaseAdmin();
  const { error: deleteError } = await supabase
    .from('seo_gsc_stats')
    .delete()
    .gte('date', startDate)
    .lte('date', endDate);

  if (deleteError) throw deleteError;

  for (const batch of chunk(payload, 1000)) {
    if (batch.length === 0) continue;
    const { error: insertError } = await supabase.from('seo_gsc_stats').insert(batch);
    if (insertError) throw insertError;
  }

  console.log(
    `Synced ${payload.length} Search Console rows into seo_gsc_stats for ${siteUrl} (${startDate} to ${endDate}).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `Search Console sync failed. Confirm the Google credential can read ${siteUrl} and the local Supabase admin envs are available.`,
  );
  console.error(message);
  process.exit(1);
}
