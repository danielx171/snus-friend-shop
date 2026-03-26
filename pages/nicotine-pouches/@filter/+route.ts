import { parseFilterSegments } from '@/lib/filter-dimensions'

export function route(pageContext: { urlPathname: string }) {
  const path = pageContext.urlPathname
  if (!path.startsWith('/nicotine-pouches/')) return false

  const rest = path.replace('/nicotine-pouches/', '').replace(/\/$/, '')
  if (!rest) return false  // bare /nicotine-pouches/ handled by parent route

  const segments = rest.split('/')
  const result = parseFilterSegments(segments)
  if (!result) return false

  // If segments are not in canonical order, include redirect URL
  if (result.canonical !== rest) {
    return {
      routeParams: {
        filter: rest,
        redirect: `/nicotine-pouches/${result.canonical}/`,
        ...result.filters,
      },
    }
  }

  return { routeParams: { filter: rest, ...result.filters } }
}
