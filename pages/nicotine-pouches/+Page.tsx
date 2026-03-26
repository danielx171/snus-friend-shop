export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const ProductListing = lazy(() => import('@/pages/ProductListing'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <ProductListing />}
    </ClientOnly>
  )
}
