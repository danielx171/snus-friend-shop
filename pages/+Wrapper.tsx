// pages/+Wrapper.tsx
export { Wrapper }

import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CartProvider } from "@/context/CartContext"
import { LanguageProvider } from "@/context/LanguageContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { CookieConsentProvider } from "@/components/cookie-consent/CookieConsentProvider"
import { WishlistProvider } from "@/context/WishlistContext"
import { EasterProvider } from "@/context/EasterContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { AgeGate } from "@/components/compliance/AgeGate"
import { hasSupabaseEnv, missingSupabaseEnvVars } from "@/integrations/supabase/client"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry on client errors (4xx). Retrying auth failures or missing
      // resources wastes requests and delays showing the real error to the user.
      retry: (failureCount, error) => {
        if (error instanceof Error && /^apiFetch .+: [45]\d\d$/.test(error.message)) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

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
)

function Wrapper({ children }: { children: React.ReactNode }) {
  if (!hasSupabaseEnv) return <MissingApiKeysScreen />

  return (
    <AgeGate>
    <ErrorBoundary>
    <EasterProvider>
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
            <CookieConsentProvider>
              <Toaster />
              <Sonner />
              {children}
            </CookieConsentProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
    </EasterProvider>
    </ErrorBoundary>
    </AgeGate>
  )
}
