import process from 'node:process';
import { google } from 'googleapis';
import {
  SEARCH_CONSOLE_SCOPE,
  formatDecimal,
  formatInteger,
  formatPercent,
  getDateRange,
  getDays,
  getGoogleAuth,
  getOption,
  getPrimaryArg,
  requireSetting,
} from './google-auth';

const args = process.argv.slice(2);
const siteUrl = requireSetting(
  'SEARCH_CONSOLE_PROPERTY',
  getPrimaryArg(args) ?? process.env.SEARCH_CONSOLE_PROPERTY ?? null,
);
const days = getDays(args, 28);
const queryFilter = getOption(args, 'query');
const pageFilter = getOption(args, 'page');
const rowLimit = Number.parseInt(getOption(args, 'limit') ?? '10', 10);
const { startDate, endDate } = getDateRange(days);

const auth = getGoogleAuth(SEARCH_CONSOLE_SCOPE);
const searchConsole = google.searchconsole({ version: 'v1', auth });

const dimensionFilterGroups =
  queryFilter || pageFilter
    ? [
        {
          groupType: 'and',
          filters: [
            ...(queryFilter
              ? [{ dimension: 'query', operator: 'contains', expression: queryFilter }]
              : []),
            ...(pageFilter
              ? [{ dimension: 'page', operator: 'contains', expression: pageFilter }]
              : []),
          ],
        },
      ]
    : undefined;

const printRows = (
  title: string,
  rows: Array<{
    label: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>,
) => {
  console.log(`\n${title}`);

  if (rows.length === 0) {
    console.log('No rows returned.');
    return;
  }

  rows.forEach((row, index) => {
    console.log(
      `${index + 1}. ${row.label} | clicks ${formatInteger(row.clicks)} | impressions ${formatInteger(row.impressions)} | ctr ${formatPercent(row.ctr)} | position ${formatDecimal(row.position)}`,
    );
  });
};

try {
  const [topQueriesResponse, topPagesResponse] = await Promise.all([
    searchConsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        dimensionFilterGroups,
        rowLimit,
        dataState: 'final',
      },
    }),
    searchConsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        dimensionFilterGroups,
        rowLimit,
        dataState: 'final',
      },
    }),
  ]);

  const topQueries =
    topQueriesResponse.data.rows?.map((row) => ({
      label: row.keys?.[0] || '(not set)',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    })) ?? [];

  const topPages =
    topPagesResponse.data.rows?.map((row) => ({
      label: row.keys?.[0] || '(not set)',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    })) ?? [];

  console.log(`Search Console ${siteUrl} — ${startDate} to ${endDate}`);
  if (queryFilter || pageFilter) {
    console.log(`Filters: query ${queryFilter ?? '(none)'} | page ${pageFilter ?? '(none)'}`);
  }

  printRows('Top queries', topQueries);
  printRows('Top pages', topPages);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `Search Console audit failed. Make sure the credential configured via GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_KEY_PATH has read access to ${siteUrl}.`,
  );
  console.error(message);
  process.exit(1);
}
