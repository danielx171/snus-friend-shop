export { Page }

import InfoPage from '@/pages/InfoPage'
import { CookieContent } from '@/components/legal/CookieContent'

function Page() {
  return (
    <InfoPage
      title="Cookie Policy"
      legalWarning
      content={<CookieContent />}
    />
  )
}
