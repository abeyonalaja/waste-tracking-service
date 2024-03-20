import createMiddleware from 'next-intl/middleware';

import { locales, localePrefix } from './navigation';

export default createMiddleware({
  defaultLocale: 'en',
  localePrefix,
  locales,
});

export const config = {
  matcher: ['/', '/(cy|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
