// src/config/tenant.ts
export interface TenantConfig {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly domain: string;
  readonly supportEmail: string;
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
    readonly defaultTheme: 'velo' | 'light' | 'editorial' | 'forest' | 'copper';
  };
  readonly features: {
    readonly loyaltyProgram: boolean;
    readonly communityHub: boolean;
    readonly reviews: boolean;
    readonly quests: boolean;
    readonly ageGate: boolean;
    readonly flavorQuiz: boolean;
    readonly bundleBuilder: boolean;
    readonly easterEgg: boolean;
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
    readonly easterKey: string;
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
  loyaltyProgramName: 'SnusFriends Rewards',
  currencyCode: 'EUR',
  theme: {
    primary: '174 90% 50%',
    accent: '174 90% 50%',
    background: '220 16% 8%',
    foreground: '210 20% 95%',
    card: '220 14% 13%',
    border: '220 12% 22%',
    fontFamily: 'Inter',
    borderRadius: '0.5rem',
    darkModeClass: 'velo',
    lightModeClass: 'light',
    defaultTheme: 'velo',
  },
  features: {
    loyaltyProgram: true,
    communityHub: true,
    reviews: true,
    quests: true,
    ageGate: true,
    flavorQuiz: true,
    bundleBuilder: true,
    easterEgg: true,
  },
  seo: {
    titleTemplate: '%s | SnusFriend',
    defaultTitle: 'SnusFriend | Premium Nicotine Pouches',
    defaultDescription: 'Shop 700+ nicotine pouches from 91 leading brands. Fast EU-wide delivery, loyalty rewards, and the best prices online.',
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
    easterKey: 'sf_easter_mode',
    consentKey: 'cookie-consent',
    ageVerifiedKey: 'age_verified',
  },
  freeShippingThreshold: 29,
} as const satisfies TenantConfig;
