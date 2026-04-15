import process from 'node:process';
import { google } from 'googleapis';
import './script-env';

const standardCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
const explicitKeyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH?.trim();

export const ANALYTICS_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
export const SEARCH_CONSOLE_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

export const getGoogleAuth = (scopes: string | string[]) =>
  new google.auth.GoogleAuth({
    keyFile: explicitKeyPath || standardCredentialsPath || undefined,
    scopes,
  });

export const getPrimaryArg = (args: string[]) =>
  args.find((arg) => !arg.startsWith('--')) ?? null;

export const getOption = (args: string[], name: string) => {
  const match = args.find((arg) => arg.startsWith(`--${name}=`));
  if (!match) return null;
  const value = match.slice(name.length + 3).trim();
  return value || null;
};

export const getDays = (args: string[], fallback = 28) => {
  const raw = getOption(args, 'days');
  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid --days value "${raw}". Use a positive integer.`);
  }

  return parsed;
};

export const requireSetting = (label: string, value: string | null) => {
  const normalized = value?.trim();
  if (normalized) return normalized;

  throw new Error(
    `Missing ${label}. Set ${label} in your environment or pass it as the first script argument.`,
  );
};

export const getDateRange = (days: number) => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (days - 1));

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
};

export const formatInteger = (value: string | number | undefined) => {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.round(parsed).toLocaleString('en-US') : '0';
};

export const formatDecimal = (value: string | number | undefined, digits = 1) => {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : '0.0';
};

export const formatPercent = (value: string | number | undefined) => {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? `${(parsed * 100).toFixed(1)}%` : '0.0%';
};
