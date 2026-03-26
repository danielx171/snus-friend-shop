export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const OpsAuthGuard = lazy(() => import('@/components/auth/OpsAuthGuard'))
const OpsDashboard = lazy(() => import('@/pages/ops/OpsDashboard'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => (
        <OpsAuthGuard>
          <OpsDashboard />
        </OpsAuthGuard>
      )}
    </ClientOnly>
  )
}
