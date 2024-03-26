import React from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import '../main.scss';
import { HeaderNavigation, LanguageSwitcher, Link } from '../components';
import { getServerSession } from 'next-auth';
import SessionProvider from '../providers/SessionProvider';
import { Suspense } from 'react';

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
          <GovUK.Header
            serviceNameLink={
              <Link
                href={
                  process.env.NEXT_PUBLIC_UKWM_ENABLED === 'true'
                    ? '/'
                    : '/export-annex-VII-waste'
                }
                className="govuk-header__link govuk-header__service-name"
              >
                Move and track waste
              </Link>
            }
            navigation={
              <Suspense>
                <HeaderNavigation />
              </Suspense>
            }
          />
          <GovUK.WidthContainer>
            <GovUK.PhaseBanner tag={`Beta`}>
              {'This is not a live service'}
            </GovUK.PhaseBanner>
          </GovUK.WidthContainer>
          <GovUK.WidthContainer>
            <LanguageSwitcher />
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
                Privacy
              </Link>,
            ]}
          />
        </body>
      </html>
    </SessionProvider>
  );
}
