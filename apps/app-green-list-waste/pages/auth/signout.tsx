import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  BreadCrumbLink,
  BreadcrumbWrap,
  Footer,
  Header,
  Paragraph,
  AppLink,
} from 'components';
import { signIn, signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const BreadCrumbs = () => {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <GovUK.Breadcrumbs>
        <BreadCrumbLink href="/">{t('app.parentTitle')}</BreadCrumbLink>
      </GovUK.Breadcrumbs>
    </BreadcrumbWrap>
  );
};

const SignOut = () => {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState<string>('/export');

  useEffect(() => {
    if (router.isReady) {
      setCallbackUrl(router.query.callbackUrl.toString());
    }
  }, [router.isReady]);

  useEffect(() => {
    signOut({ redirect: false });
  }, []);

  return (
    <>
      <Head>
        <title>For your security, we signed you out</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header isSignOutPage={true} callbackUrl={callbackUrl} />}
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
                  signIn('defra-b2c', { callbackUrl });
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
