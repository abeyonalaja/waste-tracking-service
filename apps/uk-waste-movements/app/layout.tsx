import React from 'react';
import './main.scss';
import * as GovUK from '@wts/ui/govuk-react-ui';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={'govuk-template'}>
      <body className={'govuk-template__body'}>
        <GovUK.SkipLink />
        <GovUK.Header serviceName={'UK waste movements'} />
        <GovUK.WidthContainer>
          <GovUK.PhaseBanner tag={`Beta`}>
            This is a new service
          </GovUK.PhaseBanner>
        </GovUK.WidthContainer>
        <GovUK.WidthContainer>
          <GovUK.Main>{children}</GovUK.Main>
        </GovUK.WidthContainer>
        <GovUK.Footer />
      </body>
    </html>
  );
}
