// src/config/tenant.ts
export interface TenantConfig {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly domain: string;
  readonly supportEmail: string;
  readonly legalName: string;
  readonly address: {
    readonly streetAddress: string;
    readonly addressLocality: string;
    readonly postalCode: string;
    readonly addressCountry: string;
  };
  readonly social: {
    readonly instagram: string;
    readonly tiktok: string;
    readonly x: string;
    readonly linkedin?: string;
    readonly facebook?: string;
    readonly youtube?: string;
  };
  /** Trust signals surfaced in Organization schema and footer (fill when you have values). */
  readonly trust: {
    /** Swedish company registration number — e.g. "556123-4567". */
    readonly corporateRegistration?: string;
    /** EU VAT ID — e.g. "SE556123456701". */
    readonly vatId?: string;
    /** Trustpilot profile URL — becomes another sameAs when present. */
    readonly trustpilotUrl?: string;
    /** Trustpilot Business Unit ID (from Trustpilot dashboard → Settings). Enables footer widget. */
    readonly trustpilotBusinessUnitId?: string;
    /** Trustpilot TrustBox template ID for the footer variant. Recommended: "Micro Combo" = "5419b6ffb0d04a076446a9af". */
    readonly trustpilotFooterTemplateId?: string;
    /** Year founded — ISO 8601. */
    readonly foundingDate?: string;
  };
  readonly loyaltyProgramName: string;
  readonly currencyCode: string;
  readonly theme: {
    readonly primary: string;
    readonly accent: string;
    readonly background: string;
    readonly foreground: string;
    readonly card: string;
    readonly border: string;
    readonly fontFamily: string;
    readonly borderRadius: string;
    readonly darkModeClass: string;
    readonly lightModeClass: string;
    readonly defaultTheme: 'forest' | 'copper';
  };
  readonly features: {
    readonly loyaltyProgram: boolean;
    readonly communityHub: boolean;
    readonly reviews: boolean;
    readonly quests: boolean;
    readonly ageGate: boolean;
    readonly flavorQuiz: boolean;
    readonly bundleBuilder: boolean;
  };
  readonly seo: {
    readonly titleTemplate: string;
    readonly defaultTitle: string;
    readonly defaultDescription: string;
    readonly ogImage: string;
  };
  readonly assets: {
    readonly logo: string;
    readonly logoDark: string;
    readonly favicon: string;
  };
  readonly storage: {
    readonly cartKey: string;
    readonly wishlistKey: string;
    readonly themeKey: string;
    readonly languageKey: string;
    readonly consentKey: string;
    readonly ageVerifiedKey: string;
  };
  readonly freeShippingThreshold: number;
}

export const tenant: TenantConfig = {
  id: 'snusfriends',
  name: 'SnusFriend',
  tagline: 'Premium Nicotine Pouches',
  domain: 'snusfriends.com',
  supportEmail: 'support@snusfriends.com',
  legalName: 'Nordic Express AB',
  address: {
    streetAddress: 'Akimsverkstadsväg 1',
    addressLocality: 'Göteborg',
    postalCode: '426 21',
    addressCountry: 'SE',
  },
  social: {
    instagram: 'https://www.instagram.com/snusfriends/',
    tiktok: 'https://www.tiktok.com/@snusfriends',
    x: 'https://x.com/snusfriends',
    // Fill when accounts are live:
    // linkedin: 'https://www.linkedin.com/company/snusfriends',
    // facebook: 'https://www.facebook.com/snusfriends',
    // youtube: 'https://www.youtube.com/@snusfriends',
  },
  trust: {
    foundingDate: '2024',
    // Fill from company registration certificate:
    // corporateRegistration: '556XXX-XXXX',
    // vatId: 'SE556XXXXXXXX01',
    // trustpilotUrl: 'https://www.trustpilot.com/review/snusfriends.com',
    // Fill after creating Trustpilot Business account — both fields are required
    // for the footer widget to render. Widget auto-hides if either is missing.
    // trustpilotBusinessUnitId: '5f...',       // from Trustpilot dashboard
    // trustpilotFooterTemplateId: '5419b6ffb0d04a076446a9af', // Micro Combo
  },
  loyaltyProgramName: 'SnusFriends Rewards',
  currencyCode: 'EUR',
  theme: {
    primary: '153 55% 18%',
    accent: '140 15% 90%',
    background: '40 20% 97%',
    foreground: '150 20% 10%',
    card: '0 0% 100%',
    border: '140 10% 86%',
    fontFamily: 'Inter',
    borderRadius: '0.5rem',
    darkModeClass: 'forest',
    lightModeClass: 'light',
    defaultTheme: 'forest',
  },
  features: {
    loyaltyProgram: true,
    communityHub: true,
    reviews: true,
    quests: true,
    ageGate: true,
    flavorQuiz: true,
    bundleBuilder: true,
  },
  seo: {
    titleTemplate: '%s | SnusFriend',
    defaultTitle: 'SnusFriend | Premium Nicotine Pouches',
    defaultDescription: 'Shop premium nicotine pouches from top European brands. Fast EU-wide delivery, loyalty rewards, and the best prices online.',
    ogImage: '/og-default.png',
  },
  assets: {
    logo: '/images/logo.svg',
    logoDark: '/images/logo-dark.svg',
    favicon: '/favicon.png',
  },
  storage: {
    cartKey: 'snusfriend_cart',
    wishlistKey: 'snusfriend_wishlist',
    themeKey: 'theme',
    languageKey: 'snusfriend-language',
    consentKey: 'cookie-consent',
    ageVerifiedKey: 'age_verified',
  },
  freeShippingThreshold: 29,
} as const satisfies TenantConfig;

/** All valid theme class names — derived from the TenantConfig type. */
export const validThemes: TenantConfig['theme']['defaultTheme'][] = ['forest', 'copper'];
