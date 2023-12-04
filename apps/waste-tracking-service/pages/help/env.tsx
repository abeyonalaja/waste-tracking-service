import * as GovUK from 'govuk-react';
import { CompleteFooter, CompleteHeader } from '../../components';
import React from 'react';
import Head from 'next/head';
import TestEnvComponent from './_testEnv';
import { TestEnvComponent2 } from '../../components/_testEnv2';

export const getServerSideProps = async () => {
  const cookieConsent = process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME || null;
  const googleAnalytics =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT || null;
  const dcidUrl = process.env.DCID_REDIRECT || null;
  return { props: { cookieConsent, googleAnalytics, dcidUrl } };
};

const EnvTest = ({ cookieConsent, googleAnalytics, dcidUrl }) => {
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
        <GovUK.Heading size="L">Test</GovUK.Heading>
        <GovUK.OrderedList>
          <GovUK.ListItem>
            NEXT_PUBLIC_COOKIE_CONSENT_NAME in a page:{' '}
            {process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME}
          </GovUK.ListItem>
          <GovUK.ListItem>
            NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT in a page:{' '}
            {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT}
          </GovUK.ListItem>

          <GovUK.ListItem>
            NEXT_PUBLIC_COOKIE_CONSENT_NAME from a server side page:{' '}
            {cookieConsent}
          </GovUK.ListItem>
          <GovUK.ListItem>
            NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT from a server side page:{' '}
            {googleAnalytics}
          </GovUK.ListItem>
          <GovUK.ListItem>
            DCID_REDIRECT from a server side page: <strong>{dcidUrl}</strong>
          </GovUK.ListItem>
        </GovUK.OrderedList>
        <TestEnvComponent />
        <TestEnvComponent2 />
      </GovUK.Page>
    </>
  );
};

export default EnvTest;
