export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const CheckoutHandoff = lazy(() => import('@/pages/CheckoutHandoff'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <CheckoutHandoff />}
    </ClientOnly>
  )
}
