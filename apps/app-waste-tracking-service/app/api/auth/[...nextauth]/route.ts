import NextAuth, { Account } from 'next-auth';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';
import type { Profile, Session } from 'next-auth/core/types';
import { Jwt } from 'jsonwebtoken';

interface DCIDToken extends Jwt {
  refreshToken: string;
  idTokenExpires: number;
}

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

export interface DCIDSession extends Session {
  token?: string;
}

interface JWTCallbackProps {
  token: DCIDToken;
  account: DCIDAccount;
  profile: DCIDProfile;
}

interface SessionCallbackProps {
  session: DCIDSession;
  token: {
    id_token: string;
    name: string;
    email: string;
  };
}

const refreshAccessToken = async (token: DCIDToken) => {
  let tokenEndpoint;
  const fetchData = async () => {
    const response = await fetch(process.env.DCID_WELLKNOWN || '', {
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
      const refreshedToken = await response.json();
      return {
        ...token,
        id_token: refreshedToken.id_token,
        idTokenExpires: Date.now() + refreshedToken.id_token_expires_in * 1000,
        refreshToken: refreshedToken.refresh_token,
      };
    } catch (error) {
      console.error(error);
    }
  }
};

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
  callbacks: {
    async jwt({ token, account, profile }: JWTCallbackProps) {
      const twoMinLessThanExpiry =
        Number(token.idTokenExpires || 1200 * 1000) - 2 * 60 * 1000; // 20 - 2 = 18 minutes
      if (account && profile) {
        const dcidProfile = profile as DCIDProfile;
        const dcidAccount = account as DCIDAccount;
        return {
          name: `${dcidProfile.firstName} ${dcidProfile.lastName}`,
          email: dcidProfile.email,
          id_token: dcidAccount.id_token,
          idTokenExpires: Date.now() + dcidAccount.id_token_expires_in * 1000, // 20 minutes
          refreshToken: dcidAccount.refresh_token,
          uniqueReference: dcidProfile.uniqueReference,
        };
      } else if (Date.now() < twoMinLessThanExpiry) {
        return token;
      } else {
        return refreshAccessToken(token);
      }
    },
    async session({ session, token }: SessionCallbackProps) {
      const dcidSession = session as DCIDSession;
      return {
        ...dcidSession,
        token: token.id_token.toString() || null,
        user: {
          name: token.name,
          email: token.email,
        },
      };
    },
  },
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
