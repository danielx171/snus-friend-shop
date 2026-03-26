export { Page }

import InfoPage from '@/pages/InfoPage'

function Page() {
  return (
    <InfoPage
      title="Returns & Refunds"
      content={
        <>
          <h2 className="text-foreground font-semibold text-lg">Return window</h2>
          <p>You have 14 days from the date of delivery to request a return. Products must be unopened and in their original packaging.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">How to return</h2>
          <p>Email <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a> with your order ID and the reason for your return. We'll send you return instructions within 1 business day.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">Refunds</h2>
          <p>Once we receive and inspect the returned items, your refund will be processed within 5–7 business days to your original payment method.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">Return shipping costs</h2>
          <p>If an item is faulty, damaged, or incorrect, we cover the return shipping cost. For change-of-mind returns, the buyer is responsible for return shipping.</p>
        </>
      }
    />
  )
}
