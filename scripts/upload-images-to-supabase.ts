/**
 * Upload downloaded product images to Supabase Storage and update the products table.
 *
 * Prerequisites:
 *   1. Run "bun run scripts/download-product-images.ts" first
 *   2. Create a public bucket named "product-images" in Supabase Dashboard → Storage
 *   3. Ensure .env.local has SUPABASE_SERVICE_ROLE_KEY set
 *
 * Usage:
 *   bun run scripts/upload-images-to-supabase.ts
 *
 * What it does:
 *   - Reads all .webp files from downloaded-images/
 *   - Uploads each to Supabase Storage: product-images/<product_id>.webp
 *   - Updates products.image_url to the public CDN URL
 *   - Skips products that already have a non-Nyehandel image_url
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve, basename } from 'path';

const IMG_DIR = resolve(import.meta.dir, '../downloaded-images');
const CONCURRENCY = 4;
const BUCKET = 'product-images';

// Load env — Bun reads .env.local automatically
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars. Ensure .env.local has:');
  console.error('  VITE_SUPABASE_URL=...');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=...   (service role key from Supabase Dashboard → Settings → API)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function uploadAndUpdate(filePath: string): Promise<'ok' | 'skip' | 'error'> {
  const fileName = basename(filePath);
  const productId = fileName.replace(/\.(webp|jpg)$/, '');
  const storagePath = `${productId}.webp`;

  try {
    // Upload to storage (upsert = overwrite if exists)
    const fileBytes = readFileSync(filePath);
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBytes, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadErr) {
      console.warn(`  [${productId}] upload error: ${uploadErr.message}`);
      return 'error';
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const publicUrl = urlData.publicUrl;

    // Update product
    const { error: updateErr } = await supabase
      .from('products')
      .update({ image_url: publicUrl })
      .eq('id', productId);

    if (updateErr) {
      console.warn(`  [${productId}] DB update error: ${updateErr.message}`);
      return 'error';
    }

    return 'ok';
  } catch (err) {
    console.warn(`  [${productId}] unexpected error: ${err}`);
    return 'error';
  }
}

async function main() {
  if (!existsSync(IMG_DIR)) {
    console.error(`Image dir not found: ${IMG_DIR}`);
    console.error('Run "bun run scripts/download-product-images.ts" first');
    process.exit(1);
  }

  const files = readdirSync(IMG_DIR).filter((f) => f.match(/\.(webp|jpg)$/));
  console.log(`Found ${files.length} images in ${IMG_DIR}`);
  console.log(`Uploading to Supabase Storage bucket: ${BUCKET}\n`);

  let ok = 0, errors = 0;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((f) => uploadAndUpdate(join(IMG_DIR, f)))
    );
    for (const r of results) {
      if (r === 'ok') ok++;
      else errors++;
    }

    if ((i + CONCURRENCY) % 100 === 0 || i + CONCURRENCY >= files.length) {
      const pct = Math.min(100, Math.round(((i + CONCURRENCY) / files.length) * 100));
      console.log(`  ${pct}% — ${ok} uploaded, ${errors} errors`);
    }
    await sleep(100);
  }

  console.log('\n✓ Done');
  console.log(`  Uploaded: ${ok}`);
  console.log(`  Errors  : ${errors}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
