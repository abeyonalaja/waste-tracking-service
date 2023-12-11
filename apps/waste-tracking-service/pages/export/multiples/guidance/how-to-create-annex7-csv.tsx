import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { CompleteFooter, CompleteHeader, BreadcrumbWrap } from 'components';
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
        <GovUK.Breadcrumbs.Link>{t('app.title')}</GovUK.Breadcrumbs.Link>
      </GovUK.Breadcrumbs>
    </BreadcrumbWrap>
  );
};

export function HowToCreateCSV() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>
          Export green list waste: how to submit multiple exports from a CSV
          file
        </title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.Heading size="L">
          Export green list waste: how to submit multiple exports from a CSV
          file
        </GovUK.Heading>
      </GovUK.Page>
    </>
  );
}

export default HowToCreateCSV;
