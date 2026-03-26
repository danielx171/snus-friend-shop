export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const RewardsPage = lazy(() => import('@/pages/RewardsPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <RewardsPage />}
    </ClientOnly>
  )
}
