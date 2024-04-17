'use client';

import { SessionProvider as AuthSessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

export default function SessionProvider({
  session,
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
