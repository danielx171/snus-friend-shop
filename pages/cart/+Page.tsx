export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const CartPage = lazy(() => import('@/pages/CartPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <CartPage />}
    </ClientOnly>
  )
}
