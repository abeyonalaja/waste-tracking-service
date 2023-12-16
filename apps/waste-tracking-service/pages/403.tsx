import { AppLink, CompleteFooter, CompleteHeader } from 'components';
import * as GovUK from 'govuk-react';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Paragraph } from 'components';

export default function Custom403() {
  const [userRef, setUserRef] = useState<string>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/auth/getUserUniqueRef`, {
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
        <title>Sorry, you are not part of the private beta</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth={'one-half'}>
            <GovUK.Heading size="LARGE">
              Sorry, you are not part of the private beta
            </GovUK.Heading>
            <Paragraph>
              If you think you should be part of the beta, contact{' '}
              <AppLink href={`mailto:wastetracking@defra.gov.uk`}>
                wastetracking@defra.gov.uk
              </AppLink>{' '}
              and include the following details:
            </Paragraph>
            <GovUK.InsetText>
              <strong>Customer ID: </strong>
              {userRef}
            </GovUK.InsetText>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
}
