import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { CookieConsentBanner } from "@/components/cookie-consent/CookieConsentBanner";
import { BackToTop } from "@/components/layout/BackToTop";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { EasterOverlay } from "@/components/easter/EasterOverlay";

/**
 * App shell — global UI components that appear on every page.
 * All routing is handled by Vike file-based routing (pages/ directory).
 * Providers are in pages/+Wrapper.tsx.
 */
const App = () => {
  return (
    <>
      <OrganizationSchema />
      <CookieConsentBanner />
      <BackToTop />
      <InstallPrompt />
      <EasterOverlay />
    </>
  );
};

export default App;
