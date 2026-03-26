export { Page }

import InfoPage from '@/pages/InfoPage'

function Page() {
  return (
    <InfoPage
      title="Shipping Information"
      content={
        <>
          <h2 className="text-foreground font-semibold text-lg">Free delivery</h2>
          <p>All orders over €29 qualify for free standard delivery. No discount code needed — it's applied automatically at checkout.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">Delivery times</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Standard delivery: 3–5 business days</li>
            <li>Orders placed before 2pm on business days are dispatched the same day</li>
            <li>Orders placed after 2pm or on weekends are dispatched the next business day</li>
          </ul>
          <h2 className="text-foreground font-semibold text-lg mt-6">Tracking</h2>
          <p>Once your order ships, you'll receive an email with your tracking number. You can also view your tracking status in your account under Order History.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">Where do you ship?</h2>
          <p>We ship to the UK and most EU countries. The full list of supported countries is shown at checkout. We use Nylogistik for all fulfilment.</p>
        </>
      }
    />
  )
}
