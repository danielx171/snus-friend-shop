/**
 * Terms & Conditions content for /terms route.
 * Rendered inside <InfoPage> which wraps it in prose styling.
 */
export function TermsContent() {
  return (
    <>
      <p className="text-xs italic text-muted-foreground">
        This document has been prepared for informational purposes. We recommend consulting with a qualified legal professional for advice specific to your situation.
      </p>

      <p><strong className="text-foreground">Last updated:</strong> 25 March 2026</p>

      {/* 1 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">1. About us</h2>
      <p>
        SnusFriend (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an EU-based online retailer of tobacco-free
        nicotine pouches, trading at{" "}
        <a href="https://snusfriends.com" className="text-primary hover:underline">snusfriends.com</a>.
      </p>
      <p>
        For questions about these terms, contact us at{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.
      </p>

      {/* 2 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">2. Age restriction</h2>
      <p>
        You must be at least <strong className="text-foreground">18 years old</strong> to use this website and purchase
        products from us. This requirement applies in all EU member states and reflects applicable regulations on the sale
        of nicotine products. By accessing our site and placing an order, you confirm that you meet this age requirement.
      </p>
      <p>
        We enforce an age verification gate upon entry to the site. We reserve the right to cancel any order and suspend
        any account where we reasonably believe the buyer is under 18.
      </p>

      {/* 3 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">3. Products</h2>
      <p>
        All products sold on this site are <strong className="text-foreground">tobacco-free nicotine pouches</strong>{" "}
        intended for adult consumers only. Nicotine pouches contain nicotine, which is an addictive substance. They are
        not intended as smoking cessation aids unless otherwise indicated by the manufacturer.
      </p>
      <p>
        Product descriptions, images, flavour profiles, nicotine strengths, and specifications are provided in good faith
        but may vary slightly from the actual product due to manufacturer reformulations, packaging updates, or regional
        variations. We make reasonable efforts to keep product information accurate and up to date.
      </p>
      <p>
        <strong className="text-foreground">Nicotine products are not for sale to minors.</strong> If you are purchasing
        on behalf of another person, you are responsible for ensuring they meet the minimum age requirement.
      </p>

      {/* 4 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">4. Account terms</h2>
      <p>
        You may browse our catalogue without an account. To place orders, track deliveries, earn SnusPoints, and
        participate in community features (reviews, polls, quests), you must create an account with a valid email address.
      </p>
      <p>
        You are responsible for maintaining the security of your account credentials. You must not share your login
        details with others. You agree to notify us promptly at{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>{" "}
        if you suspect unauthorised access to your account.
      </p>
      <p>
        We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or
        misuse community features (e.g., posting inappropriate content, manipulating reviews or SnusPoints).
      </p>

      {/* 5 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">5. Ordering and pricing</h2>
      <p>
        All prices are displayed in <strong className="text-foreground">euros (EUR)</strong> and include VAT where
        applicable. We reserve the right to correct pricing errors before or after an order is placed. If a pricing error
        affects your order, we will notify you and offer you the option to proceed at the correct price or cancel the
        order for a full refund.
      </p>
      <p>
        An order is confirmed only when you receive an order confirmation email from us. The confirmation constitutes
        acceptance of your offer to purchase. We may decline any order at our discretion, including but not limited to
        cases of suspected fraud, stock unavailability, or pricing errors.
      </p>
      <p>
        Product availability is subject to stock levels and may change without notice. We do not guarantee that any
        product listed on the site will be available at the time of your order.
      </p>

      {/* 6 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">6. Payment</h2>
      <p>
        Payments are processed securely through our payment partner,{" "}
        <strong className="text-foreground">NFC Group Payment</strong>, via the Nyehandel commerce platform. We do not
        store your payment card details on our servers. All transactions are encrypted and handled by PCI DSS-compliant
        processors.
      </p>
      <p>
        By submitting a payment, you confirm that the payment method is yours or that you have authorisation to use it.
        If a payment is declined or reversed, we reserve the right to cancel the associated order.
      </p>

      {/* 7 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">7. Shipping and delivery</h2>
      <p>
        Orders are fulfilled by <strong className="text-foreground">Nylogistik</strong> and shipped via{" "}
        <strong className="text-foreground">UPS Standard</strong>. Standard delivery takes 3&ndash;5 business days.
        Orders over &euro;29 qualify for free shipping.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Orders placed before 14:00 CET on business days are dispatched the same day.</li>
        <li>Orders placed after 14:00 CET or on weekends/public holidays are dispatched the next business day.</li>
      </ul>
      <p>
        We ship to most EU countries. The full list of supported countries is displayed at checkout. Delivery times are
        estimates and are not guaranteed. Delays may occur due to customs processing, carrier issues, or force majeure
        events. Risk of loss and damage passes to you upon delivery.
      </p>

      {/* 8 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">8. Right of withdrawal (EU consumers)</h2>
      <p>
        Under the <strong className="text-foreground">EU Consumer Rights Directive (2011/83/EU)</strong>, you have the
        right to withdraw from your purchase within <strong className="text-foreground">14 days</strong> of receiving
        your order, without giving a reason.
      </p>
      <p>
        To exercise this right, send a clear statement of your decision to withdraw to{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>,
        including your order ID. You may use any unambiguous written statement (a specific form is not required).
      </p>
      <p>
        <strong className="text-foreground">Important exception:</strong> Pursuant to Article 16(e) of the Consumer Rights
        Directive, sealed goods which are not suitable for return due to health protection or hygiene reasons may be exempt
        from the right of withdrawal once unsealed after delivery. Nicotine pouches that have been opened or where the seal
        has been broken may fall under this exemption. Unopened products in their original sealed packaging remain eligible
        for return.
      </p>

      {/* 9 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">9. Return conditions</h2>
      <p>To be eligible for a return, items must be:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Returned within 14 days of delivery</li>
        <li>Unopened and in their original sealed packaging</li>
        <li>In the same condition as when received</li>
      </ul>
      <p>
        We cannot accept returns of opened, used, or damaged products (except where the product was received faulty or
        damaged).
      </p>

      {/* 10 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">10. Refund process</h2>
      <p>
        Once we receive and inspect the returned items, your refund will be processed within{" "}
        <strong className="text-foreground">14 days</strong> to your original payment method, in accordance with EU
        consumer law.
      </p>
      <p>
        If a product is faulty, damaged during shipping, or incorrect, we cover the return shipping cost and will issue a
        full refund or send a replacement at your choice. For change-of-mind returns, the buyer is responsible for return
        shipping costs.
      </p>

      {/* 11 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">11. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by applicable law, SnusFriend shall not be liable for any indirect, incidental,
        special, or consequential damages arising from your use of this website or products purchased from us, including
        but not limited to loss of profits, data, or goodwill.
      </p>
      <p>
        Our total aggregate liability for any claim related to an order shall not exceed the amount you paid for the
        relevant order.
      </p>
      <p>
        Nothing in these terms excludes or limits our liability for: (a) death or personal injury caused by our
        negligence; (b) fraud or fraudulent misrepresentation; or (c) any other liability that cannot be excluded or
        limited by applicable EU or member state law.
      </p>

      {/* 12 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">12. Intellectual property</h2>
      <p>
        All content on this website &mdash; including text, graphics, logos, icons, photographs, software, and
        compilation of content &mdash; is the property of SnusFriend or its licensors and is protected by applicable
        intellectual property laws within the European Union and internationally.
      </p>
      <p>
        Product names, brand names, and logos displayed on this site are trademarks of their respective owners and are
        used for identification purposes only. Their use does not imply endorsement by or affiliation with SnusFriend.
      </p>
      <p>
        You may not reproduce, distribute, modify, create derivative works from, or commercially exploit any content from
        this website without our prior written permission.
      </p>

      {/* 13 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">13. Governing law and jurisdiction</h2>
      <p>
        These terms are governed by and construed in accordance with the laws of the European Union and the applicable
        member state where SnusFriend is established. Any disputes arising from or in connection with these terms shall be
        submitted to the competent courts of that jurisdiction.
      </p>
      <p>
        If you are a consumer habitually resident in the EU, you also enjoy the protection of mandatory provisions of the
        consumer protection laws of your country of residence. Nothing in these terms affects your rights as a consumer to
        rely on those provisions or to bring proceedings in the courts of your country of residence.
      </p>

      {/* 14 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">14. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The updated version will be posted on this page with a revised
        &ldquo;last updated&rdquo; date. Material changes will be communicated via email to registered account holders
        where practicable. Continued use of the site after changes are posted constitutes acceptance of the new terms.
      </p>

      {/* 15 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">15. Dispute resolution</h2>
      <p>
        If you have a complaint about your order or our services, please contact us first at{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>. We
        will endeavour to resolve your complaint promptly and fairly.
      </p>
      <p>
        If we are unable to resolve the matter to your satisfaction, you may refer the dispute to the{" "}
        <strong className="text-foreground">EU Online Dispute Resolution (ODR) platform</strong> at{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          https://ec.europa.eu/consumers/odr
        </a>
        . The ODR platform is provided by the European Commission and offers an out-of-court mechanism for resolving
        disputes between consumers and online traders in the EU.
      </p>
      <p>
        You also retain the right to take legal action through the courts of your country of residence, in accordance with
        applicable EU consumer protection regulations.
      </p>
    </>
  );
}
