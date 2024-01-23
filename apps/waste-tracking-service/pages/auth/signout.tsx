import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { BreadcrumbWrap, Footer, Header, Paragraph, AppLink } from 'components';
import { signIn, signOut } from 'next-auth/react';
import React, { useEffect } from 'react';
import Head from 'next/head';

const BreadCrumbs = () => {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <GovUK.Breadcrumbs>
        <GovUK.Breadcrumbs.Link href="/">
          {t('app.parentTitle')}
        </GovUK.Breadcrumbs.Link>
      </GovUK.Breadcrumbs>
    </BreadcrumbWrap>
  );
};

const SignOut = () => {
  const { t } = useTranslation();
  useEffect(() => {
    signOut({ redirect: false });
  }, []);
  return (
    <>
      <Head>
        <title>{t('app.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header isSignOutPage={true} />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            <GovUK.Heading size="LARGE">
              For your security, we signed you out
            </GovUK.Heading>
            <Paragraph>We have saved your answers.</Paragraph>
            <Paragraph>
              You can close this tab or{' '}
              <AppLink
                href="/auth/signin"
                onClick={(e) => {
                  e.preventDefault();
                  signIn('defra-b2c', { callbackUrl: '/export' });
                }}
              >
                sign in
              </AppLink>{' '}
              again.
            </Paragraph>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default SignOut;
