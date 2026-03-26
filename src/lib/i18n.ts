import en from '@/i18n/en.json';

const translations: Record<string, Record<string, string>> = { en };

export function t(
  key: string,
  locale: string = 'en',
  params?: Record<string, string | number>,
): string {
  const dict = translations[locale] ?? translations.en;
  let text = dict[key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
