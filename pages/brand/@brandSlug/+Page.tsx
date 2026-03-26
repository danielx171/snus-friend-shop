export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const BrandHub = lazy(() => import('@/pages/BrandHub'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <BrandHub />}
    </ClientOnly>
  )
}
