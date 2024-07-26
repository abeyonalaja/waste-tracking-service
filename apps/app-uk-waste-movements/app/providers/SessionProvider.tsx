'use client';
import { SessionProvider as AuthSessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { useIdle } from '@uidotdev/usehooks';
import React from 'react';

interface IdleProps {
  children: React.ReactNode;
}

export default function SessionProvider({
  session,
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}): JSX.Element {
  return (
    <AuthSessionProvider session={session} refetchInterval={120}>
      <IdleWrapper>{children}</IdleWrapper>
    </AuthSessionProvider>
  );
}

const IdleWrapper = ({ children }: IdleProps) => {
  const idle = useIdle(1000 * 60 * 15);

  if (idle) {
    redirect('/auth/signout');
  }

  return children;
};
