import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes('%3F')) {
    return NextResponse.redirect(
      new URL(req.nextUrl.pathname.replace('%3F', '?'), req.url),
    );
  }
}

export const config = {
  matcher: ['/:path*'],
};
