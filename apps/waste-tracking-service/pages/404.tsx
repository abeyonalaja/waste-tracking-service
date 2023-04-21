import { AppLink, CompleteFooter, CompleteHeader } from '../components';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import React from 'react';
import Head from 'next/head';

export default function Custom404() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('404.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
      >
        <GovUK.Heading size="XLARGE">{t('404.title')}</GovUK.Heading>
        <GovUK.Paragraph>{t('404.paragraph1')}</GovUK.Paragraph>
        <GovUK.Paragraph>{t('404.paragraph2')}</GovUK.Paragraph>
        <p>
          <AppLink
            href={{
              pathname: '/',
            }}
          >
            {t('404.link')}
          </AppLink>
        </p>
      </GovUK.Page>
    </>
  );
}
