// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// Lazy-init: only create the Supabase client when credentials are available
const buildClient = url && key
  ? createClient(url, key, { auth: { persistSession: false } })
  : null;

// Pricing logic from shared module — single source of truth
import { computePrices } from './lib/pricing';

function computeStock(variants: Array<{ inventory?: Array<{ quantity: number }> }>) {
  // If no inventory rows exist at all, treat product as available (Nyehandel manages stock).
  // Only report out-of-stock when inventory rows explicitly show quantity 0.
  const hasAnyInventory = variants.some(
    (v) => Array.isArray(v.inventory) && v.inventory.length > 0,
  );
  if (!hasAnyInventory) return 999; // no inventory tracking — assume available

  return variants.reduce((total, v) => {
    const qty = v.inventory?.[0]?.quantity ?? 0;
    return total + qty;
  }, 0);
}

const products = defineCollection({
  loader: async () => {
    if (!url || !key) {
      console.warn('[content.config] No Supabase credentials — returning empty product catalog');
      return [];
    }
    const { data, error } = await buildClient!
      .from('products')
      .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku, inventory(quantity))')
      .eq('is_active', true);

    if (error) {
      console.error('[content.config] Failed to fetch products:', error.message);
      return [];
    }

    return (data ?? []).map((p: any) => ({
      id: p.slug ?? p.id,
      slug: p.slug ?? p.id,
      name: p.name,
      brand: p.brands?.name ?? 'Unknown',
      brandSlug: p.brands?.slug ?? '',
      manufacturer: p.brands?.manufacturer ?? '',
      categoryKey: p.category_key ?? 'nicotinePouches',
      flavorKey: p.flavor_key ?? 'mint',
      strengthKey: p.strength_key ?? 'normal',
      formatKey: p.format_key ?? 'slim',
      nicotineContent: p.nicotine_mg ?? 0,
      portionsPerCan: p.portions_per_can ?? 20,
      description: p.description ?? '',
      descriptionKey: p.description_key ?? '',
      comparePrice: p.compare_price ?? undefined,
      imageUrl: p.image_url ?? '',
      ratings: p.ratings ?? 0,
      badgeKeys: p.badge_keys ?? [],
      updatedAt: p.updated_at ?? undefined,
      prices: computePrices(p.product_variants ?? []),
      stock: computeStock(p.product_variants ?? []),
    }));
  },
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    brand: z.string(),
    brandSlug: z.string(),
    manufacturer: z.string(),
    categoryKey: z.string(),
    flavorKey: z.string(),
    strengthKey: z.string(),
    formatKey: z.string(),
    nicotineContent: z.number(),
    portionsPerCan: z.number(),
    description: z.string(),
    descriptionKey: z.string(),
    comparePrice: z.number().optional(),
    imageUrl: z.string(),
    ratings: z.number(),
    badgeKeys: z.array(z.string()),
    prices: z.record(z.string(), z.number()),
    stock: z.number(),
    updatedAt: z.string().optional(),
  }),
});

const brands = defineCollection({
  loader: async () => {
    if (!url || !key) return [];
    const { data, error } = await buildClient!
      .from('brands')
      .select('id, slug, name, manufacturer, logo_url, description')
      .order('name');

    if (error) {
      console.error('[content.config] Failed to fetch brands:', error.message);
      return [];
    }

    return (data ?? []).map((b: any) => ({
      id: b.slug ?? b.id,
      slug: b.slug ?? b.id,
      name: b.name,
      manufacturer: b.manufacturer ?? '',
      logoUrl: b.logo_url ?? '',
      description: b.description ?? '',
      countryCode: b.country_code ?? '',
    }));
  },
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    manufacturer: z.string(),
    logoUrl: z.string(),
    description: z.string(),
    countryCode: z.string(),
  }),
});

export const collections = { products, brands };
