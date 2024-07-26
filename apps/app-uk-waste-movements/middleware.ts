import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
});

export const config = {
  matcher: ['/((?!api|assets|_next/static|_next/image|favicon.ico).*)'],
};
