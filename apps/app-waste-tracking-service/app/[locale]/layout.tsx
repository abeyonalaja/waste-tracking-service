import * as GovUK from '@wts/ui/govuk-react-ui';
import { HeaderNavigation, LanguageSwitcher, Link } from '../components';
import React, { Suspense } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <GovUK.Header
        serviceNameLink={
          <Link
            href={'/account'}
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
    </>
  );
}
