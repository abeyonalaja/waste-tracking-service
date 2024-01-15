import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { CompleteFooter, CompleteHeader } from '../../components';
import React from 'react';
import Head from 'next/head';

const BreadCrumbs = () => {
  return <></>;
};

const SignOut = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('app.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      />
    </>
  );
};

export default SignOut;
