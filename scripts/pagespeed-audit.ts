const fallbackUrl =
  process.env.PUBLIC_SITE_URL ||
  process.env.VITE_SITE_URL ||
  'https://snusfriends.com/';

const targetUrl = process.argv[2] || fallbackUrl;
const apiKey = process.env.PAGESPEED_API_KEY;

if (!apiKey) {
  console.error('Missing PAGESPEED_API_KEY. Add it to your environment before running this audit.');
  process.exit(1);
}

const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
const metricKeys = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'interaction-to-next-paint',
  'cumulative-layout-shift',
  'total-blocking-time',
  'speed-index',
] as const;

type Strategy = 'mobile' | 'desktop';

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

interface PagespeedReport {
  lighthouseResult?: LighthouseResult;
}

function scoreLabel(score: number | null | undefined) {
  if (typeof score !== 'number') return 'n/a';
  return String(Math.round(score * 100));
}

async function fetchReport(strategy: Strategy) {
  const params = new URLSearchParams({
    url: targetUrl,
    strategy,
    key: apiKey,
  });

  for (const category of categories) {
    params.append('category', category);
  }

  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${strategy} request failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<PagespeedReport>;
}

function printReport(strategy: Strategy, report: PagespeedReport) {
  const categoriesResult = report.lighthouseResult?.categories ?? {};
  const audits = report.lighthouseResult?.audits ?? {};

  console.log(`\n${strategy.toUpperCase()} — ${targetUrl}`);
  console.log(
    `Scores: perf ${scoreLabel(categoriesResult.performance?.score)}, a11y ${scoreLabel(categoriesResult.accessibility?.score)}, best-practices ${scoreLabel(categoriesResult['best-practices']?.score)}, seo ${scoreLabel(categoriesResult.seo?.score)}`,
  );

  for (const key of metricKeys) {
    const audit = audits[key];
    if (!audit) continue;
    console.log(`${audit.title}: ${audit.displayValue ?? 'n/a'}`);
  }

  const opportunities = Object.values(audits)
    .filter((audit) => audit.details?.type === 'opportunity' && (audit.numericValue ?? 0) > 0)
    .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
    .slice(0, 5);

  if (opportunities.length > 0) {
    console.log('Top opportunities:');
    for (const audit of opportunities) {
      console.log(`- ${audit.title}: ${audit.displayValue ?? 'see report'}`);
    }
  }
}

try {
  const mobile = await fetchReport('mobile');
  const desktop = await fetchReport('desktop');

  printReport('mobile', mobile);
  printReport('desktop', desktop);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
