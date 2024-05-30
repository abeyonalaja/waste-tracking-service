import { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from '@wts/ui/navigation';

const publicPages = ['/auth/signin'];

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'en',
});

const authMiddleware = withAuth((req) => intlMiddleware(req), {
  callbacks: {
    authorized: ({ token }) => token != null,
  },
  pages: {
    signIn: '/auth/signin',
  },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function middleware(req: NextRequest): any {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages.join('|')})/?$`,
    'i',
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/', '/(cy|en)/:path*', '/((?!api|_next|.*\\..*).*)'],
};
