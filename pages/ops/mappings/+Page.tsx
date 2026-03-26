export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const OpsAuthGuard = lazy(() => import('@/components/auth/OpsAuthGuard'))
const SkuMappings = lazy(() => import('@/pages/ops/SkuMappings'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => (
        <OpsAuthGuard>
          <SkuMappings />
        </OpsAuthGuard>
      )}
    </ClientOnly>
  )
}
