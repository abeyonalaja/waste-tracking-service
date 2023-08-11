import NextAuth, { NextAuthOptions, Profile } from 'next-auth';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';

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
      clientId: process.env.DCID_CLIENTID,
      clientSecret: process.env.DCID_CLIENTSECRET,
      tenantId: process.env.DCID_TENANT,
      primaryUserFlow: process.env.DCID_POLICY,
      wellKnown: process.env.DCID_WELLKNOWN,
      authorization: {
        params: {
          scope: 'openid offline_access profile',
          serviceId: process.env.DCID_SERVICEID,
          redirect_uri: process.env.DCID_REDIRECT,
        },
      },
      idToken: true,
      checks: ['pkce', 'state'],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.firstName,
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
  debug: true,
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        const dcidProfile = profile as DCIDProfile;
        token.id = dcidProfile.sub;
        token.name = `${dcidProfile.firstName} ${dcidProfile.lastName}`;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          name: token.name,
          email: token.email,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
