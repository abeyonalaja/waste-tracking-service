import React from 'react';
import * as GovUK from 'govuk-react-ui';
import '../main.scss';
import { useTranslations } from 'next-intl';

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
    <html lang={locale} className={'govuk-template'}>
      <body className={'govuk-template__body'}>
        <GovUK.SkipLink />
        <GovUK.Header serviceName={t('title')} />
        <GovUK.WidthContainer>
          <GovUK.PhaseBanner tag={`Beta`}>{t('phaseBanner')}</GovUK.PhaseBanner>
        </GovUK.WidthContainer>
        {children}
        <GovUK.Footer />
      </body>
    </html>
  );
}
