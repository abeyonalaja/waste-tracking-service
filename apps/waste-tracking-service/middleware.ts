import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      return !!token;
    },
  },
});

export const config = { matcher: ['/exportREMOVE-THIS-AFTER-DCID/:path*'] };
