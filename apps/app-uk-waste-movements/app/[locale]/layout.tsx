import React, { Suspense } from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Link } from '@wts/ui/navigation';
import '../main.scss';
import { useTranslations } from 'next-intl';
import { AuthNavigation } from '@wts/ui/shared-ui/server';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({
  children,
  params: { locale },
}: LayoutProps) {
  const t = useTranslations('app');

  return (
    <html lang={locale} className={'govuk-template govuk-frontend-supported'}>
      <body className={'govuk-template__body'}>
        <GovUK.SkipLink />
        <GovUK.Header
          serviceName={t('title')}
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
      </body>
    </html>
  );
}
