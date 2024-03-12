import NextAuth from 'next-auth';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';
const authOptions = {
  providers: [
    AzureADB2CProvider({
      id: 'defra-b2c',
      clientId: process.env.DCID_CLIENT_ID || '',
      clientSecret: process.env.DCID_CLIENT_SECRET || '',
      tenantId: process.env.DCID_TENANT,
      primaryUserFlow: process.env.DCID_POLICY,
      wellKnown: process.env.DCID_WELLKNOWN,
      authorization: {
        params: {
          scope: 'openid offline_access profile',
          serviceId: process.env.DCID_SERVICE_ID,
          redirect_uri: process.env.DCID_REDIRECT,
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.firstName} ${profile.lastName}`,
          email: profile.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: { maxAge: 60 * 60 * 24 * 30 },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
