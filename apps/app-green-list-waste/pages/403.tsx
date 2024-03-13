import { AppLink, Footer, Header } from 'components';
import * as GovUK from 'govuk-react';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Paragraph } from 'components';

export default function Custom403() {
  const [userRef, setUserRef] = useState<string>(null);
  const baseUrl =
    process.env['NODE_ENV'] === 'production' ? '/export-annex-VII-waste' : '';
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${baseUrl}/api/auth/getUserUniqueRef`, {
        method: 'get',
      });
      const jsoned = await response.json();
      setUserRef(jsoned.ref);
    };
    fetchData();
  }, []);
  return (
    <>
      <Head>
        <title>Sorry, you are not part of the private beta group </title>
      </Head>
      <GovUK.Page id="content" header={<Header />} footer={<Footer />}>
        <GovUK.GridRow>
          <GovUK.GridCol setWidth={'one-half'}>
            <GovUK.Heading size="LARGE">
              Sorry, you are not part of the private beta group
            </GovUK.Heading>
            <Paragraph>
              If you think you should be part of the private beta group, email{' '}
              <AppLink href={`mailto:wasteuserresearch@defra.gov.uk`}>
                wasteuserresearch@defra.gov.uk
              </AppLink>{' '}
              and include the following details:
            </Paragraph>
            <GovUK.UnorderedList>
              <GovUK.ListItem>
                <strong>Customer ID: </strong>
                {userRef}
              </GovUK.ListItem>
            </GovUK.UnorderedList>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
}
