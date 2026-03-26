export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const CommunityPage = lazy(() => import('@/pages/CommunityPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <CommunityPage />}
    </ClientOnly>
  )
}
