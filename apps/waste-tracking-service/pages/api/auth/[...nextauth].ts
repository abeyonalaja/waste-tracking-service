import NextAuth, { Account, NextAuthOptions } from 'next-auth';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';
import type { Profile } from 'next-auth/core/types';

interface DCIDProfile extends Profile {
  sup: string;
  firstName: string;
  lastName: string;
  email: string;
  uniqueReference: string;
}

interface DCIDAccount extends Account {
  id_token_expires_in: number;
}

const refreshAccessToken = async (token) => {
  let tokenEndpoint;
  const fetchData = async () => {
    const response = await fetch(process.env.DCID_WELLKNOWN, {
      cache: 'force-cache',
      method: 'get',
    });
    const dcidConfig = await response.json();
    tokenEndpoint = dcidConfig.token_endpoint;
  };
  await fetchData();
  if (tokenEndpoint) {
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:
          `grant_type=refresh_token` +
          `&client_secret=${process.env.DCID_CLIENT_SECRET}` +
          `&redirect_uri=${process.env.DCID_REDIRECT}` +
          `&refresh_token=${token.refreshToken as string}` +
          `&client_id=${process.env.DCID_CLIENT_ID}`,
      });
      const refreshedTokens = await response.json();
      return {
        ...token,
        id_token: refreshedTokens.id_token,
        idTokenExpires: Date.now() + refreshedTokens.id_token_expires_in * 1000,
        refreshToken: refreshedTokens.refresh_token,
      };
    } catch (error) {
      console.error(error);
    }
  }
};

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
    maxAge: 60 * 15, // 15 minutes
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      const oneMinLessThanExpiry =
        Number(token.idTokenExpires || 1200 * 1000) - 60 * 1000; // ~19 minutes
      if (account && profile) {
        const dcidProfile = profile as DCIDProfile;
        const dcidAccount = account as DCIDAccount;
        return {
          name: `${dcidProfile.firstName} ${dcidProfile.lastName}`,
          email: dcidProfile.email,
          id_token: dcidAccount.id_token,
          idTokenExpires: Date.now() + dcidAccount.id_token_expires_in * 1000, // ~20 minutes
          refreshToken: dcidAccount.refresh_token,
          uniqueReference: dcidProfile.uniqueReference,
        };
      } else if (Date.now() < oneMinLessThanExpiry) {
        return token;
      } else {
        return refreshAccessToken(token);
      }
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
