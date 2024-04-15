import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';
import { refreshAccessToken } from './refreshAccessToken';
import { NextAuthOptions } from 'next-auth';

export const options: NextAuthOptions = {
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
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: { maxAge: 60 * 60 * 24 * 30 },
  callbacks: {
    async session({ session, token }) {
      session.token = token.id_token;
      return session;
    },
    async jwt({ token, account, profile }) {
      const twoMinLessThanExpiry =
        Number(token.idTokenExpires || 1200 * 1000) - 2 * 60 * 1000; // 20 - 2 = 18 minutes
      if (account && profile) {
        return {
          name: `${profile.firstName} ${profile.lastName}`,
          email: profile.email,
          id_token: account.id_token,
          idTokenExpires: Date.now() + account.id_token_expires_in * 1000, // 20 minutes
          refreshToken: account.refresh_token,
          uniqueReference: profile.uniqueReference,
        };
      } else if (Date.now() > twoMinLessThanExpiry) {
        return refreshAccessToken(token) || token;
      }
      return token;
    },
  },
};
