import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  AppLink,
  Card,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  Paragraph,
} from '../../components';
import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';

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
                      pathname: `${process.env.NX_EXPORT_URL}/add-your-own-export-reference`,
                    }}
                    id="your-reference"
                  >
                    Create a single Annex VII record
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink href="" disabled={true}>
                    Use a template to create a single Annex VII record
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink href="" disabled={true}>
                    Create multiple Annex VII records
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `${process.env.NX_EXPORT_URL}/incomplete-annex-7`,
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
                      pathname: `${process.env.NX_EXPORT_URL}/update-annex-7`,
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
                      pathname: `${process.env.NX_EXPORT_URL}/submitted-annex-7`,
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
