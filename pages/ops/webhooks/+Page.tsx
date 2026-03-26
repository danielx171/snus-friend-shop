export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const OpsAuthGuard = lazy(() => import('@/components/auth/OpsAuthGuard'))
const WebhookInbox = lazy(() => import('@/pages/ops/WebhookInbox'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => (
        <OpsAuthGuard>
          <WebhookInbox />
        </OpsAuthGuard>
      )}
    </ClientOnly>
  )
}
