/**
 * Privacy Policy content for /privacy route.
 * Rendered inside <InfoPage> which wraps it in prose styling.
 */
export function PrivacyContent() {
  return (
    <>
      <p className="text-xs italic text-muted-foreground">
        This document has been prepared for informational purposes. We recommend consulting with a qualified legal
        professional for advice specific to your situation.
      </p>

      <p><strong className="text-foreground">Last updated:</strong> 25 March 2026</p>

      {/* 1 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">1. Data controller</h2>
      <p>
        SnusFriend (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the data controller for personal data
        collected through{" "}
        <a href="https://snusfriends.com" className="text-primary hover:underline">snusfriends.com</a>. We are
        committed to protecting your privacy in accordance with the General Data Protection Regulation (EU) 2016/679
        (&ldquo;GDPR&rdquo;) and applicable member state data protection laws.
      </p>
      <p>
        For any data protection queries, including exercising your rights under the GDPR, contact us at{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.
      </p>

      {/* 2 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">2. Data we collect</h2>
      <p>We collect and process the following categories of personal data:</p>

      <h3 className="text-foreground font-semibold mt-4">Account data</h3>
      <p>
        Email address, first name, last name, and phone number (optional) &mdash; collected when you create an account.
        Passwords are cryptographically hashed and never stored in plain text.
      </p>

      <h3 className="text-foreground font-semibold mt-4">Order data</h3>
      <p>
        Delivery address, phone number, order history, line items, and payment transaction references &mdash; collected
        when you place an order.
      </p>

      <h3 className="text-foreground font-semibold mt-4">Engagement data</h3>
      <p>
        Product reviews, community posts and comments, poll votes, wishlist items, SnusPoints balance and transaction
        history, spin wheel results, quest progress, and newsletter subscription status &mdash; collected as you interact
        with our platform features.
      </p>

      <h3 className="text-foreground font-semibold mt-4">Technical data</h3>
      <p>
        IP address, browser type and version, device type, operating system, and referring URL &mdash; collected
        automatically via server logs from Vercel (frontend hosting) and Supabase (backend hosting).
      </p>

      {/* 3 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">3. Legal bases for processing (GDPR Art. 6)</h2>
      <p>We process your personal data on the following legal bases:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-foreground">Performance of a contract (Art. 6(1)(b)):</strong> processing your orders,
          managing your account, providing customer support, and administering the SnusPoints loyalty programme.
        </li>
        <li>
          <strong className="text-foreground">Consent (Art. 6(1)(a)):</strong> sending marketing emails and newsletters,
          setting analytics and marketing cookies (when implemented), and processing data for personalisation features. You
          can withdraw consent at any time without affecting the lawfulness of processing based on consent before its
          withdrawal.
        </li>
        <li>
          <strong className="text-foreground">Legitimate interest (Art. 6(1)(f)):</strong> fraud prevention, site security,
          service improvement, and generating aggregate analytics. We balance our interests against your rights and freedoms
          before relying on this basis.
        </li>
        <li>
          <strong className="text-foreground">Legal obligation (Art. 6(1)(c)):</strong> retaining order and transaction
          records as required by EU tax regulations and consumer protection law.
        </li>
      </ul>

      {/* 4 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">4. Purposes of processing</h2>
      <p>We use your personal data for the following purposes:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Creating and managing your account</li>
        <li>Processing and fulfilling orders, including payment and delivery</li>
        <li>Providing customer support and responding to enquiries</li>
        <li>Administering the SnusPoints loyalty programme, quests, and rewards</li>
        <li>Operating community features (reviews, posts, polls)</li>
        <li>Sending transactional emails (order confirmations, shipping updates)</li>
        <li>Sending marketing communications (with your consent)</li>
        <li>Improving our website, products, and services</li>
        <li>Preventing fraud and ensuring site security</li>
        <li>Complying with legal obligations</li>
      </ul>

      {/* 5 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">5. Data processors and third-party sharing</h2>
      <p>
        We share your data with the following third-party processors, solely for the purposes described. Each processor is
        bound by a data processing agreement in accordance with GDPR Art. 28.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-foreground">Supabase (Supabase Inc.):</strong> database hosting, user authentication,
          and serverless functions. Data is stored in the <strong className="text-foreground">EU-West-1 (Ireland)</strong>{" "}
          region.
        </li>
        <li>
          <strong className="text-foreground">Nyehandel / NFC Group Payment:</strong> order processing and secure payment
          handling. NFC Group Payment is PCI DSS-compliant.
        </li>
        <li>
          <strong className="text-foreground">Nylogistik / UPS:</strong> order fulfilment, warehousing, and delivery.
          Your name and delivery address are shared for shipping purposes.
        </li>
        <li>
          <strong className="text-foreground">Vercel Inc.:</strong> frontend website hosting and content delivery network
          (CDN). Server logs including IP addresses are processed for security and performance.
        </li>
        <li>
          <strong className="text-foreground">Google Analytics (planned):</strong> website usage analytics via Google
          Analytics 4. Will only be activated with your explicit consent via our cookie consent tool. Data will be
          anonymised where possible.
        </li>
        <li>
          <strong className="text-foreground">Meta Platforms (planned):</strong> Meta Pixel for advertising measurement.
          Will only be activated with your explicit consent via our cookie consent tool.
        </li>
        <li>
          <strong className="text-foreground">Google Ads (planned):</strong> conversion tracking for advertising. Will
          only be activated with your explicit consent via our cookie consent tool.
        </li>
        <li>
          <strong className="text-foreground">DeepSeek (AI review summaries):</strong> we use the DeepSeek API to generate
          aggregate review summaries for products.{" "}
          <strong className="text-foreground">No personally identifiable information (PII) is sent to DeepSeek.</strong>{" "}
          Only anonymised review text (with usernames and personal details removed) is processed.
        </li>
      </ul>
      <p>
        We do not sell your personal data to any third party. We do not share your data with advertisers except as
        described above and only with your explicit consent.
      </p>

      {/* 6 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">6. Cookies</h2>
      <p>
        We use a limited number of cookies and browser storage mechanisms that are necessary for the site to function. For
        full details on what cookies we use, their purposes, and how to manage them, see our{" "}
        <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
      </p>

      {/* 7 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">7. Data retention</h2>
      <p>We retain your personal data for the following periods:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-foreground">Account data:</strong> retained for as long as your account is active.
          Upon account deletion, personal data is removed within 30 days, except where retention is required by law.
        </li>
        <li>
          <strong className="text-foreground">Order and transaction records:</strong> retained for{" "}
          <strong className="text-foreground">7 years</strong> after the order date to comply with EU tax and accounting
          obligations.
        </li>
        <li>
          <strong className="text-foreground">Server and access logs:</strong> retained for{" "}
          <strong className="text-foreground">30 days</strong> for security monitoring and debugging, then automatically
          purged.
        </li>
        <li>
          <strong className="text-foreground">Marketing consent records:</strong> retained for as long as the consent is
          active and for 3 years after withdrawal (to demonstrate compliance).
        </li>
        <li>
          <strong className="text-foreground">Community content (reviews, posts):</strong> retained until you delete them
          or request deletion. Anonymised aggregate data may be retained after deletion.
        </li>
      </ul>

      {/* 8 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">8. Your rights under the GDPR</h2>
      <p>
        As a data subject in the EU/EEA (or the UK, where equivalent rights apply), you have the following rights
        regarding your personal data:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-foreground">Right of access (Art. 15):</strong> request a copy of the personal data we
          hold about you.
        </li>
        <li>
          <strong className="text-foreground">Right to rectification (Art. 16):</strong> request correction of inaccurate
          or incomplete data.
        </li>
        <li>
          <strong className="text-foreground">Right to erasure (Art. 17):</strong> request deletion of your data
          (&ldquo;right to be forgotten&rdquo;), subject to legal retention obligations.
        </li>
        <li>
          <strong className="text-foreground">Right to data portability (Art. 20):</strong> receive your data in a
          structured, commonly used, machine-readable format.
        </li>
        <li>
          <strong className="text-foreground">Right to restrict processing (Art. 18):</strong> request that we limit how
          we use your data while a complaint or correction is being resolved.
        </li>
        <li>
          <strong className="text-foreground">Right to object (Art. 21):</strong> object to processing based on
          legitimate interest, including profiling.
        </li>
        <li>
          <strong className="text-foreground">Right to withdraw consent (Art. 7(3)):</strong> withdraw consent for
          marketing communications and optional cookies at any time, without affecting the lawfulness of processing
          performed before withdrawal.
        </li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>. We
        will respond within <strong className="text-foreground">30 days</strong> of receiving your request, as required
        by the GDPR. We may ask you to verify your identity before processing your request.
      </p>

      {/* 9 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">9. International data transfers</h2>
      <p>
        Your personal data is primarily stored and processed within the European Union:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-foreground">Supabase:</strong> database and authentication data is hosted in{" "}
          <strong className="text-foreground">EU-West-1 (Ireland)</strong>.
        </li>
        <li>
          <strong className="text-foreground">Vercel:</strong> frontend hosting and CDN. While Vercel serves content
          from edge locations globally, application data processing occurs primarily in the EU. Where data is transferred
          to the United States, Vercel relies on Standard Contractual Clauses (SCCs) approved by the European Commission
          as the transfer mechanism.
        </li>
        <li>
          <strong className="text-foreground">DeepSeek:</strong> anonymised, non-PII review text may be processed
          outside the EU. Since no personal data is transmitted, GDPR transfer restrictions do not apply.
        </li>
      </ul>
      <p>
        Where personal data is transferred outside the EU/EEA, we ensure appropriate safeguards are in place, including
        Standard Contractual Clauses (SCCs) and, where applicable, supplementary measures as recommended by the European
        Data Protection Board.
      </p>

      {/* 10 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">10. Data security</h2>
      <p>
        We implement appropriate technical and organisational measures to protect your personal data, including:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Encrypted connections (TLS/HTTPS) for all data in transit</li>
        <li>Cryptographically hashed passwords (never stored in plain text)</li>
        <li>Row-level security (RLS) policies on our database to prevent unauthorised access</li>
        <li>Access controls and authentication on all backend systems and admin endpoints</li>
        <li>XSS sanitisation and CORS policies on all API endpoints</li>
        <li>Regular security reviews of our codebase and infrastructure</li>
      </ul>
      <p>
        No method of transmission over the internet or electronic storage is 100% secure. While we take reasonable steps
        to protect your information, we cannot guarantee absolute security.
      </p>

      {/* 11 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">11. Children&apos;s privacy</h2>
      <p>
        Our site and products are intended exclusively for adults aged 18 and over. We enforce an age verification gate
        upon entry to the site. We do not knowingly collect personal data from anyone under 18 years of age. If we become
        aware that we have collected data from a minor, we will delete it promptly and terminate the associated account.
      </p>
      <p>
        If you are a parent or guardian and believe your child has provided us with personal data, please contact us
        immediately at{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.
      </p>

      {/* 12 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">12. Complaints</h2>
      <p>
        If you believe we have not handled your personal data correctly, we encourage you to contact us first at{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a> so
        we can address your concern.
      </p>
      <p>
        You also have the right to lodge a complaint with your local data protection supervisory authority under{" "}
        <strong className="text-foreground">GDPR Art. 77</strong>. A list of EU/EEA supervisory authorities is available
        at{" "}
        <a
          href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          edpb.europa.eu
        </a>
        .
      </p>

      {/* 13 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">13. Changes to this policy</h2>
      <p>
        We may update this privacy policy from time to time to reflect changes in our practices, legal requirements, or
        the services we offer. Changes will be posted on this page with a revised &ldquo;last updated&rdquo; date.
        Material changes will be communicated via email to registered account holders where practicable.
      </p>
      <p>
        We encourage you to review this policy periodically. Your continued use of the site after changes are posted
        constitutes acceptance of the updated policy.
      </p>
    </>
  );
}
