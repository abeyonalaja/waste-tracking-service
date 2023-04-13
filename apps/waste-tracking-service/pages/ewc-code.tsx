import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BreadcrumbWrap, CompleteFooter, CompleteHeader } from '../components';
import * as GovUK from 'govuk-react';

const EwcCode = () => {
  const router = useRouter();
  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: '/waste-code',
              query: { id },
            });
          }}
        >
          Back
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <h1>EWC code pages will appear here...</h1>
        <p>
          <Link
            href={{
              pathname: '/national-code',
              query: { id },
            }}
          >
            Continue to National code page
          </Link>{' '}
        </p>
      </GovUK.Page>
    </>
  );
};

export default EwcCode;
