import process from 'node:process';
import { google } from 'googleapis';
import {
  ANALYTICS_SCOPE,
  formatInteger,
  getDateRange,
  getDays,
  getGoogleAuth,
  getPrimaryArg,
  requireSetting,
} from './google-auth';

const args = process.argv.slice(2);
const propertyId = requireSetting(
  'GA4_PROPERTY_ID',
  getPrimaryArg(args) ?? process.env.GA4_PROPERTY_ID ?? null,
);
const days = getDays(args, 28);
const { startDate, endDate } = getDateRange(days);

const auth = getGoogleAuth(ANALYTICS_SCOPE);
const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
const property = `properties/${propertyId}`;

const printRows = (
  title: string,
  rows: Array<{
    label: string;
    sessions: string | undefined;
    users: string | undefined;
    views?: string | undefined;
  }>,
) => {
  console.log(`\n${title}`);

  if (rows.length === 0) {
    console.log('No rows returned.');
    return;
  }

  rows.forEach((row, index) => {
    const views = row.views ? ` | views ${formatInteger(row.views)}` : '';
    console.log(
      `${index + 1}. ${row.label} | sessions ${formatInteger(row.sessions)} | users ${formatInteger(row.users)}${views}`,
    );
  });
};

try {
  const [summaryResponse, landingPageResponse, channelResponse] = await Promise.all([
    analyticsData.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'engagedSessions' },
        ],
      },
    }),
    analyticsData.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'landingPagePlusQueryString' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      },
    }),
    analyticsData.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      },
    }),
  ]);

  const summary = summaryResponse.data.rows?.[0]?.metricValues ?? [];
  console.log(`GA4 property ${propertyId} — ${startDate} to ${endDate}`);
  console.log(
    `Totals: sessions ${formatInteger(summary[0]?.value)} | users ${formatInteger(summary[1]?.value)} | views ${formatInteger(summary[2]?.value)} | engaged sessions ${formatInteger(summary[3]?.value)}`,
  );

  const landingPages =
    landingPageResponse.data.rows?.map((row) => ({
      label: row.dimensionValues?.[0]?.value || '(not set)',
      sessions: row.metricValues?.[0]?.value,
      users: row.metricValues?.[1]?.value,
      views: row.metricValues?.[2]?.value,
    })) ?? [];

  const channels =
    channelResponse.data.rows?.map((row) => ({
      label: row.dimensionValues?.[0]?.value || '(not set)',
      sessions: row.metricValues?.[0]?.value,
      users: row.metricValues?.[1]?.value,
    })) ?? [];

  printRows('Top landing pages', landingPages);
  printRows('Top acquisition channels', channels);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `GA4 audit failed. Make sure the credential configured via GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_KEY_PATH has read access to property ${propertyId}.`,
  );
  console.error(message);
  process.exit(1);
}
