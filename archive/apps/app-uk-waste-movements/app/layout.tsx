import React, { Suspense } from 'react';
import AppInsightsProvider from './providers/AppInsightsProvider';
import SessionProvider from './providers/SessionProvider';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { pick } from '../utils';
import Link from 'next/link';
import './main.scss';

import { AuthNavigation } from '@wts/ui/shared-ui/server';

import * as GovUK from '@wts/ui/govuk-react-ui';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: LayoutProps): Promise<JSX.Element> {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations('app');

  const connectionString = process.env['APPINSIGHTS_CONNECTION_STRING'];
  const session = await getServerSession(options);

  return (
    <AppInsightsProvider connectionString={connectionString!}>
      <SessionProvider session={session}>
        <ReactQueryProvider>
          <html
            lang={locale}
            className={'govuk-template govuk-frontend-supported'}
          >
            <body className={'govuk-template__body'}>
              <NextIntlClientProvider
                messages={pick(messages, ['error'])}
                locale={locale}
              >
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
        </ReactQueryProvider>
      </SessionProvider>
    </AppInsightsProvider>
  );
}
