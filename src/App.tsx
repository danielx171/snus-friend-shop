import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "next-themes";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { HelmetProvider } from "react-helmet-async";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
// Critical path pages — eagerly loaded for instant first paint
import HomePage from "./pages/HomePage";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

// Lazy-load all other pages — they're not part of the main landing flow
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutHandoff = lazy(() => import("./pages/CheckoutHandoff"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const UpdatePasswordPage = lazy(() => import("./pages/UpdatePasswordPage"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const BrandHub = lazy(() => import("./pages/BrandHub"));
const BrandsIndex = lazy(() => import("./pages/BrandsIndex"));
const MembershipPage = lazy(() => import("./pages/MembershipPage"));
const RewardsPage = lazy(() => import("./pages/RewardsPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const BundleBuilder = lazy(() => import("./pages/BundleBuilder"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const WhatsNewPage = lazy(() => import("./pages/WhatsNewPage"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
import OpsAuthGuard from "./components/auth/OpsAuthGuard";
import { CookieConsent } from "@/components/cookie/CookieConsent";
import { BackToTop } from "@/components/layout/BackToTop";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AgeGate } from "@/components/compliance/AgeGate";

/** Redirect legacy /produkt/:id to /product/:id (SEO: avoid duplicate content) */
function ProduktRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/product/${id}`} replace />;
}

// Lazy-load ops pages — they are admin-only and rarely visited
const OpsLogin = lazy(() => import("./pages/ops/OpsLogin"));
const OpsDashboard = lazy(() => import("./pages/ops/OpsDashboard"));
const WebhookInbox = lazy(() => import("./pages/ops/WebhookInbox"));
const SyncStatus = lazy(() => import("./pages/ops/SyncStatus"));
const SkuMappings = lazy(() => import("./pages/ops/SkuMappings"));
const OpsUsers = lazy(() => import("./pages/ops/OpsUsers"));
import { hasSupabaseEnv, missingSupabaseEnvVars } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry on client errors (4xx). Retrying auth failures or missing
      // resources wastes requests and delays showing the real error to the user.
      retry: (failureCount, error) => {
        if (error instanceof Error && /^apiFetch .+: [45]\d\d$/.test(error.message)) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const MissingApiKeysScreen = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <div className="w-full max-w-xl rounded-lg border border-destructive/40 bg-card p-6">
      <h1 className="text-2xl font-semibold">Missing API Keys</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Frontend environment variables for Supabase are missing. Add the variables below and restart the Vite dev server.
      </p>
      <ul className="mt-4 list-disc pl-5 text-sm">
        {missingSupabaseEnvVars.map((envVar) => (
          <li key={envVar}>{envVar}</li>
        ))}
      </ul>
    </div>
  </div>
);

const App = () => {
  if (!hasSupabaseEnv) return <MissingApiKeysScreen />;

  return (
    <AgeGate>
    <ErrorBoundary>
    <HelmetProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="velo"
      enableSystem={false}
      themes={['velo', 'light']}
    >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
            <CookieConsentProvider>
              <Toaster />
              <Sonner />
              <OrganizationSchema />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/produkter" element={<Navigate to="/nicotine-pouches" replace />} />
              <Route path="/nicotine-pouches" element={<ProductListing />} />
              <Route path="/produkt/:id" element={<ProduktRedirect />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutHandoff />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot" element={<ForgotPasswordPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/brands" element={<BrandsIndex />} />
              <Route path="/brand/:brandSlug" element={<BrandHub />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/bundle-builder" element={<BundleBuilder />} />
              {/* Info pages */}
              <Route path="/contact" element={<InfoPage title="Contact Us" content={<>
                <p>We're here to help. Reach us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a> and we'll get back to you within 24 hours on business days.</p>
                <p>For order-related queries, please include your order ID in the subject line so we can look into it faster.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Business enquiries</h2>
                <p>For wholesale, partnerships, or brand enquiries, please also reach us at the address above with "Business" in the subject line.</p>
              </>} />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/whats-new" element={<WhatsNewPage />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/shipping" element={<InfoPage title="Shipping Information" content={<>
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
              </>} />} />
              <Route path="/returns" element={<InfoPage title="Returns & Refunds" content={<>
                <h2 className="text-foreground font-semibold text-lg">Return window</h2>
                <p>You have 14 days from the date of delivery to request a return. Products must be unopened and in their original packaging.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">How to return</h2>
                <p>Email <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a> with your order ID and the reason for your return. We'll send you return instructions within 1 business day.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Refunds</h2>
                <p>Once we receive and inspect the returned items, your refund will be processed within 5–7 business days to your original payment method.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Return shipping costs</h2>
                <p>If an item is faulty, damaged, or incorrect, we cover the return shipping cost. For change-of-mind returns, the buyer is responsible for return shipping.</p>
              </>} />} />
              <Route path="/about" element={<InfoPage title="About SnusFriend" content={<>
                <p>SnusFriend was founded to make the best Scandinavian nicotine pouches accessible across the UK and Europe. We believe in giving smokers a genuinely better alternative — one that's smoke-free, tobacco-free, and actually enjoyable.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Our range</h2>
                <p>We stock 500+ products from 40+ top brands including VELO, ZYN, Sting, LOOP, Lyft, Skruf, White Fox, Pablo, and many more. New products are added regularly as we expand our catalogue.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">SnusPoints loyalty</h2>
                <p>Every purchase earns you SnusPoints — 10 points per €1 spent. Points accumulate in your account and can be redeemed for discounts. Create a free account to start earning.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Delivery</h2>
                <p>We ship across the UK and EU with free delivery on orders over €29. All orders are fulfilled by Nylogistik for fast, reliable dispatch.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Get in touch</h2>
                <p>Questions? Email us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.</p>
              </>} />} />
              {/* Legal pages — need solicitor sign-off before go-live */}
              <Route path="/terms" element={<InfoPage title="Terms & Conditions" legalWarning content={<>
                <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800 mb-6 font-medium">
                  DRAFT — This document is pending legal review. Content may change before launch.
                </div>

                <p><strong className="text-foreground">Last updated:</strong> 25 March 2026</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">1. About us</h2>
                <p>SnusFriend ("we", "us", "our") is an EU-based online retailer of tobacco-free nicotine pouches, trading at <a href="https://snusfriends.com" className="text-primary hover:underline">snusfriends.com</a>. For questions about these terms, contact us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">2. Age restriction</h2>
                <p>You must be at least 18 years old to use this website and purchase products from us. By placing an order, you confirm that you meet this age requirement. We reserve the right to cancel any order where we reasonably believe the buyer is under 18.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">3. Products</h2>
                <p>All products sold on this site are tobacco-free nicotine pouches intended for adult consumers. Product descriptions, images, and specifications are provided in good faith but may vary slightly from the actual product due to manufacturer updates. Nicotine pouches contain nicotine, which is an addictive substance.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">4. Ordering and pricing</h2>
                <p>All prices are displayed in euros (EUR) and include VAT where applicable. We reserve the right to correct pricing errors. An order is confirmed only when you receive an order confirmation from us. We may decline any order at our discretion.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">5. Payment</h2>
                <p>Payments are processed securely through our payment partner, NFC Group Payment, via the Nyehandel commerce platform. We do not store your payment card details. All transactions are encrypted and handled by PCI-compliant processors.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">6. Shipping and delivery</h2>
                <p>Orders are fulfilled by Nylogistik and shipped via UPS. Standard delivery takes 3-5 business days. Orders over €29 qualify for free shipping. We ship to the UK and most EU countries. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">7. Right of withdrawal (EU consumers)</h2>
                <p>Under EU consumer law, you have the right to withdraw from your purchase within 14 days of receiving your order, without giving a reason. To exercise this right, email <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a> with your order ID and a clear statement of your decision to withdraw. Products must be returned unopened and in their original packaging. We will refund the purchase price within 14 days of receiving the returned goods. Return shipping costs for change-of-mind returns are borne by the buyer.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">8. Refunds</h2>
                <p>Refunds are processed to your original payment method within 5-7 business days after we receive and inspect the returned items. If a product is faulty, damaged, or incorrect, we cover the return shipping cost and will issue a full refund or replacement at your choice.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">9. Limitation of liability</h2>
                <p>To the fullest extent permitted by law, SnusFriend shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or products purchased from us. Our total liability for any claim shall not exceed the amount you paid for the relevant order. Nothing in these terms limits our liability for death or personal injury caused by our negligence, or for fraud.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">10. Intellectual property</h2>
                <p>All content on this website — including text, graphics, logos, and software — is the property of SnusFriend or its licensors and is protected by applicable intellectual property laws. You may not reproduce or redistribute any content without our written permission.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">11. Governing law</h2>
                <p>These terms are governed by and construed in accordance with the laws of the European Union and the applicable member state where SnusFriend is established. Any disputes shall be submitted to the competent courts of that jurisdiction. EU consumers retain the right to bring proceedings in their country of residence.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">12. Changes to these terms</h2>
                <p>We may update these terms from time to time. The updated version will be posted on this page with a revised "last updated" date. Continued use of the site after changes constitutes acceptance of the new terms.</p>
              </>} />} />
              <Route path="/privacy" element={<InfoPage title="Privacy Policy" legalWarning content={<>
                <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800 mb-6 font-medium">
                  DRAFT — This document is pending legal review. Content may change before launch.
                </div>

                <p><strong className="text-foreground">Last updated:</strong> 25 March 2026</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">1. Data controller</h2>
                <p>SnusFriend ("we", "us") is the data controller for personal data collected through <a href="https://snusfriends.com" className="text-primary hover:underline">snusfriends.com</a>. For any data protection queries, contact us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">2. What data we collect</h2>
                <p>We collect the following personal data when you use our site:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Account data:</strong> name, email address, and hashed password when you create an account</li>
                  <li><strong className="text-foreground">Order data:</strong> delivery address, phone number, order history, and payment transaction references</li>
                  <li><strong className="text-foreground">Engagement data:</strong> wishlist items, SnusPoints balance, spin wheel activity, and newsletter subscription status</li>
                  <li><strong className="text-foreground">Technical data:</strong> IP address, browser type, and device information collected automatically via server logs</li>
                </ul>

                <h2 className="text-foreground font-semibold text-lg mt-6">3. Legal basis for processing (GDPR Art. 6)</h2>
                <p>We process your personal data on the following legal bases:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Contract performance:</strong> processing your orders, managing your account, and providing customer support</li>
                  <li><strong className="text-foreground">Consent:</strong> sending marketing emails and newsletters (you can withdraw consent at any time)</li>
                  <li><strong className="text-foreground">Legitimate interest:</strong> fraud prevention, site security, and improving our services</li>
                  <li><strong className="text-foreground">Legal obligation:</strong> retaining order records as required by tax and consumer protection law</li>
                </ul>

                <h2 className="text-foreground font-semibold text-lg mt-6">4. Data processors and sharing</h2>
                <p>We share your data with the following third-party processors, solely for the purposes described:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Supabase:</strong> database hosting, authentication, and serverless functions (data stored in EU region)</li>
                  <li><strong className="text-foreground">Nyehandel / NFC Group:</strong> order processing and payment handling</li>
                  <li><strong className="text-foreground">Nylogistik / UPS:</strong> order fulfilment and delivery</li>
                  <li><strong className="text-foreground">Vercel:</strong> website hosting and content delivery</li>
                </ul>
                <p>We do not sell your personal data to any third party. We do not share your data with advertisers.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">5. Cookies</h2>
                <p>We use a limited number of cookies that are necessary for the site to function. For full details, see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">6. Data retention</h2>
                <p>We retain your account data for as long as your account is active. Order records are retained for 7 years to comply with tax obligations. If you delete your account, we remove your personal data within 30 days, except where retention is required by law.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">7. Your rights (GDPR)</h2>
                <p>As an EU/UK resident, you have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Right of access:</strong> request a copy of the personal data we hold about you</li>
                  <li><strong className="text-foreground">Right to rectification:</strong> request correction of inaccurate data</li>
                  <li><strong className="text-foreground">Right to erasure:</strong> request deletion of your data ("right to be forgotten")</li>
                  <li><strong className="text-foreground">Right to data portability:</strong> receive your data in a structured, machine-readable format</li>
                  <li><strong className="text-foreground">Right to restrict processing:</strong> request that we limit how we use your data</li>
                  <li><strong className="text-foreground">Right to object:</strong> object to processing based on legitimate interest</li>
                  <li><strong className="text-foreground">Right to withdraw consent:</strong> withdraw consent for marketing at any time</li>
                </ul>
                <p>To exercise any of these rights, email <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>. We will respond within 30 days.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">8. Data security</h2>
                <p>We use industry-standard measures to protect your data, including encrypted connections (TLS), hashed passwords, row-level security on our database, and access controls on all backend systems. No method of transmission over the internet is 100% secure, but we take reasonable steps to protect your information.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">9. Children's privacy</h2>
                <p>Our site is not intended for anyone under 18. We do not knowingly collect data from minors. If we learn that we have collected data from someone under 18, we will delete it promptly.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">10. Complaints</h2>
                <p>If you believe we have not handled your data correctly, you have the right to lodge a complaint with your local data protection authority (supervisory authority) under GDPR Art. 77.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">11. Changes to this policy</h2>
                <p>We may update this policy from time to time. Changes will be posted on this page with a revised "last updated" date.</p>
              </>} />} />
              <Route path="/cookies" element={<InfoPage title="Cookie Policy" legalWarning content={<>
                <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800 mb-6 font-medium">
                  DRAFT — This document is pending legal review. Content may change before launch.
                </div>

                <p><strong className="text-foreground">Last updated:</strong> 25 March 2026</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">1. What are cookies?</h2>
                <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and provide essential functionality. This policy explains what cookies snusfriends.com uses and why.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">2. Cookies we use</h2>

                <h3 className="text-foreground font-semibold mt-4">Strictly necessary cookies</h3>
                <p>These cookies are essential for the website to function. They cannot be disabled.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Session / authentication:</strong> Supabase auth tokens stored in localStorage — keeps you logged in across pages and browser sessions</li>
                  <li><strong className="text-foreground">Age verification:</strong> records that you have confirmed you are 18+ so you are not asked again during the same session</li>
                  <li><strong className="text-foreground">Cart data:</strong> stores the contents of your shopping cart in localStorage so items persist between page loads</li>
                  <li><strong className="text-foreground">Cookie consent:</strong> records your cookie consent preference so the banner is not shown repeatedly</li>
                  <li><strong className="text-foreground">Theme preference:</strong> stores your selected display theme (localStorage)</li>
                </ul>

                <h3 className="text-foreground font-semibold mt-4">Analytics cookies</h3>
                <p>We do not currently use any analytics or tracking cookies. If we add analytics in the future, we will update this policy and request your consent before setting any analytics cookies.</p>

                <h3 className="text-foreground font-semibold mt-4">Third-party cookies</h3>
                <p>We do not embed third-party advertising or social media tracking on our site. The only third-party service that may set cookies is Supabase (our authentication and database provider), which is used solely for account authentication and is classified as strictly necessary.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">3. localStorage and sessionStorage</h2>
                <p>In addition to traditional cookies, we use browser storage (localStorage) for cart data, wishlist items, authentication tokens, and display preferences. These are treated with the same care as cookies and are covered by this policy.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">4. How to manage cookies</h2>
                <p>You can manage or delete cookies through your browser settings. Most browsers allow you to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>View and delete individual cookies</li>
                  <li>Block cookies from specific or all websites</li>
                  <li>Set preferences for first-party vs. third-party cookies</li>
                  <li>Clear all cookies when you close the browser</li>
                </ul>
                <p>Please note that blocking strictly necessary cookies may prevent the website from functioning correctly — you may not be able to log in, maintain a cart, or complete purchases.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">5. Consent</h2>
                <p>When you first visit our site, a cookie consent banner is displayed. You can accept or decline non-essential cookies. Since we currently only use strictly necessary cookies, the site functions fully regardless of your choice. If we add optional cookies in the future, they will only be set after you give explicit consent.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">6. Changes to this policy</h2>
                <p>We may update this cookie policy if we introduce new cookies or change how we use existing ones. Changes will be posted on this page with a revised "last updated" date.</p>

                <h2 className="text-foreground font-semibold text-lg mt-6">7. Contact</h2>
                <p>If you have questions about our use of cookies, email us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.</p>
              </>} />} />

              <Route path="/ops/login" element={<Suspense><OpsLogin /></Suspense>} />
              <Route path="/ops" element={<Suspense><OpsAuthGuard><OpsDashboard /></OpsAuthGuard></Suspense>} />
              <Route path="/ops/webhooks" element={<Suspense><OpsAuthGuard><WebhookInbox /></OpsAuthGuard></Suspense>} />
              <Route path="/ops/sync" element={<Suspense><OpsAuthGuard><SyncStatus /></OpsAuthGuard></Suspense>} />
              <Route path="/ops/mappings" element={<Suspense><OpsAuthGuard><SkuMappings /></OpsAuthGuard></Suspense>} />
              <Route path="/ops/users" element={<Suspense><OpsAuthGuard><OpsUsers /></OpsAuthGuard></Suspense>} />

              <Route path="/mappings" element={<Navigate to="/ops/mappings" replace />} />

              <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
              <CookieConsent />
              <BackToTop />
              <InstallPrompt />
              </BrowserRouter>
            </CookieConsentProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
    </HelmetProvider>
    </ErrorBoundary>
    </AgeGate>
  );
};

export default App;
