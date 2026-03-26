export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const BlogIndex = lazy(() => import('@/pages/BlogIndex'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <BlogIndex />}
    </ClientOnly>
  )
}
