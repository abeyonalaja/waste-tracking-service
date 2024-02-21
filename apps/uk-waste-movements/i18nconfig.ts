export type Locale = 'en' | 'cy';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'cy'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  cy: 'Welsh',
};
