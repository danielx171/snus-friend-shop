export { Page }

import InfoPage from '@/pages/InfoPage'
import { TermsContent } from '@/components/legal/TermsContent'

function Page() {
  return (
    <InfoPage
      title="Terms & Conditions"
      legalWarning
      content={<TermsContent />}
    />
  )
}
