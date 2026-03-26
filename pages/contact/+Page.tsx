export { Page }

import InfoPage from '@/pages/InfoPage'

function Page() {
  return (
    <InfoPage
      title="Contact Us"
      content={
        <>
          <p>We're here to help. Reach us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a> and we'll get back to you within 24 hours on business days.</p>
          <p>For order-related queries, please include your order ID in the subject line so we can look into it faster.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">Business enquiries</h2>
          <p>For wholesale, partnerships, or brand enquiries, please also reach us at the address above with "Business" in the subject line.</p>
        </>
      }
    />
  )
}
