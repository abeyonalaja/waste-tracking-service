// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    token: string | null | undefined;
    companyName: string;
  }
  interface Profile {
    sup: string;
    firstName: string;
    lastName: string;
    email: string;
    uniqueReference: string;
    relationships: string[];
  }
  interface Account {
    id_token_expires_in: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id_token: string | null | undefined;
    refreshToken: string | null | undefined;
    idTokenExpires: number;
  }
}
