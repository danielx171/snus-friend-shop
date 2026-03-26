export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const WishlistPage = lazy(() => import('@/pages/WishlistPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <WishlistPage />}
    </ClientOnly>
  )
}
