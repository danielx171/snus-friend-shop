export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const BundleBuilder = lazy(() => import('@/pages/BundleBuilder'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <BundleBuilder />}
    </ClientOnly>
  )
}
