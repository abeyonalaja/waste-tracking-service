import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { CompleteFooter, CompleteHeader } from '../../components';
import React from 'react';
import Head from 'next/head';

export const getServerSideProps = () => {
  const nextGA = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT || null;
  return { props: { nextGA } };
};

export const Envtest = ({ nextGA }) => {
  const nextGASaved = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT;
  return (
    <>
      <Head>
        <title>Title</title>
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
            NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT (alias) - {nextGASaved}
          </GovUK.ListItem>
          <GovUK.ListItem>
            NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT from serverside props -{' '}
            {nextGA}
          </GovUK.ListItem>
          <GovUK.ListItem>
            NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT -{' '}
            {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT}
          </GovUK.ListItem>
        </GovUK.OrderedList>
      </GovUK.Page>
    </>
  );
};

export default Envtest;
