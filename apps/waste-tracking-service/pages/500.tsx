import { Footer, Header } from 'components';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import React from 'react';
import Head from 'next/head';

export default function Custom500() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('500.title')}</title>
      </Head>
      <GovUK.Page id="content" header={<Header />} footer={<Footer />}>
        <GovUK.Heading size="LARGE">{t('500.title')}</GovUK.Heading>
        <GovUK.Paragraph>{t('500.paragraph1')}</GovUK.Paragraph>
        <GovUK.Paragraph>{t('500.paragraph2')}</GovUK.Paragraph>
      </GovUK.Page>
    </>
  );
}
