export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const UpdatePasswordPage = lazy(() => import('@/pages/UpdatePasswordPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <UpdatePasswordPage />}
    </ClientOnly>
  )
}
