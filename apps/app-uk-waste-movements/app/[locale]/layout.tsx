import React, { Suspense } from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Link } from '@wts/ui/navigation';
import '../main.scss';
import { AuthNavigation } from '@wts/ui/shared-ui/server';
import { pick } from '../../utils';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: LayoutProps): Promise<JSX.Element> {
  const t = await getTranslations('app');
  const messages = await getMessages();

  return (
    <html lang={locale} className={'govuk-template govuk-frontend-supported'}>
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
  );
}
