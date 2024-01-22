import React, { useEffect, useState, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  SaveReturnButton,
  DownloadPDFLink,
  Paragraph,
  AppLink,
} from 'components';

import styled from 'styled-components';

import { Submission } from '@wts/api/waste-tracking-gateway';
import useApiConfig from 'utils/useApiConfig';

type State = {
  data: Submission;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE';
  payload?: Submission;
};

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const exportSubmittedReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'DATA_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'DATA_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'DATA_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'DATA_UPDATE':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    default:
      throw new Error();
  }
};

const ActionHeader = styled(GovUK.H2)`
  border-top: 2px solid #1d70b8;
  padding-top: 1em;
  margin-bottom: 0.5em;
`;

const StyledHeading = styled(GovUK.Heading)`
  margin-bottom: 15px;
`;

const StyledPanel = styled(GovUK.Panel)`
  background: #00703c;
  margin-bottom: 30px;
`;

const StyledUnorderedList = styled(GovUK.UnorderedList)`
  margin-top: 15px;
`;

const IdDisplay = styled.div`
  font-weight: 600;
`;

const ExportSubmitted = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();

  const [exportSubmittedPage, dispatchExportSubmittedPage] = useReducer(
    exportSubmittedReducer,
    initialWasteDescState
  );

  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const [errors] = useState<{
    description?: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      dispatchExportSubmittedPage({ type: 'DATA_FETCH_INIT' });

      if (id !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`,
          {
            headers: apiConfig,
          }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchExportSubmittedPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchExportSubmittedPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.Breadcrumbs>
          <GovUK.Breadcrumbs.Link href="/">
            {t('app.title')}
          </GovUK.Breadcrumbs.Link>
          <GovUK.Breadcrumbs.Link href="/export">
            {t('exportJourney.exportSubmitted.breadcrumb')}
          </GovUK.Breadcrumbs.Link>
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>Export submitted</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {exportSubmittedPage.isError && !exportSubmittedPage.isLoading && (
              <SubmissionNotFound />
            )}
            {exportSubmittedPage.isLoading && <Loading />}
            {!exportSubmittedPage.isError && !exportSubmittedPage.isLoading && (
              <>
                {errors && !!Object.keys(errors).length && (
                  <GovUK.ErrorSummary
                    heading={t('errorSummary.title')}
                    errors={Object.keys(errors).map((key) => ({
                      targetName: key,
                      text: errors[key],
                    }))}
                  />
                )}

                <StyledPanel
                  title={
                    exportSubmittedPage.data.submissionState.status ===
                    'UpdatedWithActuals'
                      ? t('exportJourney.exportSubmitted.panelTitleUpdate')
                      : t('exportJourney.exportSubmitted.panelTitle')
                  }
                >
                  {exportSubmittedPage.data.submissionState.status ===
                  'UpdatedWithActuals'
                    ? t('exportJourney.exportSubmitted.panelUpdate')
                    : t('exportJourney.exportSubmitted.panel')}
                  {exportSubmittedPage?.data.submissionDeclaration.status ===
                    'Complete' && (
                    <IdDisplay id="transaction-id">
                      {
                        exportSubmittedPage.data.submissionDeclaration.values
                          .transactionId
                      }
                    </IdDisplay>
                  )}
                </StyledPanel>

                <StyledHeading size="SMALL">
                  {t('exportJourney.exportSubmitted.statement')}
                </StyledHeading>

                <Paragraph>
                  {t('exportJourney.exportSubmitted.listHeader')}
                </Paragraph>
                <StyledUnorderedList>
                  <GovUK.ListItem>
                    {t('exportJourney.exportSubmitted.listItemOne')}
                  </GovUK.ListItem>
                  <GovUK.ListItem>
                    {t('exportJourney.exportSubmitted.listItemTwo')}
                  </GovUK.ListItem>
                  <GovUK.ListItem>
                    {t('exportJourney.exportSubmitted.listItemThree')}
                  </GovUK.ListItem>
                </StyledUnorderedList>

                {exportSubmittedPage.data.submissionState.status ===
                  'SubmittedWithEstimates' && (
                  <>
                    <StyledHeading size="SMALL">
                      {t('exportJourney.exportSubmitted.optionalHeading')}
                    </StyledHeading>

                    <Paragraph>
                      {t('exportJourney.exportSubmitted.secondListHeader')}
                      <StyledUnorderedList>
                        <GovUK.ListItem>
                          {' '}
                          {t('exportJourney.exportSubmitted.secondListItemOne')}
                        </GovUK.ListItem>
                        <GovUK.ListItem>
                          {' '}
                          {t('exportJourney.exportSubmitted.secondListItemTwo')}
                        </GovUK.ListItem>
                      </StyledUnorderedList>
                    </Paragraph>
                  </>
                )}

                <Paragraph mb={6}>
                  <>
                    {t('exportJourney.exportSubmitted.legalStatementp1')}
                    <DownloadPDFLink
                      submissionId={id}
                      transactionId={exportSubmittedPage.data.reference}
                    />
                    {exportSubmittedPage.data.submissionState.status ===
                      'SubmittedWithEstimates' && (
                      <>{t('exportJourney.exportSubmitted.legalStatementp2')}</>
                    )}
                  </>
                </Paragraph>

                <SaveReturnButton
                  onClick={() =>
                    router.push({
                      pathname: '/export',
                    })
                  }
                >
                  {t('exportJourney.exportSubmitted.button')}
                </SaveReturnButton>
              </>
            )}
          </GovUK.GridCol>
          <GovUK.GridCol setWidth="one-third">
            <ActionHeader size="S">{t('actions')}</ActionHeader>
            <GovUK.UnorderedList listStyleType={'none'}>
              <GovUK.ListItem>
                <AppLink
                  href={{
                    pathname: `/export/templates/create-from-record`,
                    query: { id, context: 'created' },
                  }}
                >
                  {t('templates.create.fromRecord.link')}
                </AppLink>
              </GovUK.ListItem>
            </GovUK.UnorderedList>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default ExportSubmitted;
ExportSubmitted.auth = true;
