export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <LeaderboardPage />}
    </ClientOnly>
  )
}
