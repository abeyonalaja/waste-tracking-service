import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { Footer, Header, NotificationBanner } from 'components';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Status(): React.ReactNode {
  const router = useRouter();
  const { t } = useTranslation();
  const [context, setContext] = useState<string>('');
  useEffect(() => {
    if (router.isReady) {
      if (router.query.context) {
        setContext(String(router.query.context));
      }
    }
  }, [router.isReady, router.query.context]);

  return (
    <>
      <Head>
        <title>{t('dashboard.title')}</title>
      </Head>
      <GovUK.Page id="content" header={<Header />} footer={<Footer />}>
        {context === 'unauthorized' && (
          <NotificationBanner
            type="important"
            id={`access-banner-unauthorized`}
            headingText={
              'You need to be signed into your Defra account in order to activate your invitation.'
            }
          />
        )}
        {context === 'error' && (
          <NotificationBanner
            type="important"
            id={`access-banner-error`}
            headingText={'An error has occurred.'}
          />
        )}
      </GovUK.Page>
    </>
  );
}
