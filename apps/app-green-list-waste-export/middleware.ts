import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest): NextResponse {
  const textUrl: string = req.nextUrl.pathname;
  let newUrl: string = textUrl.toString();
  let redirectRequired = false;

  if (newUrl.includes('%3F')) {
    newUrl = newUrl.replace('%3F', '?');
    redirectRequired = true;
  }

  if (newUrl.includes('/en/')) {
    newUrl = newUrl.replace('/en/', '/');
    redirectRequired = true;
  }

  if (newUrl.includes('/cy/')) {
    newUrl = newUrl.replace('/cy/', '/');
    redirectRequired = true;
  }

  if (redirectRequired) {
    return NextResponse.redirect(new URL(newUrl, req.url));
  }
}

export const config = {
  matcher: ['/:path*'],
};
