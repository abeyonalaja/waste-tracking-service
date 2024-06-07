import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  AppLink,
  Card,
  Footer,
  Header,
  BreadCrumbLink,
  BreadcrumbWrap,
  NotificationBanner,
} from 'components';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useSubmissionContext } from 'contexts';
import { useRouter } from 'next/router';
import useApiConfig from 'utils/useApiConfig';

const UnderlinedH1 = styled(GovUK.Heading)`
  border-bottom: 2px solid #e2e3e4;
  padding-bottom: 0.5em;
`;

const BreadCrumbs = () => {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <GovUK.Breadcrumbs>
        <BreadCrumbLink href="/">{t('app.parentTitle')}</BreadCrumbLink>
        <GovUK.Breadcrumbs.Link>{t('app.title')}</GovUK.Breadcrumbs.Link>
      </GovUK.Breadcrumbs>
    </BreadcrumbWrap>
  );
};

function Index(): React.ReactNode {
  const router = useRouter();
  const apiConfig = useApiConfig();
  const { setSubmission, featureFlags } = useSubmissionContext();

  const [numberOfCompleteSubmissions, setNumberOfCompleteSubmissions] =
    React.useState<number>(0);
  const [numberOfCompleteWithEstimates, setNumberOfCompleteWithEstimates] =
    React.useState<number>(0);
  const [numberOfIncompleteSubmissions, setNumberOfIncompleteSubmissions] =
    React.useState<number>(0);

  const [context, setContext] = useState<string>('');

  const [numberOfTemplates, setNumberOfTemplates] = React.useState<number>(0);
  useEffect(() => {
    setSubmission({});
  }, [setSubmission]);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.context) {
        setContext(String(router.query.context));
      }
    }
  }, [router.isReady, router.query.context]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/numberOfSubmissions`,
          {
            headers: apiConfig,
          },
        );

        if (response.ok) {
          const data = await response.json();
          setNumberOfCompleteSubmissions(data.completedWithActuals);
          setNumberOfCompleteWithEstimates(data.completedWithEstimates);
          setNumberOfIncompleteSubmissions(data.incomplete);
        } else {
          if (response.status === 403) {
            router.push({
              pathname: `/403/`,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/numberOfTemplates`,
          {
            headers: apiConfig,
          },
        );

        if (response.ok) {
          const data = await response.json();
          setNumberOfTemplates(data);
        } else {
          if (response.status === 403) {
            router.push({
              pathname: `/403/`,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);
  const maxValue = 999;
  const maxValueReached = '999+'; // display this in case more than 999 records exist
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('dashboard.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {context === 'unauthorized' && (
          <NotificationBanner
            type="important"
            id={`access-banner-unauthorized`}
            headingText={
              'You need to be signed into your Defra account in order to activate your invitation'
            }
          />
        )}
        {context === 'granted' && (
          <NotificationBanner
            type="success"
            id={`access-banner-granted`}
            headingText={'Your access has been granted'}
          />
        )}
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
                      pathname: `/incomplete/reference`,
                    }}
                    id="your-reference"
                  >
                    {t('exportJourney.exportHome.createSingleRecord')}
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/templates`,
                      query: { context: 'use' },
                    }}
                  >
                    {t('exportJourney.exportHome.useTemplateToCreateRecord')}
                  </AppLink>
                </GovUK.ListItem>
                {process.env.NEXT_PUBLIC_MULTIPLES_ENABLED === 'true' && (
                  <GovUK.ListItem>
                    <AppLink
                      href={{
                        pathname: `/multiples/`,
                      }}
                    >
                      {t('exportJourney.exportHome.createMultipleRecords')}
                    </AppLink>
                  </GovUK.ListItem>
                )}
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: '/incomplete',
                    }}
                  >
                    {' '}
                    {t('exportJourney.exportHome.manageIncompleteRecords', {
                      countRecords:
                        numberOfIncompleteSubmissions > maxValue
                          ? maxValueReached
                          : numberOfIncompleteSubmissions,
                      plural: numberOfIncompleteSubmissions > 1 ? 's' : '',
                    })}
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
          <GovUK.GridCol setWidth="one-third">
            <Card
              title={t('exportJourney.exportHome.card.update')}
              id="card-update-annex"
            >
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/estimated`,
                    }}
                  >
                    {t('exportJourney.exportHome.updateRecordWithActuals', {
                      countRecords:
                        numberOfCompleteWithEstimates > maxValue
                          ? maxValueReached
                          : numberOfCompleteWithEstimates,
                    })}
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
          <GovUK.GridCol setWidth="one-third">
            <Card
              title={t('exportJourney.exportHome.card.submitted')}
              id="card-submitted-annex"
            >
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/submitted`,
                    }}
                  >
                    {t('exportJourney.exportHome.viewAllRecords', {
                      countRecords:
                        numberOfCompleteSubmissions > maxValue
                          ? maxValueReached
                          : numberOfCompleteSubmissions,
                    })}
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
        </GovUK.GridRow>
        <GovUK.GridRow mb={9}>
          <GovUK.GridCol setWidth="one-third">
            <Card
              title={t('exportJourney.exportHome.card.templates')}
              id="card-templates"
            >
              <GovUK.UnorderedList listStyleType={'none'}>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/templates/create`,
                      query: { context: 'dashboard' },
                    }}
                  >
                    {t('templates.createLink')}
                  </AppLink>
                </GovUK.ListItem>
                <GovUK.ListItem>
                  <AppLink
                    href={{
                      pathname: `/templates`,
                    }}
                  >
                    {t('templates.manageLink', {
                      countRecords:
                        numberOfTemplates > maxValue
                          ? maxValueReached
                          : numberOfTemplates,
                      plural: numberOfTemplates > 1 ? 's' : '',
                    })}
                  </AppLink>
                </GovUK.ListItem>
              </GovUK.UnorderedList>
            </Card>
          </GovUK.GridCol>
          {featureFlags?.multiples && (
            <GovUK.GridCol setWidth="one-third">
              <Card
                title={t('export.homepage.multiples.guidance.title')}
                id="card-guidance"
              >
                <GovUK.UnorderedList listStyleType={'none'}>
                  <GovUK.ListItem>
                    <AppLink
                      href={{
                        pathname: `/multiples/guidance`,
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
Index.auth = true;
