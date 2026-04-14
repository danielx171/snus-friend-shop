import process from 'node:process';

export const categories = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
export const metricKeys = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'interaction-to-next-paint',
  'cumulative-layout-shift',
  'total-blocking-time',
  'speed-index',
  'server-response-time',
];

export type Strategy = 'mobile' | 'desktop';

interface CategoryScore {
  score?: number | null;
}

interface AuditDetails {
  type?: string;
}

interface LighthouseAudit {
  title: string;
  displayValue?: string;
  numericValue?: number;
  details?: AuditDetails;
}

interface LighthouseResult {
  categories?: Record<string, CategoryScore>;
  audits?: Record<string, LighthouseAudit>;
}

export interface PagespeedReport {
  id?: string;
  loadingExperience?: unknown;
  originLoadingExperience?: unknown;
  lighthouseResult?: LighthouseResult;
}

export const getPagespeedApiKey = () => {
  const apiKey = process.env.PAGESPEED_API_KEY?.trim() || null;
  if (apiKey) return apiKey;

  throw new Error(
    'Missing PAGESPEED_API_KEY. Use a server-safe PageSpeed Insights key for CLI audits and sync jobs.',
  );
};

export const scoreLabel = (score: number | null | undefined) => {
  if (typeof score !== 'number') return 'n/a';
  return String(Math.round(score * 100));
};

export const fetchPagespeedReport = async ({
  strategy,
  targetUrl,
}: {
  strategy: Strategy;
  targetUrl: string;
}) => {
  const params = new URLSearchParams({
    url: targetUrl,
    strategy,
    key: getPagespeedApiKey(),
  });

  for (const category of categories) {
    params.append('category', category);
  }

  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
  );

  if (!response.ok) {
    const text = await response.text();
    const hint = text.includes('API_KEY_HTTP_REFERRER_BLOCKED')
      ? ' The current key is HTTP-referrer restricted. Create a second server-safe PageSpeed key for CLI usage.'
      : '';

    throw new Error(`${strategy} request failed for ${targetUrl}: ${response.status} ${text}${hint}`);
  }

  return (await response.json()) as PagespeedReport;
};

export const summarizePagespeedReport = (report: PagespeedReport) => {
  const categoriesResult = report.lighthouseResult?.categories ?? {};
  const audits = report.lighthouseResult?.audits ?? {};

  return {
    performanceScore:
      typeof categoriesResult.performance?.score === 'number'
        ? Math.round(categoriesResult.performance.score * 100)
        : null,
    accessibilityScore:
      typeof categoriesResult.accessibility?.score === 'number'
        ? Math.round(categoriesResult.accessibility.score * 100)
        : null,
    bestPracticesScore:
      typeof categoriesResult['best-practices']?.score === 'number'
        ? Math.round(categoriesResult['best-practices'].score * 100)
        : null,
    seoScore:
      typeof categoriesResult.seo?.score === 'number'
        ? Math.round(categoriesResult.seo.score * 100)
        : null,
    fcpMs: audits['first-contentful-paint']?.numericValue ?? null,
    lcpMs: audits['largest-contentful-paint']?.numericValue ?? null,
    cls: audits['cumulative-layout-shift']?.numericValue ?? null,
    inpMs: audits['interaction-to-next-paint']?.numericValue ?? null,
    tbtMs: audits['total-blocking-time']?.numericValue ?? null,
    ttfbMs: audits['server-response-time']?.numericValue ?? null,
    opportunities: Object.values(audits)
      .filter((audit) => audit.details?.type === 'opportunity' && (audit.numericValue ?? 0) > 0)
      .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
      .slice(0, 5),
  };
};
