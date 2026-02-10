import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import HomePage from "./pages/HomePage";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";
import BrandHub from "./pages/BrandHub";
import BrandsIndex from "./pages/BrandsIndex";
import OpsDashboard from "./pages/ops/OpsDashboard";
import WebhookInbox from "./pages/ops/WebhookInbox";
import SyncStatus from "./pages/ops/SyncStatus";

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/brands" element={<BrandsIndex />} />
              <Route path="/brands" element={<BrandsIndex />} />
              <Route path="/brand/:brandSlug" element={<BrandHub />} />
              <Route path="/ops" element={<OpsDashboard />} />
              <Route path="/ops/webhooks" element={<WebhookInbox />} />
              <Route path="/ops/sync" element={<SyncStatus />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
