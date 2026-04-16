export interface TenantConfig {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly domain: string;
  readonly storefrontHosts: readonly string[];
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
  readonly jurisdiction: string;
  readonly dpaName: string;
  readonly dpaUrl: string;
  readonly founderName: string;
  readonly defaultAuthor: {
    readonly name: string;
    readonly jobTitle: string;
    readonly bio: string;
    readonly sameAs: readonly string[];
    readonly slug?: string;
    readonly credentials?: readonly string[];
  };
  readonly loyaltyProgramName: string;
  readonly loyaltyCurrencyName: string;
  readonly orderPrefix: string;
  readonly locale: string;
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
    readonly guestEmailKey: string;
    readonly wishlistKey: string;
    readonly compareKey: string;
    readonly beginnerKey: string;
    readonly historyKey: string;
    readonly buyNowKey: string;
    readonly themeKey: string;
    readonly languageKey: string;
    readonly consentKey: string;
    readonly ageVerifiedKey: string;
  };
  readonly freeShippingThreshold: number;
}

export type TenantEnv = Record<string, string | undefined | null>;

export interface TenantRuntime {
  readonly tenant: TenantConfig;
  readonly siteUrl: string;
  readonly siteOrigin: string;
  readonly siteHost: string;
  readonly storefrontHosts: readonly string[];
  readonly storefrontOrigins: readonly string[];
  readonly siteName: string;
  readonly supportEmail: string;
  readonly emailFromAddress: string;
  readonly emailFromName: string;
}

export const DEFAULT_TENANT_ID = 'snusfriends';

const defaultTenant: TenantConfig = {
  id: 'snusfriends',
  name: 'SnusFriend',
  tagline: 'Premium Nicotine Pouches',
  domain: 'snusfriends.com',
  storefrontHosts: ['snusfriends.com', 'www.snusfriends.com'],
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
  jurisdiction: 'Sweden',
  dpaName: 'Swedish Authority for Privacy Protection (IMY)',
  dpaUrl: 'https://www.imy.se',
  founderName: 'Daniel',
  defaultAuthor: {
    name: 'Erik Lindqvist',
    jobTitle: 'Editor & Lead Product Reviewer',
    bio: 'Editor and lead product reviewer covering European nicotine pouch products with a public-health communication background and a transparent, evidence-led testing process.',
    sameAs: [
      'https://www.linkedin.com/in/erik-lindqvist-snusfriend/',
      'https://x.com/ErikAtSnusFriend',
    ],
    slug: 'erik-lindqvist',
    credentials: [
      "Master's in Public Health Communication, Uppsala University",
      '4+ years covering the European nicotine pouch market',
      '500+ products personally tested',
    ],
  },
  loyaltyProgramName: 'SnusFriends Rewards',
  loyaltyCurrencyName: 'SnusCoins',
  orderPrefix: 'NB',
  locale: 'en-gb',
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
    guestEmailKey: 'snusfriend_guest_email',
    wishlistKey: 'snusfriend_wishlist',
    compareKey: 'snusfriend_compare',
    beginnerKey: 'snusfriend_beginner',
    historyKey: 'snusfriend_history',
    buyNowKey: 'snusfriend_buynow',
    themeKey: 'theme',
    languageKey: 'snusfriend-language',
    consentKey: 'cookie-consent',
    ageVerifiedKey: 'age_verified',
  },
  freeShippingThreshold: 29,
} as const satisfies TenantConfig;

export const tenantRegistry: Record<string, TenantConfig> = {
  [DEFAULT_TENANT_ID]: defaultTenant,
};

const SITE_URL_KEYS = ['SITE_URL', 'PUBLIC_SITE_URL', 'VITE_SITE_URL'];
const TENANT_ID_KEYS = ['TENANT_ID', 'PUBLIC_TENANT_ID', 'VITE_TENANT_ID'];
const SITE_NAME_KEYS = ['SITE_NAME', 'PUBLIC_SITE_NAME', 'VITE_SITE_NAME'];
const SUPPORT_EMAIL_KEYS = ['SUPPORT_EMAIL', 'PUBLIC_SUPPORT_EMAIL', 'VITE_SUPPORT_EMAIL'];
const STOREFRONT_HOST_KEYS = ['STOREFRONT_HOSTS', 'PUBLIC_STOREFRONT_HOSTS', 'VITE_STOREFRONT_HOSTS'];
const STORAGE_PREFIX_KEYS = [
  'TENANT_STORAGE_PREFIX',
  'PUBLIC_TENANT_STORAGE_PREFIX',
  'VITE_TENANT_STORAGE_PREFIX',
];

const readEnv = (env: TenantEnv, keys: readonly string[]): string | undefined => {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
};

const parseList = (value?: string | null): string[] =>
  (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

export const normalizeSiteUrl = (value?: string | null): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, '');
  }

  return `https://${trimmed.replace(/\/$/, '')}`;
};

const safeHostFromUrl = (value?: string | null): string | null => {
  const normalized = normalizeSiteUrl(value);
  if (!normalized) {
    return null;
  }

  try {
    return new URL(normalized).hostname;
  } catch {
    return null;
  }
};

const hostsFromOrigins = (origins: readonly string[]): string[] =>
  origins
    .map((origin) => safeHostFromUrl(origin))
    .filter((host): host is string => Boolean(host));

const unique = (values: readonly string[]): string[] => Array.from(new Set(values.filter(Boolean)));

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const replaceBrandTokens = (
  value: string,
  baseTenant: TenantConfig,
  nextName: string,
  nextDomain: string,
): string =>
  value
    .replaceAll(baseTenant.name, nextName)
    .replaceAll(baseTenant.domain, nextDomain)
    .replaceAll('SnusFriends', nextName);

const inferTenantIdFromUrl = (value?: string | null): string | null => {
  const host = safeHostFromUrl(value);
  if (!host) {
    return null;
  }

  for (const [tenantId, config] of Object.entries(tenantRegistry)) {
    if ([config.domain, ...config.storefrontHosts].includes(host)) {
      return tenantId;
    }
  }

  return null;
};

const buildStorageConfig = (
  baseTenant: TenantConfig,
  tenantId: string,
  env: TenantEnv,
  siteName: string,
  domain: string,
): TenantConfig['storage'] => {
  const explicitPrefix = readEnv(env, STORAGE_PREFIX_KEYS);
  const shouldKeepBaseKeys =
    tenantId === baseTenant.id &&
    siteName === baseTenant.name &&
    domain === baseTenant.domain &&
    !explicitPrefix;

  if (shouldKeepBaseKeys) {
    return baseTenant.storage;
  }

  const prefix = explicitPrefix ?? slugify(tenantId || siteName || domain);

  return {
    cartKey: `${prefix}_cart`,
    guestEmailKey: `${prefix}_guest_email`,
    wishlistKey: `${prefix}_wishlist`,
    compareKey: `${prefix}_compare`,
    beginnerKey: `${prefix}_beginner`,
    historyKey: `${prefix}_history`,
    buyNowKey: `${prefix}_buynow`,
    themeKey: `${prefix}-theme`,
    languageKey: `${prefix}-language`,
    consentKey: `${prefix}-cookie-consent`,
    ageVerifiedKey: `${prefix}-age-verified`,
  };
};

export function resolveTenantRuntime(env: TenantEnv = {}): TenantRuntime {
  const explicitTenantId = readEnv(env, TENANT_ID_KEYS);
  const configuredSiteUrl = normalizeSiteUrl(readEnv(env, SITE_URL_KEYS));
  const inferredTenantId = inferTenantIdFromUrl(configuredSiteUrl);
  const tenantId = explicitTenantId ?? inferredTenantId ?? DEFAULT_TENANT_ID;
  const registryTenant = tenantRegistry[tenantId];
  const baseTenant = registryTenant ?? tenantRegistry[DEFAULT_TENANT_ID];

  if (explicitTenantId && !tenantRegistry[explicitTenantId] && !configuredSiteUrl) {
    throw new Error(
      `Unknown TENANT_ID "${explicitTenantId}". Add it to tenantRegistry or provide SITE_URL so the deployment can resolve its host safely.`,
    );
  }

  const siteUrl = configuredSiteUrl ?? `https://${baseTenant.domain}`;
  const siteOrigin = new URL(siteUrl).origin;
  const siteHost = new URL(siteUrl).hostname;
  const domain = safeHostFromUrl(readEnv(env, ['SITE_DOMAIN'])) ?? siteHost ?? baseTenant.domain;
  const siteName = readEnv(env, SITE_NAME_KEYS) ?? baseTenant.name;
  const supportEmail =
    readEnv(env, SUPPORT_EMAIL_KEYS) ??
    baseTenant.supportEmail.replace(baseTenant.domain, domain);
  const emailFromAddress =
    readEnv(env, ['EMAIL_FROM_ADDRESS'])?.trim() || `noreply@${domain}`;
  const emailFromName =
    readEnv(env, ['EMAIL_FROM_NAME'])?.trim() || siteName;
  const allowedOriginHosts = hostsFromOrigins(parseList(readEnv(env, ['ALLOWED_ORIGINS'])));
  const legacyOriginHosts = hostsFromOrigins([readEnv(env, ['ALLOWED_ORIGIN']) ?? '']);
  const envStorefrontHosts = parseList(readEnv(env, STOREFRONT_HOST_KEYS));

  const storefrontHosts = unique([
    siteHost,
    domain,
    ...envStorefrontHosts,
    ...allowedOriginHosts,
    ...legacyOriginHosts,
    ...(registryTenant?.storefrontHosts ?? []),
  ]);
  const storefrontOrigins = storefrontHosts.map((host) => `https://${host}`);

  const tenant: TenantConfig = {
    ...baseTenant,
    id: tenantId,
    name: siteName,
    tagline: readEnv(env, ['SITE_TAGLINE']) ?? baseTenant.tagline,
    domain,
    storefrontHosts,
    supportEmail,
    legalName: readEnv(env, ['LEGAL_NAME']) ?? baseTenant.legalName,
    jurisdiction: readEnv(env, ['JURISDICTION']) ?? baseTenant.jurisdiction,
    dpaName: readEnv(env, ['DPA_NAME']) ?? baseTenant.dpaName,
    dpaUrl: readEnv(env, ['DPA_URL']) ?? baseTenant.dpaUrl,
    founderName: readEnv(env, ['FOUNDER_NAME']) ?? baseTenant.founderName,
    defaultAuthor: {
      name: readEnv(env, ['DEFAULT_AUTHOR_NAME']) ?? baseTenant.defaultAuthor.name,
      jobTitle:
        readEnv(env, ['DEFAULT_AUTHOR_JOB_TITLE']) ??
        baseTenant.defaultAuthor.jobTitle,
      bio: readEnv(env, ['DEFAULT_AUTHOR_BIO']) ?? baseTenant.defaultAuthor.bio,
      sameAs:
        parseList(readEnv(env, ['DEFAULT_AUTHOR_SAME_AS'])).length > 0
          ? parseList(readEnv(env, ['DEFAULT_AUTHOR_SAME_AS']))
          : [...baseTenant.defaultAuthor.sameAs],
      slug:
        readEnv(env, ['DEFAULT_AUTHOR_SLUG']) ?? baseTenant.defaultAuthor.slug,
      credentials:
        parseList(readEnv(env, ['DEFAULT_AUTHOR_CREDENTIALS'])).length > 0
          ? parseList(readEnv(env, ['DEFAULT_AUTHOR_CREDENTIALS']))
          : baseTenant.defaultAuthor.credentials
            ? [...baseTenant.defaultAuthor.credentials]
            : undefined,
    },
    loyaltyProgramName:
      readEnv(env, ['LOYALTY_PROGRAM_NAME']) ??
      (registryTenant ? baseTenant.loyaltyProgramName : `${siteName} Rewards`),
    loyaltyCurrencyName:
      readEnv(env, ['LOYALTY_CURRENCY_NAME']) ?? baseTenant.loyaltyCurrencyName,
    orderPrefix:
      readEnv(env, ['ORDER_PREFIX']) ?? baseTenant.orderPrefix,
    locale:
      readEnv(env, ['ORDER_LOCALE', 'LOCALE']) ?? baseTenant.locale,
    seo: {
      titleTemplate:
        readEnv(env, ['SEO_TITLE_TEMPLATE']) ?? `%s | ${siteName}`,
      defaultTitle:
        readEnv(env, ['SEO_DEFAULT_TITLE']) ??
        replaceBrandTokens(baseTenant.seo.defaultTitle, baseTenant, siteName, domain),
      defaultDescription:
        readEnv(env, ['SEO_DEFAULT_DESCRIPTION']) ??
        replaceBrandTokens(baseTenant.seo.defaultDescription, baseTenant, siteName, domain),
      ogImage: readEnv(env, ['SEO_OG_IMAGE']) ?? baseTenant.seo.ogImage,
    },
    assets: {
      logo: readEnv(env, ['SITE_LOGO_PATH']) ?? baseTenant.assets.logo,
      logoDark:
        readEnv(env, ['SITE_LOGO_DARK_PATH']) ?? baseTenant.assets.logoDark,
      favicon: readEnv(env, ['SITE_FAVICON_PATH']) ?? baseTenant.assets.favicon,
    },
    storage: buildStorageConfig(baseTenant, tenantId, env, siteName, domain),
  };

  return {
    tenant,
    siteUrl,
    siteOrigin,
    siteHost,
    storefrontHosts,
    storefrontOrigins,
    siteName,
    supportEmail,
    emailFromAddress,
    emailFromName,
  };
}

/** All valid theme class names — derived from the TenantConfig type. */
export const validThemes: TenantConfig['theme']['defaultTheme'][] = ['forest', 'copper'];

const importMetaEnv =
  ((import.meta as { env?: TenantEnv }).env ?? {}) as TenantEnv;

export const tenantRuntime = resolveTenantRuntime(importMetaEnv);
export const tenant = tenantRuntime.tenant;
