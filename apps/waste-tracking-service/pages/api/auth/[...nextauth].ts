import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';
import type { Profile } from 'next-auth/core/types';

interface DCIDProfile extends Profile {
  sup: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADB2CProvider({
      id: 'defra-b2c',
      clientId: process.env.DCID_CLIENT_ID,
      clientSecret: process.env.DCID_CLIENT_SECRET,
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
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const dcidProfile = profile as DCIDProfile;
        return {
          name: `${dcidProfile.firstName} ${dcidProfile.lastName}`,
          email: profile.email,
          id_token: account.id_token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          name: token.name,
          email: token.email,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
