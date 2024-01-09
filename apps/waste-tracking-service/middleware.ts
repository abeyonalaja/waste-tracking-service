import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.includes('%3F')) {
      return NextResponse.redirect(
        new URL(req.nextUrl.pathname.replace('%3F', '?'), req.url)
      );
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/export/:path*'],
};
