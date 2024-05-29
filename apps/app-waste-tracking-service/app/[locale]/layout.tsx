import * as GovUK from '@wts/ui/govuk-react-ui';
import { Link } from '@wts/ui/navigation';
import React, { Suspense } from 'react';
import { AuthNavigation } from '@wts/ui/shared-ui/server';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({
  children,
}: LayoutProps): Promise<JSX.Element> {
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
            <AuthNavigation />
          </Suspense>
        }
      />
      <GovUK.WidthContainer>
        <GovUK.PhaseBanner tag={`Private beta`}>
          {'This is a new service'}
        </GovUK.PhaseBanner>
      </GovUK.WidthContainer>
      {children}
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
