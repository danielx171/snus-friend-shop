export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

const BlogPost = lazy(() => import('@/pages/BlogPost'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <BlogPost />}
    </ClientOnly>
  )
}
