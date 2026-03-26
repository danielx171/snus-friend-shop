export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <OrderConfirmation />}
    </ClientOnly>
  )
}
