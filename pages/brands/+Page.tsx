export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const BrandsIndex = lazy(() => import('@/pages/BrandsIndex'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <BrandsIndex />}
    </ClientOnly>
  )
}
