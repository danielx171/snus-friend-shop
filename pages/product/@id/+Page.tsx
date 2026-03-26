export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import { lazy } from 'react'

// ProductDetail uses useParams() from react-router-dom internally.
// Since ssr: false, this runs entirely client-side inside BrowserRouter
// (App.tsx wraps everything in BrowserRouter), so useParams() resolves
// correctly from the live URL — no prop-drilling needed.
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <ProductDetail />}
    </ClientOnly>
  )
}
