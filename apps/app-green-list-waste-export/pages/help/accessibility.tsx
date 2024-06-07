import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { Footer, Header } from '../../components';
import React from 'react';
import Head from 'next/head';

const Accessibility = (): React.ReactNode => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('app.title')}</title>
      </Head>
      <GovUK.Page id="content" header={<Header />} footer={<Footer />}>
        <GovUK.Heading size="L">Accessibility</GovUK.Heading>
      </GovUK.Page>
    </>
  );
};

export default Accessibility;
