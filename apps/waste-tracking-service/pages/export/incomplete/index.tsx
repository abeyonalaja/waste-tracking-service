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

const incompleteAnnex7Reducer = (state: State, action: Action) => {
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

const Actions = styled.div`
  float: right;
`;

const Action = styled.div`
  padding-bottom: 5px;
`;

const IncompleteAnnex7 = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [incompleteAnnex7Page, dispatchIncompleteAnnex7Page] = useReducer(
    incompleteAnnex7Reducer,
    initialWasteDescState
  );

  useEffect(() => {
    dispatchIncompleteAnnex7Page({ type: 'DATA_FETCH_INIT' });

    fetch(`${process.env.NX_API_GATEWAY_URL}/submissions`)
      .then((response) => {
        if (response.ok) return response.json();
        else {
          dispatchIncompleteAnnex7Page({ type: 'DATA_FETCH_FAILURE' });
        }
      })
      .then((data) => {
        if (data !== undefined) {
          dispatchIncompleteAnnex7Page({
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
          {t('exportJourney.incompleteAnnexSeven.title')}
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.incompleteAnnexSeven.title')}</title>
      </Head>

      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        {incompleteAnnex7Page.isError && !incompleteAnnex7Page.isLoading && (
          <SubmissionNotFound />
        )}
        {incompleteAnnex7Page.isLoading && <Loading />}
        {!incompleteAnnex7Page.isError && !incompleteAnnex7Page.isLoading && (
          <>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                <GovUK.Heading size="LARGE" id="template-heading">
                  {t('exportJourney.incompleteAnnexSeven.title')}
                </GovUK.Heading>

                <Paragraph>
                  {t('exportJourney.incompleteAnnexSeven.paragraph')}
                </Paragraph>
              </GovUK.GridCol>
            </GovUK.GridRow>
            <GovUK.GridRow>
              <GovUK.GridCol>
                <>
                  {incompleteAnnex7Page.data.filter(
                    (item) => item.submissionState.status === 'InProgress'
                  ).length !== 0 ? (
                    <>
                      <GovUK.Table>
                        <GovUK.Table.Row>
                          <TableHeader
                            setWidth="15%"
                            id="table-header-your-own-ref"
                          >
                            {t(
                              'exportJourney.updateAnnexSeven.table.yourOwnReference'
                            )}
                          </TableHeader>

                          <TableHeader
                            setWidth="15%"
                            id="table-header-last-saved"
                          >
                            {t('exportJourney.incompleteAnnexSeven.table.date')}
                          </TableHeader>

                          <TableHeader
                            setWidth="60%"
                            id="table-header-waste-code"
                          >
                            {t(
                              'exportJourney.updateAnnexSeven.table.wasteCode'
                            )}
                          </TableHeader>

                          <TableHeader setWidth="10%" id="table-header-actions">
                            <Actions>
                              {t(
                                'exportJourney.updateAnnexSeven.table.actions'
                              )}
                            </Actions>
                          </TableHeader>
                        </GovUK.Table.Row>

                        {incompleteAnnex7Page.data
                          .filter(
                            (item) =>
                              item.submissionState.status === 'InProgress'
                          )
                          .reverse()
                          .map((item, index) => (
                            <GovUK.Table.Row key={index}>
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

                              <TableCellActions>
                                <Actions>
                                  <Action>
                                    <AppLink
                                      id={'continue-link-' + index}
                                      href={{
                                        pathname: '/export/incomplete/tasklist',
                                        query: { id: item.id },
                                      }}
                                    >
                                      Continue
                                    </AppLink>
                                  </Action>
                                </Actions>
                                <Actions>
                                  <AppLink
                                    id={'delete-link-' + index}
                                    href={{
                                      pathname: '/check-your-report',
                                      query: {},
                                    }}
                                  >
                                    Delete
                                  </AppLink>
                                </Actions>
                              </TableCellActions>
                            </GovUK.Table.Row>
                          ))}
                      </GovUK.Table>
                    </>
                  ) : (
                    <GovUK.Heading size="SMALL">
                      {t(
                        'exportJourney.incompleteAnnexSeven.notResultsMessage'
                      )}
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

export default IncompleteAnnex7;
