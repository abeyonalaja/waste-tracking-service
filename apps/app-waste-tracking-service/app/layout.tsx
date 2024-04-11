import React from 'react';
import * as GovUK from 'govuk-react-ui';
import './main.scss';
import { getServerSession } from 'next-auth';
import SessionProvider from './providers/SessionProvider';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: LayoutProps) {
  const session = await getServerSession();
  return (
    <SessionProvider session={session}>
      <html lang={locale} className={'govuk-template'}>
        <body className={'govuk-template__body'}>
          <GovUK.SkipLink />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
