import * as GovUK from '@wts/ui/govuk-react-ui';
import { LanguageSwitcher } from '../../components';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <GovUK.Header />
      <GovUK.WidthContainer>
        <GovUK.PhaseBanner tag={`Private beta`}>
          {'This is a new service'}
        </GovUK.PhaseBanner>
      </GovUK.WidthContainer>
      <GovUK.WidthContainer>
        <LanguageSwitcher />
      </GovUK.WidthContainer>
      <GovUK.WidthContainer>
        <GovUK.Main>{children}</GovUK.Main>
      </GovUK.WidthContainer>
      <GovUK.Footer />
    </>
  );
}
