export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const RegisterPage = lazy(() => import('@/pages/RegisterPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <RegisterPage />}
    </ClientOnly>
  )
}
