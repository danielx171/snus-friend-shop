export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const LoginPage = lazy(() => import('@/pages/LoginPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <LoginPage />}
    </ClientOnly>
  )
}
