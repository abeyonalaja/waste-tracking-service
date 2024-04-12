import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from '@wts/ui/navigation';

export default createMiddleware({
  defaultLocale: 'en',
  localePrefix,
  locales,
});

export const config = {
  matcher: [
    '/',
    '/(cy|en)/:path*',
    '/((?!api|static|_vercel|.*\\..*|_next).*)',
  ],
};
