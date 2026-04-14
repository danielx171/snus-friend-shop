import { fetchPagespeedReport, metricKeys, scoreLabel, summarizePagespeedReport, type Strategy } from './pagespeed-client';
import { getSiteBaseUrl } from './seo-audit-config';

const targetUrl = process.argv[2] || getSiteBaseUrl();

const toCategoryScore = (score: number | null) => (typeof score === 'number' ? score / 100 : null);

const printReport = (strategy: Strategy, targetReport: Awaited<ReturnType<typeof fetchPagespeedReport>>) => {
  const audits = targetReport.lighthouseResult?.audits ?? {};
  const summary = summarizePagespeedReport(targetReport);

  console.log(`\n${strategy.toUpperCase()} — ${targetUrl}`);
  console.log(
    `Scores: perf ${scoreLabel(toCategoryScore(summary.performanceScore))}, a11y ${scoreLabel(toCategoryScore(summary.accessibilityScore))}, best-practices ${scoreLabel(toCategoryScore(summary.bestPracticesScore))}, seo ${scoreLabel(toCategoryScore(summary.seoScore))}`,
  );

  for (const key of metricKeys) {
    const audit = audits[key];
    if (!audit) continue;
    console.log(`${audit.title}: ${audit.displayValue ?? 'n/a'}`);
  }

  if (summary.opportunities.length > 0) {
    console.log('Top opportunities:');
    for (const audit of summary.opportunities) {
      console.log(`- ${audit.title}: ${audit.displayValue ?? 'see report'}`);
    }
  }
};

try {
  const mobile = await fetchPagespeedReport({ strategy: 'mobile', targetUrl });
  const desktop = await fetchPagespeedReport({ strategy: 'desktop', targetUrl });

  printReport('mobile', mobile);
  printReport('desktop', desktop);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
