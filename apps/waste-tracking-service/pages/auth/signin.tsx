import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { CompleteFooter, CompleteHeader, Paragraph } from '../../components';
import React from 'react';
import Head from 'next/head';
import { signIn } from 'next-auth/react';

const BreadCrumbs = () => {
  return <></>;
};

const SignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && router.isReady) {
      // Todo: if callbackUrl exists, we should redirect there
      router.push({
        pathname: '/export',
      });
    }
  }, [session, router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.Heading size={'L'}>Sign in</GovUK.Heading>
        <Paragraph>
          You need a Defra account to submit a waste export.
        </Paragraph>
        <GovUK.Button
          onClick={() => {
            signIn('defra-b2c');
          }}
        >
          Sign in or create an account
        </GovUK.Button>
      </GovUK.Page>
    </>
  );
};

export default SignIn;
