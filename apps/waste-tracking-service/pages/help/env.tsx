import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { CompleteFooter, CompleteHeader } from '../../components';
import React from 'react';
import Head from 'next/head';

export const getServerSideProps = () => {
  const dcidRedirect = process.env.NX_DCID_REDIRECT;
  return { props: { dcidRedirect } };
};

export const Envtest = ({ dcidRedirect }) => {
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
      >
        <GovUK.Heading size="L">ENV Var Test</GovUK.Heading>
        <GovUK.OrderedList>
          <GovUK.ListItem>NODE_ENV - {process.env.NODE_ENV}</GovUK.ListItem>
          <GovUK.ListItem>
            DCID_REDIRECT - {process.env.DCID_REDIRECT}
          </GovUK.ListItem>
          <GovUK.ListItem>
            NX_DCID_REDIRECT (alias) - {process.env.NX_DCID_REDIRECT}
          </GovUK.ListItem>
          <GovUK.ListItem>
            From serverside props - {dcidRedirect}
          </GovUK.ListItem>
        </GovUK.OrderedList>
      </GovUK.Page>
    </>
  );
};

export default Envtest;
