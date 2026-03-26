export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const HomePage = lazy(() => import('@/pages/HomePage'))

function Page() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-background" />
    }>
      {() => <HomePage />}
    </ClientOnly>
  )
}
