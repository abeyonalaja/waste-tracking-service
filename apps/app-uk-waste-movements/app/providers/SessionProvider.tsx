'use client';

import { SessionProvider as AuthSessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

export default function SessionProvider({
  session,
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}): JSX.Element {
  return (
    <AuthSessionProvider session={session} refetchInterval={60}>
      {children}
    </AuthSessionProvider>
  );
}
