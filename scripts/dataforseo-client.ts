import process from 'node:process';
import {
  DEFAULT_DATAFORSEO_LANGUAGE_CODE,
  DEFAULT_DATAFORSEO_LOCATION_CODE,
} from './seo-audit-config';

const DATAFORSEO_ORGANIC_LIVE_ADVANCED_URL =
  'https://api.dataforseo.com/v3/serp/google/organic/live/advanced';
const MAX_DATAFORSEO_DEPTH = 200;
const DEFAULT_DEVICE = 'desktop';
const DEFAULT_OS = 'windows';

export interface NormalizedSearchResult {
  position: number;
  title: string | null;
  link: string | null;
  displayLink: string | null;
  snippet: string | null;
}

export interface OrganicSearchSnapshot {
  keyword: string;
  locationCode: number;
  languageCode: string;
  searchResults: NormalizedSearchResult[];
}

interface DataforseoOrganicItem {
  type?: string | null;
  rank_absolute?: number | null;
  title?: string | null;
  url?: string | null;
  domain?: string | null;
  description?: string | null;
}

interface DataforseoSerpResult {
  items?: DataforseoOrganicItem[] | null;
}

interface DataforseoTask {
  status_code?: number;
  status_message?: string;
  result?: DataforseoSerpResult[] | null;
}

interface DataforseoResponse {
  status_code?: number;
  status_message?: string;
  tasks?: DataforseoTask[] | null;
}

const requireEnvSetting = (label: string) => {
  const value = process.env[label]?.trim();
  if (value) return value;

  throw new Error(
    `Missing ${label}. Add ${label} to your local env before running bun run audit:rank.`,
  );
};

const parseIntegerSetting = (label: string, rawValue: string | undefined, fallback: number) => {
  const normalized = rawValue?.trim();
  if (!normalized) return fallback;

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${label} value "${normalized}". Use a positive integer.`);
  }

  return parsed;
};

const getDataforseoConfig = () => ({
  login: requireEnvSetting('DATAFORSEO_LOGIN'),
  password: requireEnvSetting('DATAFORSEO_PASSWORD'),
  locationCode: parseIntegerSetting(
    'DATAFORSEO_LOCATION_CODE',
    process.env.DATAFORSEO_LOCATION_CODE,
    DEFAULT_DATAFORSEO_LOCATION_CODE,
  ),
  languageCode:
    process.env.DATAFORSEO_LANGUAGE_CODE?.trim() || DEFAULT_DATAFORSEO_LANGUAGE_CODE,
});

const getFallbackDisplayLink = (url: string | null) => {
  if (!url) return null;

  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

const normalizeOrganicItem = (
  item: DataforseoOrganicItem,
  fallbackPosition: number,
): NormalizedSearchResult => ({
  position:
    typeof item.rank_absolute === 'number' && Number.isFinite(item.rank_absolute)
      ? Math.round(item.rank_absolute)
      : fallbackPosition,
  title: item.title ?? null,
  link: item.url ?? null,
  displayLink: item.domain ?? getFallbackDisplayLink(item.url ?? null),
  snippet: item.description ?? null,
});

export const fetchOrganicSearchSnapshot = async ({
  keyword,
  maxResults,
}: {
  keyword: string;
  maxResults: number;
}): Promise<OrganicSearchSnapshot> => {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) {
    throw new Error('Keyword cannot be empty when fetching rank tracking results.');
  }

  if (!Number.isFinite(maxResults) || maxResults <= 0) {
    throw new Error(`Invalid --max-results value "${maxResults}". Use a positive integer.`);
  }

  if (maxResults > MAX_DATAFORSEO_DEPTH) {
    throw new Error(
      `Invalid --max-results value "${maxResults}". DataForSEO live advanced supports up to ${MAX_DATAFORSEO_DEPTH} results per request.`,
    );
  }

  const config = getDataforseoConfig();
  const response = await fetch(DATAFORSEO_ORGANIC_LIVE_ADVANCED_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.login}:${config.password}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        keyword: trimmedKeyword,
        location_code: config.locationCode,
        language_code: config.languageCode,
        device: DEFAULT_DEVICE,
        os: DEFAULT_OS,
        depth: maxResults,
      },
    ]),
  });

  const text = await response.text();
  let payload: DataforseoResponse | null = null;

  try {
    payload = text ? (JSON.parse(text) as DataforseoResponse) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      `DataForSEO request failed for "${trimmedKeyword}": ${response.status} ${text || 'Empty response body.'}`,
    );
  }

  if ((payload?.status_code ?? 0) !== 20000) {
    throw new Error(
      `DataForSEO request failed for "${trimmedKeyword}": ${payload?.status_code ?? 'unknown'} ${payload?.status_message ?? 'Unknown error.'}`,
    );
  }

  const task = payload?.tasks?.[0];
  if (!task) {
    throw new Error(`DataForSEO returned no task payload for "${trimmedKeyword}".`);
  }

  if ((task.status_code ?? 0) !== 20000) {
    throw new Error(
      `DataForSEO task failed for "${trimmedKeyword}": ${task.status_code ?? 'unknown'} ${task.status_message ?? 'Unknown error.'}`,
    );
  }

  const organicItems = (task.result?.[0]?.items ?? []).filter(
    (item): item is DataforseoOrganicItem => item?.type === 'organic',
  );

  return {
    keyword: trimmedKeyword,
    locationCode: config.locationCode,
    languageCode: config.languageCode,
    searchResults: organicItems
      .slice(0, maxResults)
      .map((item, index) => normalizeOrganicItem(item, index + 1)),
  };
};
