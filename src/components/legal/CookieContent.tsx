/**
 * Cookie Policy content for /cookies route.
 * Rendered inside <InfoPage> which wraps it in prose styling.
 */
export function CookieContent() {
  return (
    <>
      <p className="text-xs italic text-muted-foreground">
        This document has been prepared for informational purposes. We recommend consulting with a qualified legal
        professional for advice specific to your situation.
      </p>

      <p><strong className="text-foreground">Last updated:</strong> 25 March 2026</p>

      {/* 1 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">1. What are cookies and local storage?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the site remember your
        preferences and provide essential functionality. <strong className="text-foreground">Local storage</strong>{" "}
        (localStorage) is a similar browser mechanism that allows websites to store data on your device. Unlike cookies,
        localStorage data is not sent to the server with every request &mdash; it stays on your device and is accessed
        only by the website that created it.
      </p>
      <p>
        This policy explains what cookies and local storage snusfriends.com uses, why we use them, and how you can
        manage them.
      </p>

      {/* 2 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">2. Cookie categories</h2>

      {/* Essential */}
      <h3 className="text-foreground font-semibold mt-4">Essential (always active)</h3>
      <p>
        These cookies and storage items are strictly necessary for the website to function. They cannot be disabled
        without breaking core functionality. No consent is required for essential cookies under the ePrivacy Directive.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Name</th>
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Type</th>
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Purpose</th>
              <th className="text-left py-2 text-foreground font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">sb-*-auth-token</td>
              <td className="py-2 pr-4">localStorage</td>
              <td className="py-2 pr-4">Supabase authentication session &mdash; keeps you logged in</td>
              <td className="py-2">Until logout</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">age_verified</td>
              <td className="py-2 pr-4">localStorage</td>
              <td className="py-2 pr-4">Records that you confirmed you are 18+ so the age gate is not shown again</td>
              <td className="py-2">Session</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">cart</td>
              <td className="py-2 pr-4">localStorage</td>
              <td className="py-2 pr-4">Stores shopping cart contents so items persist between page loads</td>
              <td className="py-2">Persistent</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">cookie_consent</td>
              <td className="py-2 pr-4">localStorage</td>
              <td className="py-2 pr-4">Records your cookie consent preferences so the banner is not shown repeatedly</td>
              <td className="py-2">1 year</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">theme</td>
              <td className="py-2 pr-4">localStorage</td>
              <td className="py-2 pr-4">Stores your selected display theme preference</td>
              <td className="py-2">Persistent</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">pwa-install-dismissed</td>
              <td className="py-2 pr-4">localStorage</td>
              <td className="py-2 pr-4">Records if you dismissed the PWA install prompt</td>
              <td className="py-2">Persistent</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Analytics */}
      <h3 className="text-foreground font-semibold mt-6">Analytics (opt-in &mdash; requires your consent)</h3>
      <p>
        Analytics cookies help us understand how visitors use our site, which pages are most popular, and where users
        encounter difficulties. This data helps us improve the website experience.{" "}
        <strong className="text-foreground">These cookies are not currently active</strong> and will only be set after
        you give explicit consent via our cookie consent tool.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Name</th>
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Provider</th>
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Purpose</th>
              <th className="text-left py-2 text-foreground font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">_ga</td>
              <td className="py-2 pr-4">Google Analytics 4</td>
              <td className="py-2 pr-4">Distinguishes unique visitors by assigning a randomly generated identifier</td>
              <td className="py-2">2 years</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">_gid</td>
              <td className="py-2 pr-4">Google Analytics 4</td>
              <td className="py-2 pr-4">Distinguishes visitors within a 24-hour window</td>
              <td className="py-2">24 hours</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">_ga_*</td>
              <td className="py-2 pr-4">Google Analytics 4</td>
              <td className="py-2 pr-4">Persists session state for GA4 measurement</td>
              <td className="py-2">2 years</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Marketing */}
      <h3 className="text-foreground font-semibold mt-6">Marketing (opt-in &mdash; requires your consent)</h3>
      <p>
        Marketing cookies are used to track visitors across websites and display relevant advertisements. They help
        measure the effectiveness of advertising campaigns.{" "}
        <strong className="text-foreground">These cookies are not currently active</strong> and will only be set after
        you give explicit consent.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Name</th>
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Provider</th>
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Purpose</th>
              <th className="text-left py-2 text-foreground font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">_fbp</td>
              <td className="py-2 pr-4">Meta (Facebook)</td>
              <td className="py-2 pr-4">Identifies browsers for Meta advertising delivery and measurement</td>
              <td className="py-2">3 months</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">_fbc</td>
              <td className="py-2 pr-4">Meta (Facebook)</td>
              <td className="py-2 pr-4">Stores click identifiers from Meta ad clicks</td>
              <td className="py-2">3 months</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">_gcl_au</td>
              <td className="py-2 pr-4">Google Ads</td>
              <td className="py-2 pr-4">Stores conversion data from Google Ads clicks</td>
              <td className="py-2">3 months</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Personalisation */}
      <h3 className="text-foreground font-semibold mt-6">Personalisation (opt-in &mdash; requires your consent)</h3>
      <p>
        Personalisation storage helps us remember your preferences and show you relevant content based on your browsing
        history.{" "}
        <strong className="text-foreground">These features are not currently active</strong> and will only be enabled
        after you give explicit consent.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Name</th>
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Type</th>
              <th className="text-left py-2 pr-4 text-foreground font-semibold">Purpose</th>
              <th className="text-left py-2 text-foreground font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">recently_viewed</td>
              <td className="py-2 pr-4">localStorage</td>
              <td className="py-2 pr-4">Stores your recently viewed products to show personalised recommendations</td>
              <td className="py-2">30 days</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">user_preferences</td>
              <td className="py-2 pr-4">localStorage</td>
              <td className="py-2 pr-4">Stores nicotine strength and flavour preferences for product sorting</td>
              <td className="py-2">Persistent</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">3. How to manage cookies</h2>
      <p>You can manage your cookie preferences in the following ways:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-foreground">Our consent tool:</strong> when you first visit snusfriends.com, a cookie
          consent banner allows you to accept or decline non-essential cookie categories. You can change your preferences
          at any time by clicking the cookie settings link in our website footer.
        </li>
        <li>
          <strong className="text-foreground">Browser settings:</strong> most browsers allow you to view, block, and
          delete cookies. You can typically find these controls under Settings &gt; Privacy or Settings &gt; Cookies.
          Consult your browser&apos;s help documentation for specific instructions.
        </li>
        <li>
          <strong className="text-foreground">Clearing localStorage:</strong> you can clear localStorage via your
          browser&apos;s developer tools (Application &gt; Local Storage) or by clearing all site data in your browser
          settings.
        </li>
      </ul>
      <p>
        <strong className="text-foreground">Please note:</strong> blocking or deleting essential cookies/localStorage may
        prevent the website from functioning correctly. You may not be able to log in, maintain a shopping cart, or
        complete purchases.
      </p>

      {/* 4 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">4. Third-party cookies</h2>
      <p>
        When analytics and marketing cookies are activated (with your consent), the following third parties may set cookies
        on your device:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-foreground">Google (Analytics &amp; Ads):</strong> Google&apos;s privacy policy is
          available at{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            policies.google.com/privacy
          </a>
          . You can opt out of Google Analytics using the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </li>
        <li>
          <strong className="text-foreground">Meta (Facebook Pixel):</strong> Meta&apos;s privacy policy is available
          at{" "}
          <a
            href="https://www.facebook.com/privacy/policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            facebook.com/privacy/policy
          </a>
          . You can manage Meta ad preferences at{" "}
          <a
            href="https://www.facebook.com/adpreferences"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            facebook.com/adpreferences
          </a>
          .
        </li>
      </ul>

      {/* 5 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">5. Consent</h2>
      <p>
        When you first visit our site, a cookie consent banner is displayed. You can accept all cookies, decline
        non-essential cookies, or customise your choices by category (analytics, marketing, personalisation).
      </p>
      <p>
        Essential cookies are always active as they are required for the website to function and do not require consent
        under the ePrivacy Directive. Non-essential cookies (analytics, marketing, personalisation) are only set after
        you give explicit, affirmative consent. You can change your preferences at any time.
      </p>

      {/* 6 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">6. Changes to this policy</h2>
      <p>
        We may update this cookie policy if we introduce new cookies, change how we use existing ones, or add new
        third-party integrations. Changes will be posted on this page with a revised &ldquo;last updated&rdquo; date.
        If we add new non-essential cookie categories, we will request your consent before setting them.
      </p>

      {/* 7 */}
      <h2 className="text-foreground font-semibold text-lg mt-6">7. Contact</h2>
      <p>
        If you have questions about our use of cookies or this policy, email us at{" "}
        <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.
      </p>
    </>
  );
}
