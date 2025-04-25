import { Footer, Header, Paragraph } from 'components';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import React from 'react';
import Head from 'next/head';

export default function Custom500(): React.ReactNode {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('500.title')}</title>
      </Head>
      <GovUK.Page id="content" header={<Header />} footer={<Footer />}>
        <GovUK.Heading size="LARGE">{t('500.title')}</GovUK.Heading>
        <Paragraph>{t('500.paragraph1')}</Paragraph>
        <Paragraph>{t('500.paragraph2')}</Paragraph>
      </GovUK.Page>
    </>
  );
}
