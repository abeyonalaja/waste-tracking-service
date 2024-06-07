import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { Footer, Header, Loading } from 'components';
import React from 'react';
import Head from 'next/head';
import { signIn } from 'next-auth/react';

const SignIn = (): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && router.isReady) {
      router.push({
        pathname:
          router.query.callbackUrl !== undefined
            ? router.query.callbackUrl.toString()
            : '/',
      });
    }
  }, [session, router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>{t('auth.title')}</title>
      </Head>
      <GovUK.Page id="content" header={<Header />} footer={<Footer />}>
        {session && <Loading />}
        {!session && (
          <>
            <GovUK.Heading size={'L'}>{t('auth.title')}</GovUK.Heading>
            <GovUK.Button
              onClick={() => {
                signIn('defra-b2c');
              }}
            >
              {t('auth.button')}
            </GovUK.Button>
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default SignIn;
