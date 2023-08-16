import React, { useEffect, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';

import {
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  DateConverter,
  Paragraph,
  SubmissionNotFound,
  Loading,
} from '../../../components';
import styled from 'styled-components';

import { GetSubmissionsResponse } from '@wts/api/waste-tracking-gateway';

type State = {
  data: GetSubmissionsResponse;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type: 'DATA_FETCH_INIT' | 'DATA_FETCH_SUCCESS' | 'DATA_FETCH_FAILURE';
  payload?: GetSubmissionsResponse;
};

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const upadateAnnex7Reducer = (state: State, action: Action) => {
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

const TableCell = styled(GovUK.Table.Cell)`
  vertical-align: top;
`;

const TableCellActions = styled(GovUK.Table.Cell)`
  vertical-align: top;
  text-align: right;
`;

const TableHeader = styled(GovUK.Table.CellHeader)`
  vertical-align: top;
`;

const UpadateAnnex7 = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [upadateAnnex7Page, dispatchUpadateAnnex7Page] = useReducer(
    upadateAnnex7Reducer,
    initialWasteDescState
  );

  useEffect(() => {
    dispatchUpadateAnnex7Page({ type: 'DATA_FETCH_INIT' });

    fetch(`${process.env.NX_API_GATEWAY_URL}/submissions`)
      .then((response) => {
        if (response.ok) return response.json();
        else {
          dispatchUpadateAnnex7Page({ type: 'DATA_FETCH_FAILURE' });
        }
      })
      .then((data) => {
        if (data !== undefined) {
          dispatchUpadateAnnex7Page({
            type: 'DATA_FETCH_SUCCESS',
            payload: data,
          });
        }
      });
  }, [router.isReady]);

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.Breadcrumbs>
          <GovUK.Breadcrumbs.Link href="/">
            {t('app.parentTitle')}
          </GovUK.Breadcrumbs.Link>
          <GovUK.Breadcrumbs.Link href="/export">
            {t('app.title')}
          </GovUK.Breadcrumbs.Link>
          {t('exportJourney.updateAnnexSeven.title')}
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.updateAnnexSeven.title')}</title>
      </Head>

      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        {upadateAnnex7Page.isError && !upadateAnnex7Page.isLoading && (
          <SubmissionNotFound />
        )}
        {upadateAnnex7Page.isLoading && <Loading />}
        {!upadateAnnex7Page.isError && !upadateAnnex7Page.isLoading && (
          <>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                <GovUK.Heading size="LARGE" id="template-heading">
                  {t('exportJourney.updateAnnexSeven.title')}
                </GovUK.Heading>

                <Paragraph>
                  {t('exportJourney.updateAnnexSeven.paragraph')}
                </Paragraph>
              </GovUK.GridCol>
            </GovUK.GridRow>
            <GovUK.GridRow>
              <GovUK.GridCol>
                <>
                  {upadateAnnex7Page.data.filter(
                    (item) =>
                      item.submissionState.status === 'SubmittedWithEstimates'
                  ).length !== 0 ? (
                    <>
                      <GovUK.Table>
                        <GovUK.Table.Row>
                          <TableHeader id="table-header-transaction-number">
                            {t(
                              'exportJourney.updateAnnexSeven.table.transactionNumber'
                            )}
                          </TableHeader>

                          <TableHeader
                            setWidth="15%"
                            id="table-header-submitted"
                          >
                            {t(
                              'exportJourney.updateAnnexSeven.table.submitted'
                            )}
                          </TableHeader>

                          <TableHeader
                            setWidth="one-half"
                            id="table-header-waste-code"
                          >
                            {t(
                              'exportJourney.updateAnnexSeven.table.wasteCode'
                            )}
                          </TableHeader>

                          <TableHeader
                            setWidth="15%"
                            id="table-header-your-own-ref"
                          >
                            {t(
                              'exportJourney.updateAnnexSeven.table.yourOwnReference'
                            )}
                          </TableHeader>

                          <TableHeader id="table-header-actions">
                            {t('exportJourney.updateAnnexSeven.table.actions')}
                          </TableHeader>
                        </GovUK.Table.Row>

                        {upadateAnnex7Page.data
                          .filter(
                            (item) =>
                              item.submissionState.status ===
                              'SubmittedWithEstimates'
                          )
                          .reverse()
                          .map((item, index) => (
                            <GovUK.Table.Row key={index}>
                              <TableCell id={'transaction-id-' + index}>
                                {item.submissionDeclaration.status ===
                                  'Complete' && (
                                  <b>
                                    {
                                      item.submissionDeclaration.values
                                        .transactionId
                                    }
                                  </b>
                                )}
                              </TableCell>

                              <TableCell id={'date-' + index}>
                                <DateConverter
                                  dateString={item.submissionState.timestamp}
                                />
                              </TableCell>

                              <TableCell id={'waste-code-' + index}>
                                {item.wasteDescription?.status ===
                                  'Complete' && (
                                  <>
                                    {item.wasteDescription?.wasteCode.type !==
                                      'NotApplicable' && (
                                      <>
                                        {item.wasteDescription?.wasteCode
                                          .value && (
                                          <span>
                                            {
                                              item.wasteDescription?.wasteCode
                                                .value
                                            }
                                          </span>
                                        )}
                                      </>
                                    )}
                                    {item.wasteDescription?.wasteCode.type ===
                                      'NotApplicable' && (
                                      <span id="waste-code-not-provided">
                                        {t(
                                          'exportJourney.updateAnnexSeven.notApplicable'
                                        )}
                                      </span>
                                    )}
                                  </>
                                )}
                              </TableCell>
                              <TableCell id={'your-reference-' + index}>
                                {' '}
                                {item.reference && (
                                  <span>{item.reference}</span>
                                )}
                                {!item.reference && (
                                  <span id="your-reference-not-provided">
                                    {t(
                                      'exportJourney.checkAnswers.notProvided'
                                    )}
                                  </span>
                                )}
                              </TableCell>
                              <TableCellActions>
                                <div>
                                  <AppLink
                                    id={'update-' + index}
                                    href={{
                                      pathname: '/export/estimated/update',
                                      query: { id: item.id },
                                    }}
                                  >
                                    Update
                                  </AppLink>
                                </div>

                                <div>
                                  <AppLink
                                    id={'cancel-' + index}
                                    href={{
                                      pathname: '/check-your-report',
                                      query: {},
                                    }}
                                  >
                                    Cancel
                                  </AppLink>
                                </div>
                              </TableCellActions>
                            </GovUK.Table.Row>
                          ))}
                      </GovUK.Table>
                    </>
                  ) : (
                    <GovUK.Heading size="SMALL">
                      {t('exportJourney.updateAnnexSeven.notResultsMessage')}
                    </GovUK.Heading>
                  )}
                </>
              </GovUK.GridCol>
            </GovUK.GridRow>
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default UpadateAnnex7;
