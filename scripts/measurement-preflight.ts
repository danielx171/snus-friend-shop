import { existsSync } from 'node:fs';
import process from 'node:process';
import {
  DEFAULT_DATAFORSEO_LANGUAGE_CODE,
  DEFAULT_DATAFORSEO_LOCATION_CODE,
} from './seo-audit-config';
import { SCRIPT_ENV_PRECEDENCE } from './script-env';

type Status = 'ok' | 'warn' | 'missing';

interface CheckResult {
  label: string;
  status: Status;
  detail: string;
}

const STATUS_LABELS: Record<Status, string> = {
  ok: 'OK',
  warn: 'WARN',
  missing: 'MISSING',
};

const getEnv = (name: string) => process.env[name]?.trim() || null;

const formatResult = ({ label, status, detail }: CheckResult) =>
  `[${STATUS_LABELS[status]}] ${label}: ${detail}`;

const checkRequiredEnv = (name: string, description: string): CheckResult => {
  const value = getEnv(name);
  if (value) {
    return {
      label: description,
      status: 'ok',
      detail: `${name} is set.`,
    };
  }

  return {
    label: description,
    status: 'missing',
    detail: `Add ${name} to your local env before running the measurement commands.`,
  };
};

const checkGoogleCredential = (): CheckResult => {
  const explicitPath = getEnv('GOOGLE_SERVICE_ACCOUNT_KEY_PATH');
  const standardPath = getEnv('GOOGLE_APPLICATION_CREDENTIALS');
  const credentialPath = explicitPath || standardPath;

  if (!credentialPath) {
    return {
      label: 'Google read-only credential',
      status: 'missing',
      detail:
        'Set GOOGLE_SERVICE_ACCOUNT_KEY_PATH or GOOGLE_APPLICATION_CREDENTIALS before running GA4/GSC commands.',
    };
  }

  if (!existsSync(credentialPath)) {
    return {
      label: 'Google read-only credential',
      status: 'warn',
      detail: `${credentialPath} is configured but the file does not exist on disk.`,
    };
  }

  return {
    label: 'Google read-only credential',
    status: 'ok',
    detail: `${credentialPath} exists and can be used for GA4/GSC commands.`,
  };
};

const checkPagespeedKey = (): CheckResult => {
  const apiKey = getEnv('PAGESPEED_API_KEY');
  if (!apiKey) {
    return {
      label: 'PageSpeed CLI key',
      status: 'missing',
      detail: 'Add PAGESPEED_API_KEY, then rotate it to the server-safe unrestricted key before CLI audits.',
    };
  }

  return {
    label: 'PageSpeed CLI key',
    status: 'warn',
    detail:
      'PAGESPEED_API_KEY is set. Live verification is still required because the current local key may still be HTTP-referrer restricted.',
  };
};

const checkDataforseoOverrides = (): CheckResult[] => {
  const locationCode = getEnv('DATAFORSEO_LOCATION_CODE');
  const languageCode = getEnv('DATAFORSEO_LANGUAGE_CODE');
  const results: CheckResult[] = [];

  if (!locationCode) {
    results.push({
      label: 'DataForSEO location override',
      status: 'ok',
      detail: `DATAFORSEO_LOCATION_CODE is unset, so the default ${DEFAULT_DATAFORSEO_LOCATION_CODE} (Sweden) will be used.`,
    });
  } else if (!Number.isFinite(Number.parseInt(locationCode, 10))) {
    results.push({
      label: 'DataForSEO location override',
      status: 'warn',
      detail: `DATAFORSEO_LOCATION_CODE is "${locationCode}". Use a positive integer Google location code.`,
    });
  } else {
    results.push({
      label: 'DataForSEO location override',
      status: 'ok',
      detail: `DATAFORSEO_LOCATION_CODE is set to ${locationCode}.`,
    });
  }

  if (!languageCode) {
    results.push({
      label: 'DataForSEO language override',
      status: 'ok',
      detail: `DATAFORSEO_LANGUAGE_CODE is unset, so the default "${DEFAULT_DATAFORSEO_LANGUAGE_CODE}" will be used.`,
    });
  } else {
    results.push({
      label: 'DataForSEO language override',
      status: 'ok',
      detail: `DATAFORSEO_LANGUAGE_CODE is set to "${languageCode}".`,
    });
  }

  return results;
};

export const runMeasurementPreflight = () => {
  const results: CheckResult[] = [
    checkRequiredEnv('SUPABASE_URL', 'Supabase URL for sync/audit writes'),
    checkRequiredEnv('SUPABASE_SERVICE_ROLE_KEY', 'Supabase service role for sync/audit writes'),
    checkGoogleCredential(),
    checkRequiredEnv('SEARCH_CONSOLE_PROPERTY', 'Search Console property id'),
    checkRequiredEnv('GA4_PROPERTY_ID', 'GA4 property id'),
    checkPagespeedKey(),
    checkRequiredEnv('DATAFORSEO_LOGIN', 'DataForSEO login for rank snapshots'),
    checkRequiredEnv('DATAFORSEO_PASSWORD', 'DataForSEO password for rank snapshots'),
    ...checkDataforseoOverrides(),
  ];

  console.log('Measurement preflight');
  console.log('---------------------');
  console.log(`[INFO] Script env precedence: ${SCRIPT_ENV_PRECEDENCE}`);
  for (const result of results) {
    console.log(formatResult(result));
  }

  const legacyGoogleCse = getEnv('GOOGLE_CUSTOM_SEARCH_API_KEY');
  if (legacyGoogleCse) {
    console.log(
      '[WARN] Legacy Google CSE key: GOOGLE_CUSTOM_SEARCH_API_KEY is still set locally, but audit:rank no longer reads it.',
    );
  }

  const blockingStatuses = new Set<Status>(['missing']);
  const hasBlockingIssue = results.some((result) => blockingStatuses.has(result.status));

  console.log('\nNext commands');
  console.log('-------------');
  console.log('1. bun run audit:pagespeed');
  console.log('2. bun run audit:rank --limit=1');
  console.log('3. bun run audit:measurement:smoke');
  console.log('4. bun run audit:gsc:sync --days=7');

  if (hasBlockingIssue) {
    console.log('\nPreflight is not ready yet. Add the missing values above, then rerun bun run audit:preflight.');
    return false;
  }

  console.log('\nPreflight is ready. The remaining check is the live PageSpeed key restriction test.');
  return true;
};

if (import.meta.main) {
  const ok = runMeasurementPreflight();
  process.exit(ok ? 0 : 1);
}
