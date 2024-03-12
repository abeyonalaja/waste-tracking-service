'use client';
import React from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import './main.scss';
import { HeaderNavigation } from './components';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({
  children,
  params: { locale },
}: LayoutProps) {
  return (
    <SessionProvider>
      <html lang={locale} className={'govuk-template'}>
        <body className={'govuk-template__body'}>
          <GovUK.SkipLink />
          <GovUK.Header
            serviceNameLink={
              <Link
                href={'/'}
                className="govuk-header__link govuk-header__service-name"
              >
                Waste tracking service
              </Link>
            }
            navigation={<HeaderNavigation />}
          />
          <GovUK.WidthContainer>
            <GovUK.PhaseBanner tag={`Beta`}>
              {'This is a new service'}
            </GovUK.PhaseBanner>
          </GovUK.WidthContainer>
          <GovUK.WidthContainer>
            <GovUK.Main>{children}</GovUK.Main>
          </GovUK.WidthContainer>
          <GovUK.Footer
            footerLinks={[
              <Link
                href={'/help/accessibility'}
                className="govuk-footer__link"
                key={'footer-link-access'}
              >
                Accessibility
              </Link>,
              <Link
                href={'/help/cookies'}
                className="govuk-footer__link"
                key={'footer-link-cookies'}
              >
                Cookies
              </Link>,
              <Link
                href={'/help/privacy'}
                className="govuk-footer__link"
                key={'footer-link-privacy'}
              >
                Cookies
              </Link>,
            ]}
          />
        </body>
      </html>
    </SessionProvider>
  );
}
