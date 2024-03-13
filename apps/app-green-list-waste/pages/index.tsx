import {
  AppLink,
  BreadCrumbLink,
  BreadcrumbWrap,
  Footer,
  Header,
  NotificationBanner,
  Paragraph,
} from 'components';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
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

export function Index() {
  const { t } = useTranslation();
  const router = useRouter();
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
        <title>{t('app.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {context === 'unauthorized' && (
          <NotificationBanner
            type="important"
            id={`access-banner-unauthorized`}
            headingText={
              'You need to be signed into your Defra account in order to activate your invitation'
            }
          />
        )}
        <Paragraph>
          <AppLink href={{ pathname: '/export' }} id="dashboard_link">
            {t('app.title')}
          </AppLink>
        </Paragraph>
      </GovUK.Page>
    </>
  );
}

export default Index;
