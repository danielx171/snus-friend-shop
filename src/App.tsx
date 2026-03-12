import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "next-themes";
import HomePage from "./pages/HomePage";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutHandoff from "./pages/CheckoutHandoff";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import OrderConfirmation from "./pages/OrderConfirmation";
import BrandHub from "./pages/BrandHub";
import BrandsIndex from "./pages/BrandsIndex";
import OpsAuthGuard from "./components/auth/OpsAuthGuard";
import OpsLogin from "./pages/ops/OpsLogin";
import OpsDashboard from "./pages/ops/OpsDashboard";
import WebhookInbox from "./pages/ops/WebhookInbox";
import SyncStatus from "./pages/ops/SyncStatus";
import SkuMappings from "./pages/ops/SkuMappings";
import OpsUsers from "./pages/ops/OpsUsers";
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

const App = () => (
  !hasSupabaseEnv ? <MissingApiKeysScreen /> :
  <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
    themes={['dark', 'light', 'editorial']}
  >
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/produkter" element={<ProductListing />} />
              <Route path="/nicotine-pouches" element={<ProductListing />} />
              <Route path="/produkt/:id" element={<ProductDetail />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutHandoff />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot" element={<ForgotPasswordPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/brands" element={<BrandsIndex />} />
              <Route path="/brand/:brandSlug" element={<BrandHub />} />
              <Route path="/ops/login" element={<OpsLogin />} />
              <Route path="/ops" element={<OpsAuthGuard><OpsDashboard /></OpsAuthGuard>} />
              <Route path="/ops/webhooks" element={<OpsAuthGuard><WebhookInbox /></OpsAuthGuard>} />
              <Route path="/ops/sync" element={<OpsAuthGuard><SyncStatus /></OpsAuthGuard>} />
              <Route path="/ops/mappings" element={<OpsAuthGuard><SkuMappings /></OpsAuthGuard>} />
              <Route path="/ops/users" element={<OpsAuthGuard><OpsUsers /></OpsAuthGuard>} />

              <Route path="/mappings" element={<Navigate to="/ops/mappings" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
