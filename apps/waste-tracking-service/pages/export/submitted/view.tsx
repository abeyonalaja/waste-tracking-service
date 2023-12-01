import React, { useEffect, useState, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  ButtonGroup,
  Paragraph,
  SubmissionNotFound,
  SaveReturnButton,
  Loading,
  DownloadPDFLink,
  SubmissionSummary,
  AppLink,
} from 'components';
import styled from 'styled-components';
import { Submission } from '@wts/api/waste-tracking-gateway';

type State = {
  data: Submission;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type: 'DATA_FETCH_INIT' | 'DATA_FETCH_SUCCESS' | 'DATA_FETCH_FAILURE';
  payload?: Submission;
};

const initialState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const ActionHeader = styled(GovUK.H2)`
  border-top: 2px solid #1d70b8;
  padding-top: 1em;
  margin-bottom: 0.5em;
`;

const viewRecordReducer = (state: State, action: Action) => {
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
    default:
      throw new Error();
  }
};

const ViewRecord = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [viewRecordPage, dispatchViewRecordPage] = useReducer(
    viewRecordReducer,
    initialState
  );
  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchViewRecordPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchViewRecordPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchViewRecordPage({
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
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: `/export/submitted`,
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
      <Head>
        <title>{t('exportJourney.submittedView.caption')}</title>
      </Head>

      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        {viewRecordPage.isError && !viewRecordPage.isLoading && (
          <SubmissionNotFound />
        )}
        {viewRecordPage.isLoading && <Loading />}
        {!viewRecordPage.isError && !viewRecordPage.isLoading && (
          <>
            {viewRecordPage.data.submissionDeclaration.status ===
              'Complete' && (
              <GovUK.GridRow>
                <GovUK.GridCol setWidth="two-thirds">
                  <GovUK.Caption id="my-reference">
                    {t('exportJourney.submittedView.caption')}
                  </GovUK.Caption>
                  <GovUK.Heading size="LARGE" id="template-heading">
                    {t('exportJourney.submittedView.title')}:{' '}
                    {
                      viewRecordPage.data.submissionDeclaration.values
                        .transactionId
                    }
                  </GovUK.Heading>
                  <SubmissionSummary
                    data={viewRecordPage.data}
                    showChangeLinks={false}
                  />
                  <ButtonGroup>
                    <SaveReturnButton
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push({
                          pathname: `/export/submitted`,
                        });
                      }}
                    >
                      {t('exportJourney.submittedView.button')}
                    </SaveReturnButton>
                  </ButtonGroup>
                </GovUK.GridCol>
                <GovUK.GridCol setWidth="one-third">
                  <ActionHeader size="S">{t('actions')}</ActionHeader>
                  <DownloadPDFLink
                    submissionId={id}
                    transactionId={
                      viewRecordPage.data.submissionDeclaration.values
                        .transactionId
                    }
                  >
                    {t('exportJourney.submittedView.downloadPDF')}
                  </DownloadPDFLink>
                  <Paragraph>
                    {t('exportJourney.submittedView.downloadPDFinfo')}
                  </Paragraph>
                  <AppLink
                    href={{
                      pathname: `/export/templates/create-from-record`,
                      query: { id, context: 'view' },
                    }}
                  >
                    {t('templates.create.fromRecord.linkUse')}
                  </AppLink>
                </GovUK.GridCol>
              </GovUK.GridRow>
            )}
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default ViewRecord;
