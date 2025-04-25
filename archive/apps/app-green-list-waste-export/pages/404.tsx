import { Error404Content, Footer, Header } from 'components';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import React from 'react';
import Head from 'next/head';

export default function Custom404(): React.ReactNode {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('404.title')}</title>
      </Head>
      <GovUK.Page id="content" header={<Header />} footer={<Footer />}>
        <Error404Content />
      </GovUK.Page>
    </>
  );
}
