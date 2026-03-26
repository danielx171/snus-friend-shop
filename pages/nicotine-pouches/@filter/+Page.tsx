export { Page }

import { usePageContext } from 'vike-react/usePageContext'
import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'
import { DIMENSION_ORDER, DIMENSIONS, type DimensionKey } from '@/lib/filter-dimensions'

const ProductListing = lazy(() => import('@/pages/ProductListing'))

// Human-readable label for a URL slug, e.g. "extra-strong" → "Extra Strong"
function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Build an ordered, human-readable heading from active filter routeParams.
// Dimensions are emitted in canonical order (brand → strength → flavor → format → badge).
function buildHeading(routeParams: Record<string, string>): string {
  const parts: string[] = []

  for (const dim of DIMENSION_ORDER) {
    if (dim === 'brand') continue  // brands handled separately when brand pages exist

    const dbValue = routeParams[dim]
    if (!dbValue) continue

    const def = DIMENSIONS[dim as Exclude<DimensionKey, 'brand'>]

    // Reverse-map dbValue → URL slug so we can produce the readable label
    const slug =
      (def.urlToDb
        ? Object.entries(def.urlToDb).find(([, v]) => v === dbValue)?.[0]
        : undefined) ?? dbValue

    parts.push(slugToLabel(slug))
  }

  if (parts.length === 0) return 'Nicotine Pouches'
  return parts.join(' ') + ' Nicotine Pouches'
}

function Page() {
  const { routeParams } = usePageContext()

  // Handle canonical redirect (non-canonical URL order → redirect to canonical)
  if (routeParams.redirect) {
    if (typeof window !== 'undefined') {
      window.location.replace(routeParams.redirect as string)
    }
    return null
  }

  const heading = buildHeading(routeParams as Record<string, string>)

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => (
        <>
          {/* Visually hidden h1 — SEO heading unique to this filter URL.
              ProductListing renders its own visible heading inside Layout;
              this ensures crawlers always see a unique, descriptive H1 in the DOM. */}
          <h1 className="sr-only">{heading}</h1>
          <ProductListing />
        </>
      )}
    </ClientOnly>
  )
}
