export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const SearchResults = lazy(() => import('@/pages/SearchResults'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <SearchResults />}
    </ClientOnly>
  )
}
