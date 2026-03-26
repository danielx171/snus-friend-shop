export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const AccountPage = lazy(() => import('@/pages/AccountPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <AccountPage />}
    </ClientOnly>
  )
}
