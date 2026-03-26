export { Page }

import InfoPage from '@/pages/InfoPage'

function Page() {
  return (
    <InfoPage
      title="About SnusFriend"
      content={
        <>
          <p>SnusFriend was founded to make the best Scandinavian nicotine pouches accessible across the UK and Europe. We believe in giving smokers a genuinely better alternative — one that's smoke-free, tobacco-free, and actually enjoyable.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">Our range</h2>
          <p>We stock 500+ products from 40+ top brands including VELO, ZYN, Sting, LOOP, Lyft, Skruf, White Fox, Pablo, and many more. New products are added regularly as we expand our catalogue.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">SnusPoints loyalty</h2>
          <p>Every purchase earns you SnusPoints — 10 points per €1 spent. Points accumulate in your account and can be redeemed for discounts. Create a free account to start earning.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">Delivery</h2>
          <p>We ship across the UK and EU with free delivery on orders over €29. All orders are fulfilled by Nylogistik for fast, reliable dispatch.</p>
          <h2 className="text-foreground font-semibold text-lg mt-6">Get in touch</h2>
          <p>Questions? Email us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.</p>
        </>
      }
    />
  )
}
