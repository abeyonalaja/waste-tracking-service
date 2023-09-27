import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  AppLink,
  Card,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
} from 'components';
import React, { useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useSubmissionContext } from 'contexts';

const UnderlinedH1 = styled(GovUK.Heading)`
  border-bottom: 2px solid #e2e3e4;
  padding-bottom: 0.5em;
`;

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

export function Index() {
  const { setSubmission } = useSubmissionContext();

  useEffect(() => {
    setSubmission({});
  }, [setSubmission]);

  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('dashboard.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <UnderlinedH1 size="L">{t('dashboard.title')}</UnderlinedH1>
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="one-third">
            <Card title="Create a new Annex VII record">
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/incomplete/reference`,
                    }}
                    id="your-reference"
                  >
                    Create a single Annex VII record
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: '/export/incomplete',
                    }}
                  >
                    Manage incomplete Annex VII records
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
          <GovUK.GridCol setWidth="one-third">
            <Card title="Update an Annex VII record">
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/estimated`,
                    }}
                  >
                    Update an Annex VII record with actual details
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
          <GovUK.GridCol setWidth="one-third">
            <Card title="Submitted Annex VII records">
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/submitted`,
                    }}
                  >
                    View all submitted Annex VII records
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
}

export default Index;
