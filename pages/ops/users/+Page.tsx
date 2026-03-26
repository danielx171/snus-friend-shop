export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const OpsAuthGuard = lazy(() => import('@/components/auth/OpsAuthGuard'))
const OpsUsers = lazy(() => import('@/pages/ops/OpsUsers'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => (
        <OpsAuthGuard>
          <OpsUsers />
        </OpsAuthGuard>
      )}
    </ClientOnly>
  )
}
