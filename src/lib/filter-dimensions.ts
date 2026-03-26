// Canonical dimension order for URL normalization
export const DIMENSION_ORDER = ['brand', 'strength', 'flavor', 'format', 'badge'] as const

export type DimensionKey = typeof DIMENSION_ORDER[number]

export interface DimensionDef {
  values: string[]
  dbKey: string
  urlToDb?: Record<string, string>
}

export const DIMENSIONS: Record<Exclude<DimensionKey, 'brand'>, DimensionDef> = {
  strength: {
    values: ['normal', 'strong', 'extra-strong', 'ultra-strong'],
    dbKey: 'strength_key',
    urlToDb: { 'extra-strong': 'extraStrong', 'ultra-strong': 'ultraStrong' },
  },
  flavor: {
    values: ['mint', 'fruit', 'berry', 'citrus', 'licorice', 'coffee', 'cola', 'vanilla', 'tropical'],
    dbKey: 'flavor_key',
  },
  format: {
    values: ['slim', 'mini', 'original', 'large'],
    dbKey: 'format_key',
  },
  badge: {
    values: ['new-arrivals', 'bestsellers', 'limited-edition'],
    dbKey: 'badge_keys',
    urlToDb: { 'new-arrivals': 'new', 'bestsellers': 'popular', 'limited-edition': 'limited' },
  },
}

// Build reverse lookup: slug → { dimension, dbValue }
const SLUG_LOOKUP = new Map<string, { dimension: DimensionKey; dbValue: string }>()
for (const [dim, def] of Object.entries(DIMENSIONS)) {
  for (const slug of def.values) {
    const dbValue = def.urlToDb?.[slug] ?? slug
    SLUG_LOOKUP.set(slug, { dimension: dim as DimensionKey, dbValue })
  }
}

export interface ParseResult {
  filters: Record<string, string>  // dimension → dbValue
  canonical: string                 // canonically ordered URL path
}

/**
 * Parse URL segments into filter dimensions.
 * Returns null if any segment is unrecognized or if dimensions are duplicated.
 * Brand slugs are not handled here — they're resolved dynamically.
 */
export function parseFilterSegments(segments: string[]): ParseResult | null {
  if (segments.length === 0) return null

  const filters: Record<string, string> = {}
  const foundDimensions: { dimension: DimensionKey; slug: string; dbValue: string }[] = []

  for (const segment of segments) {
    const match = SLUG_LOOKUP.get(segment)
    if (!match) return null  // Unknown segment
    if (filters[match.dimension]) return null  // Duplicate dimension
    filters[match.dimension] = match.dbValue
    foundDimensions.push({ ...match, slug: segment })
  }

  // Build canonical URL (ordered by DIMENSION_ORDER)
  const canonicalSegments = DIMENSION_ORDER
    .filter(dim => filters[dim] !== undefined)
    .map(dim => foundDimensions.find(f => f.dimension === dim)!.slug)

  const canonical = canonicalSegments.join('/')

  return { filters, canonical }
}
