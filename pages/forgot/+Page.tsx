export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <ForgotPasswordPage />}
    </ClientOnly>
  )
}
