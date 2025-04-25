import React, { Suspense } from 'react';
import SessionProvider from './providers/SessionProvider';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import { NextIntlClientProvider } from 'next-intl';
import { pick } from '../utils';
import * as GovUK from '@wts/ui/govuk-react-ui';
import Link from 'next/link';
import { AuthNavigation } from '@wts/ui/shared-ui/server';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import './main.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: LayoutProps): Promise<JSX.Element> {
  const session = await getServerSession(options);
  const locale = await getLocale();
  const t = await getTranslations({ namespace: 'app' });
  const messages = await getMessages();

  return (
    <SessionProvider session={session}>
      <html lang={locale} className={'govuk-template govuk-frontend-supported'}>
        <body className={'govuk-template__body'}>
          <NextIntlClientProvider messages={pick(messages, ['error'])}>
            <GovUK.SkipLink />
            <GovUK.Header
              serviceNameLink={
                <Link
                  href="/"
                  className="govuk-header__link govuk-header__service-name"
                >
                  {t('title')}
                </Link>
              }
              navigation={
                <Suspense>
                  <AuthNavigation />
                </Suspense>
              }
            />
            <GovUK.WidthContainer>
              <GovUK.PhaseBanner tag={`Private beta`}>
                {t.rich('phaseBanner', {
                  link: (chunks) => (
                    <Link
                      href="/feedback"
                      className={'govuk-link govuk-link--no-visited-state'}
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </GovUK.PhaseBanner>
            </GovUK.WidthContainer>
            {children}
            <GovUK.Footer />
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
