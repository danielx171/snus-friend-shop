/**
 * Download product images from Nyehandel CDN into a local folder.
 *
 * Images in the CSV are hosted at:
 *   https://nycdn.nyehandel.se/store_<id>/images/<hash>.webp
 *
 * Usage:
 *   bun run scripts/download-product-images.ts [path/to/export.csv]
 *
 * Output:
 *   downloaded-images/<product_id>.webp   — first image for each product
 *
 * After downloading, you can upload to Supabase Storage with:
 *   bun run scripts/upload-images-to-supabase.ts
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const CSV_PATH = process.argv[2] ?? resolve(import.meta.dir, '../../../Downloads/product-export-2026-03-21-032310.csv');
const OUT_DIR = resolve(import.meta.dir, '../downloaded-images');
const CONCURRENCY = 8;         // parallel downloads
const DELAY_MS = 50;           // ms between batches (be polite to CDN)

// ── helpers ──────────────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseImageUrls(cell: string): string[] {
  return cell
    .split(';')
    .map((u) => u.trim())
    .filter((u) => u.startsWith('http'));
}

async function downloadImage(productId: string, url: string): Promise<'ok' | 'skip' | 'error'> {
  const ext = url.includes('.webp') ? '.webp' : '.jpg';
  const outPath = join(OUT_DIR, `${productId}${ext}`);
  if (existsSync(outPath)) return 'skip';

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  [${productId}] HTTP ${res.status} — ${url}`);
      return 'error';
    }
    const buf = await res.arrayBuffer();
    writeFileSync(outPath, Buffer.from(buf));
    return 'ok';
  } catch (err) {
    console.warn(`  [${productId}] fetch error — ${err}`);
    return 'error';
  }
}

// ── parse CSV ─────────────────────────────────────────────────────────────────
// The export uses semicolons as delimiters and double-quotes for fields.
// We handle quoted multi-line cells by reading chunks.

async function parseCSV(filePath: string): Promise<Array<{ id: string; imageUrl: string }>> {
  const results: Array<{ id: string; imageUrl: string }> = [];

  const rl = createInterface({ input: createReadStream(filePath, { encoding: 'utf8' }) });

  let headers: string[] = [];
  let buffer = '';
  let firstLine = true;

  for await (const line of rl) {
    buffer += (buffer ? '\n' : '') + line;

    // Count unescaped quotes to decide if record is complete
    const quoteCount = (buffer.match(/"/g) ?? []).length;
    if (quoteCount % 2 !== 0) continue; // still inside a quoted field

    // Parse the completed record
    const row = parseRow(buffer);
    buffer = '';

    if (firstLine) {
      headers = row;
      firstLine = false;
      continue;
    }

    const productId = row[headers.indexOf('product_id')]?.trim();
    const imagesCell = row[headers.indexOf('images')]?.trim();

    if (!productId || !imagesCell) continue;

    const urls = parseImageUrls(imagesCell);
    if (urls.length === 0) continue;

    results.push({ id: productId, imageUrl: urls[0] });
  }

  return results;
}

/** Minimal CSV row parser that handles quoted fields with embedded newlines/semicolons */
function parseRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ';' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Reading CSV: ${CSV_PATH}`);
  if (!existsSync(CSV_PATH)) {
    console.error(`CSV not found: ${CSV_PATH}`);
    console.error('Usage: bun run scripts/download-product-images.ts path/to/export.csv');
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const products = await parseCSV(CSV_PATH);
  console.log(`Found ${products.length} products with images`);
  console.log(`Output dir: ${OUT_DIR}`);
  console.log(`Concurrency: ${CONCURRENCY}\n`);

  let ok = 0;
  let skipped = 0;
  let errors = 0;

  // Process in batches of CONCURRENCY
  for (let i = 0; i < products.length; i += CONCURRENCY) {
    const batch = products.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(({ id, imageUrl }) => downloadImage(id, imageUrl))
    );

    for (const r of results) {
      if (r === 'ok') ok++;
      else if (r === 'skip') skipped++;
      else errors++;
    }

    if ((i + CONCURRENCY) % 100 === 0 || i + CONCURRENCY >= products.length) {
      const pct = Math.min(100, Math.round(((i + CONCURRENCY) / products.length) * 100));
      console.log(`  ${pct}% — ${ok} downloaded, ${skipped} skipped, ${errors} errors`);
    }

    await sleep(DELAY_MS);
  }

  console.log('\n✓ Done');
  console.log(`  Downloaded : ${ok}`);
  console.log(`  Skipped    : ${skipped} (already existed)`);
  console.log(`  Errors     : ${errors}`);
  console.log(`\nNext step: run "bun run scripts/upload-images-to-supabase.ts" to push to Supabase Storage`);
}

main().catch((err) => { console.error(err); process.exit(1); });
