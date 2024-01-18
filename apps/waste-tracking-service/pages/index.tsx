import { AppLink, BreadcrumbWrap, Footer, Header, Paragraph } from 'components';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import React from 'react';
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

export function Index() {
  const { t } = useTranslation();

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
