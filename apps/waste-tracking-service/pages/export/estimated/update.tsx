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
  SubmissionSummary,
  NotificationBanner,
} from 'components';

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

const UpdateRecord = () => {
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
              pathname: `/export/estimated`,
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
                  {router.query.success && (
                    <NotificationBanner
                      type="success"
                      id="update-banner-success"
                      headingText={t(
                        'exportJourney.updateActualQuantity.success'
                      )}
                    />
                  )}
                  <GovUK.Caption id="my-reference">
                    {t('exportJourney.submittedView.title')}:{' '}
                    {
                      viewRecordPage.data.submissionDeclaration.values
                        .transactionId
                    }
                  </GovUK.Caption>
                  <GovUK.Heading size="LARGE" id="template-heading">
                    {t('exportJourney.updateActual.title')}
                  </GovUK.Heading>
                  <div id="estimate-warning-text">
                    <GovUK.WarningText>
                      {t('exportJourney.updateActual.warning')}
                    </GovUK.WarningText>
                  </div>

                  <SubmissionSummary
                    data={viewRecordPage.data}
                    showChangeLinks={false}
                    estimate={true}
                  />

                  <Paragraph mb={6}>
                    {t('exportJourney.updateActual.footerText')}
                  </Paragraph>

                  <ButtonGroup>
                    {viewRecordPage.data.submissionState.status ===
                      'UpdatedWithActuals' && (
                      <GovUK.Button
                        id="saveButton"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push({
                            pathname: `/export/submitted/export-submitted`,
                            query: { id },
                          });
                        }}
                      >
                        {t('exportJourney.updateActual.button')}
                      </GovUK.Button>
                    )}
                    <SaveReturnButton
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push({
                          pathname: `/export/estimated`,
                        });
                      }}
                    >
                      {t('exportJourney.submittedView.button')}
                    </SaveReturnButton>
                  </ButtonGroup>
                </GovUK.GridCol>
              </GovUK.GridRow>
            )}
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default UpdateRecord;
