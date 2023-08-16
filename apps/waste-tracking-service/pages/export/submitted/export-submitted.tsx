import React, { useEffect, useState, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  SaveReturnButton,
  DownloadPDFLink,
  Paragraph,
} from 'components';

import styled from 'styled-components';

import { Submission } from '@wts/api/waste-tracking-gateway';

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
    dispatchExportSubmittedPage({ type: 'DATA_FETCH_INIT' });

    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
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
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
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
                  {t('exportJourney.exportSubmitted.panel')}
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
                </Paragraph>
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
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default ExportSubmitted;
