export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const OpsLogin = lazy(() => import('@/pages/ops/OpsLogin'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <OpsLogin />}
    </ClientOnly>
  )
}
