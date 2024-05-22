import React from 'react';
import AppInsightsProvider from './providers/AppInsightsProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: LayoutProps): Promise<JSX.Element> {
  const connectionString = process.env['APPINSIGHTS_CONNECTION_STRING'];

  return (
    <AppInsightsProvider connectionString={connectionString!}>
      {children}
    </AppInsightsProvider>
  );
}
