#!/usr/bin/env node
/**
 * IndexNow ping script — run after `astro build` to notify Bing/Yandex of changed URLs.
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs [--dry-run]
 *
 * Reads the built sitemap.xml, extracts URLs with lastmod >= 7 days ago,
 * and submits them to the IndexNow API.
 *
 * Env: INDEXNOW_KEY (defaults to the key file in public/)
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = 'https://snusfriends.com';
const KEY = process.env.INDEXNOW_KEY ?? '29107f159f82547861eeda66dea41127';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const DRY_RUN = process.argv.includes('--dry-run');

// Parse sitemap XML (simple regex — no dependency needed)
function extractRecentUrls(sitemapXml, daysBack = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);

  const urls = [];
  const entries = sitemapXml.match(/<url>[\s\S]*?<\/url>/g) || [];

  for (const entry of entries) {
    const locMatch = entry.match(/<loc>([^<]+)<\/loc>/);
    const modMatch = entry.match(/<lastmod>([^<]+)<\/lastmod>/);
    if (!locMatch) continue;

    const loc = locMatch[1];
    if (modMatch) {
      const lastmod = new Date(modMatch[1]);
      if (lastmod >= cutoff) {
        urls.push(loc);
      }
    }
  }

  return urls;
}

async function submitToIndexNow(urls) {
  if (urls.length === 0) {
    console.log('[IndexNow] No recently modified URLs to submit.');
    return;
  }

  // IndexNow batch limit is 10,000
  const batch = urls.slice(0, 10000);
  const payload = {
    host: 'snusfriends.com',
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: batch,
  };

  console.log(`[IndexNow] Submitting ${batch.length} URLs...`);

  if (DRY_RUN) {
    console.log('[IndexNow] DRY RUN — would submit:');
    batch.slice(0, 10).forEach((u) => console.log(`  ${u}`));
    if (batch.length > 10) console.log(`  ... and ${batch.length - 10} more`);
    return;
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 202) {
      console.log(`[IndexNow] Success (${res.status}) — ${batch.length} URLs submitted.`);
    } else {
      const body = await res.text().catch(() => '');
      console.error(`[IndexNow] Failed (${res.status}): ${body}`);
    }
  } catch (err) {
    console.error(`[IndexNow] Network error: ${err.message}`);
  }
}

// Main
// Astro + Vercel adapter writes the sitemap to dist/client/sitemap-0.xml.
// Older Astro build layouts wrote dist/sitemap-0.xml; keep that as a fallback only.
// Do NOT fall back to public/sitemap.xml — that's legacy output with stale URL shapes.
const sitemapCandidates = [
  '../dist/client/sitemap-0.xml',
  '../dist/sitemap-0.xml',
];
let sitemapXml;
let sitemapFoundAt;
for (const rel of sitemapCandidates) {
  try {
    const abs = resolve(import.meta.dirname, rel);
    sitemapXml = readFileSync(abs, 'utf-8');
    sitemapFoundAt = rel;
    break;
  } catch {
    // try next candidate
  }
}
if (!sitemapXml) {
  console.log('[IndexNow] No build sitemap found — run `astro build` first. Skipping.');
  process.exit(0);
}
console.log(`[IndexNow] Loaded sitemap from ${sitemapFoundAt}`);

const recentUrls = extractRecentUrls(sitemapXml, 7);
console.log(`[IndexNow] Found ${recentUrls.length} URLs modified in the last 7 days.`);
await submitToIndexNow(recentUrls);
