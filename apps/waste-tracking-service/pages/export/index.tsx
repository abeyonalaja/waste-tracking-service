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
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { getApiConfig } from '../../utils/api/apiConfig';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

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

export function Index({ apiConfig }) {
  const router = useRouter();
  const { setSubmission } = useSubmissionContext();

  useEffect(() => {
    setSubmission({});
  }, [setSubmission]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/countries`,
          {
            headers: apiConfig,
          }
        ).then((response) => {
          if (response.ok) return response.json();
          else {
            if (response.status === 403) {
              router.push({
                pathname: `/403/`,
              });
            }
          }
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

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
        <GovUK.GridRow mb={6}>
          <GovUK.GridCol setWidth="one-third">
            <Card
              title={t('exportJourney.exportHome.card.createRecord')}
              id="card-create-annex"
            >
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/incomplete/reference`,
                    }}
                    id="your-reference"
                  >
                    {t('exportJourney.exportHome.createSingleRecord')}
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/templates`,
                      query: { context: 'use' },
                    }}
                  >
                    {t('exportJourney.exportHome.useTemplateToCreatRecord')}
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: '/export/incomplete',
                    }}
                  >
                    {' '}
                    {t('exportJourney.exportHome.manageIncompleteRecords')}
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
          <GovUK.GridCol setWidth="one-third">
            <Card title={t('exportJourney.exportHome.card.update')}>
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/estimated`,
                    }}
                  >
                    {t('exportJourney.exportHome.updateRecordWithActuals')}
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
          <GovUK.GridCol setWidth="one-third">
            <Card title={t('exportJourney.exportHome.card.submitted')}>
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/submitted`,
                    }}
                  >
                    {t('exportJourney.exportHome.viewAllRecords')}
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
        </GovUK.GridRow>
        <GovUK.GridRow mb={9}>
          <GovUK.GridCol setWidth="one-third">
            <Card title={t('exportJourney.exportHome.card.templates')}>
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/templates/create`,
                      query: { context: 'dashboard' },
                    }}
                  >
                    {t('templates.createLink')}
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/export/templates`,
                    }}
                  >
                    {t('templates.manageLink')}
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
          {process.env.NEXT_PUBLIC_MULTIPLES_ENABLED === 'true' && (
            <GovUK.GridCol setWidth="one-third">
              <Card title={t('export.homepage.multiples.guidance.title')}>
                <GovUK.UnorderedList listStyleType={'none'}>
                  <GovUK.ListItem>
                    <AppLink
                      href={{
                        pathname: `/export/multiples/guidance/bounce`,
                      }}
                    >
                      {t('export.homepage.multiples.guidance.link')}
                    </AppLink>
                  </GovUK.ListItem>
                </GovUK.UnorderedList>
              </Card>
            </GovUK.GridCol>
          )}
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
}

export default Index;
