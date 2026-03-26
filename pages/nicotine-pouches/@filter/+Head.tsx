export { Head }

import { usePageContext } from 'vike-react/usePageContext'
import { DIMENSION_ORDER, DIMENSIONS, type DimensionKey } from '@/lib/filter-dimensions'

// Human-readable label for a URL slug, e.g. "extra-strong" → "Extra Strong"
function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Build ordered, human-readable title words from active filter routeParams.
function buildTitleParts(routeParams: Record<string, string>): string[] {
  const parts: string[] = []

  for (const dim of DIMENSION_ORDER) {
    if (dim === 'brand') continue

    const dbValue = routeParams[dim]
    if (!dbValue) continue

    const def = DIMENSIONS[dim as Exclude<DimensionKey, 'brand'>]

    // Reverse-map dbValue → URL slug to produce the readable label
    const slug =
      (def.urlToDb
        ? Object.entries(def.urlToDb).find(([, v]) => v === dbValue)?.[0]
        : undefined) ?? dbValue

    parts.push(slugToLabel(slug))
  }

  return parts
}

function Head() {
  const { routeParams } = usePageContext()
  const filter = (routeParams.filter as string | undefined) ?? ''

  const parts = buildTitleParts(routeParams as Record<string, string>)
  const readableTitle = parts.length > 0 ? parts.join(' ') : 'Nicotine Pouches'
  const fullTitle = `${readableTitle} Nicotine Pouches — SnusFriend`

  const description =
    parts.length > 0
      ? `Shop ${readableTitle.toLowerCase()} nicotine pouches at SnusFriend. Wide selection, competitive prices, and free EU delivery.`
      : 'Shop nicotine pouches at SnusFriend. Wide selection, competitive prices, and free EU delivery.'

  const canonical = `https://snusfriends.com/nicotine-pouches/${filter}/`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://snusfriends.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Nicotine Pouches',
        item: 'https://snusfriends.com/nicotine-pouches/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${readableTitle} Nicotine Pouches`,
        item: canonical,
      },
    ],
  }

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
