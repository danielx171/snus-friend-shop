export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const MembershipPage = lazy(() => import('@/pages/MembershipPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <MembershipPage />}
    </ClientOnly>
  )
}
