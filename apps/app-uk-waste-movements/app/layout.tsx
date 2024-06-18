import React from 'react';
import AppInsightsProvider from './providers/AppInsightsProvider';
import SessionProvider from './providers/SessionProvider';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: LayoutProps): Promise<JSX.Element> {
  const connectionString = process.env['APPINSIGHTS_CONNECTION_STRING'];
  const session = await getServerSession(options);

  return (
    <AppInsightsProvider connectionString={connectionString!}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </AppInsightsProvider>
  );
}
