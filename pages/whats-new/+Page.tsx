export { Page }

import { ClientOnly } from 'vike-react/ClientOnly'
import WhatsNewPage from '@/pages/WhatsNewPage'

function Page() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {() => <WhatsNewPage />}
    </ClientOnly>
  )
}
