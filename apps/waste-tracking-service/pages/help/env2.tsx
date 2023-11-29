import * as GovUK from 'govuk-react';
import { CompleteFooter, CompleteHeader } from '../../components';
import React from 'react';
import Head from 'next/head';

export const getStaticProps = () => {
  const dcidRedirect = process.env.NX_DCID_REDIRECT;
  return { props: { dcidRedirect } };
};

export const Envtest = ({ dcidRedirect }) => {
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
            DCID_REDIRECT - {process.env.DCID_REDIRECT}
          </GovUK.ListItem>
          <GovUK.ListItem>
            NX_DCID_REDIRECT (alias) - {process.env.NX_DCID_REDIRECT}
          </GovUK.ListItem>
          <GovUK.ListItem>
            DCID_REDIRECT from serverside props - {dcidRedirect}
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
