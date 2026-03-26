export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const OpsAuthGuard = lazy(() => import('@/components/auth/OpsAuthGuard'))
const SyncStatus = lazy(() => import('@/pages/ops/SyncStatus'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => (
        <OpsAuthGuard>
          <SyncStatus />
        </OpsAuthGuard>
      )}
    </ClientOnly>
  )
}
