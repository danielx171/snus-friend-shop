export { Page }

import InfoPage from '@/pages/InfoPage'
import { PrivacyContent } from '@/components/legal/PrivacyContent'

function Page() {
  return (
    <InfoPage
      title="Privacy Policy"
      legalWarning
      content={<PrivacyContent />}
    />
  )
}
