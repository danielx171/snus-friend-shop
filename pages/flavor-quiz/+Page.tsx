export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const FlavorQuizPage = lazy(() => import('@/pages/FlavorQuizPage'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <FlavorQuizPage />}
    </ClientOnly>
  )
}
