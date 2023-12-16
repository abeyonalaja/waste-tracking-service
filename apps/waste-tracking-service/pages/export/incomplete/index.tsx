import React, {
  useEffect,
  useReducer,
  useState,
  FormEvent,
  useRef,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

import {
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  Paragraph,
  Pagination,
  SubmissionNotFound,
  Loading,
  NotificationBanner,
} from 'components';
import styled from 'styled-components';

import { validateConfirmRemoveDocument, isNotEmpty } from 'utils/validators';
import { formatDate } from 'utils/formatDate';

type State = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  errors: null;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'PAGE_DATA_FETCH_INIT'
    | 'PAGE_DATA_FETCH_SUCCESS'
    | 'PAGE_DATA_FETCH_FAILURE'
    | 'SHOW_VIEW'
    | 'ERRORS_UPDATE'
    | 'REMOVE_WASTE_CARRIER';
  payload?: any;
};

const VIEWS = {
  LIST: 1,
  CONFIRM: 2,
};

const initialPageState: State = {
  data: null,
  isLoading: true,
  isError: false,
  showView: VIEWS.LIST,
  errors: null,
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

    case 'SHOW_VIEW':
      return {
        ...state,
        isLoading: false,
        isError: false,
        showView: action.payload,
      };
    case 'ERRORS_UPDATE':
      return {
        ...state,
        errors: action.payload,
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
`;

const TableHeader = styled(GovUK.Table.CellHeader)`
  vertical-align: top;
`;

const Action = styled.div`
  margin-bottom: 7px;
`;

const IncompleteAnnex7 = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [incompleteAnnex7Page, dispatchIncompleteAnnex7Page] = useReducer(
    incompleteAnnex7Reducer,
    initialPageState
  );

  const [item, setItem] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token);
    }
  }, [router.isReady, router.query.token]);

  useEffect(() => {
    if (router.isReady) {
      dispatchIncompleteAnnex7Page({ type: 'DATA_FETCH_INIT' });

      let url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions?state=InProgress&order=desc`;
      if (token) {
        url = `${url}&token=${token}`;
      }

      const fetchData = async () => {
        try {
          fetch(url, { headers: apiConfig })
            .then((response) => {
              if (response.ok) return response.json();
              else {
                if (response.status === 403) {
                  router.push({
                    pathname: `/403/`,
                  });
                }
                dispatchIncompleteAnnex7Page({ type: 'DATA_FETCH_FAILURE' });
              }
            })
            .then((data) => {
              let filteredData;
              if (data) {
                filteredData = data;
              }

              dispatchIncompleteAnnex7Page({
                type: 'DATA_FETCH_SUCCESS',
                payload: filteredData,
              });
            });
        } catch (e) {
          console.error(e);
        }
      };
      fetchData();
    }
  }, [router.isReady, token]);

  const handleRemove = (e, item) => {
    setItem(item);
    dispatchIncompleteAnnex7Page({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM,
    });
    e.preventDefault();
  };

  const handleConfirmSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = {
      confirm: validateConfirmRemoveDocument(confirm),
    };
    if (isNotEmpty(newErrors)) {
      dispatchIncompleteAnnex7Page({
        type: 'ERRORS_UPDATE',
        payload: newErrors,
      });
    } else {
      if (confirm === 'no') {
        dispatchIncompleteAnnex7Page({
          type: 'SHOW_VIEW',
          payload: VIEWS.LIST,
        });
        setConfirm(null);
        dispatchIncompleteAnnex7Page({ type: 'ERRORS_UPDATE', payload: null });
      }
      if (confirm === 'yes') {
        dispatchIncompleteAnnex7Page({ type: 'ERRORS_UPDATE', payload: null });
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${item.id}?action=DELETE`,
            {
              method: 'DELETE',
              headers: apiConfig,
            }
          ).then(() => {
            const newData = incompleteAnnex7Page.data;
            newData.values = newData.values.filter((wc) => wc.id !== item.id);
            dispatchIncompleteAnnex7Page({
              type: 'DATA_FETCH_SUCCESS',
              payload: newData,
            });
            dispatchIncompleteAnnex7Page({
              type: 'SHOW_VIEW',
              payload: VIEWS.LIST,
            });
            handleDeleteClick();
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  };
  const handleDeleteClick = () => {
    setShowNotification(!showNotification);
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        {incompleteAnnex7Page.showView === VIEWS.LIST ? (
          <GovUK.Breadcrumbs>
            <GovUK.Breadcrumbs.Link href="/" id="index-link">
              {t('app.parentTitle')}
            </GovUK.Breadcrumbs.Link>
            <GovUK.Breadcrumbs.Link href="/export" id="glw-index-link">
              {t('app.title')}
            </GovUK.Breadcrumbs.Link>
            {t('exportJourney.incompleteAnnexSeven.title')}
          </GovUK.Breadcrumbs>
        ) : (
          <GovUK.BackLink
            href="#"
            onClick={() => {
              dispatchIncompleteAnnex7Page({
                type: 'SHOW_VIEW',
                payload: VIEWS.LIST,
              });
            }}
          >
            Back
          </GovUK.BackLink>
        )}
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
            {incompleteAnnex7Page.showView === VIEWS.LIST ? (
              <>
                <GovUK.GridRow>
                  <GovUK.GridCol setWidth="two-thirds">
                    {showNotification && (
                      <div ref={notificationRef}>
                        <NotificationBanner
                          type="success"
                          id="delete-success-banner"
                          headingText={
                            item.reference === null
                              ? t(
                                  'exportJourney.incompleteAnnexSeven.delete.notification'
                                )
                              : `${item.reference} ${t(
                                  'exportJourney.incompleteAnnexSeven.delete.notificationRef'
                                )}`
                          }
                        />
                      </div>
                    )}
                    <GovUK.Heading size="LARGE" id="template-heading">
                      {t('exportJourney.incompleteAnnexSeven.title')}
                    </GovUK.Heading>

                    <Paragraph>
                      {t('exportJourney.incompleteAnnexSeven.paragraph')}
                    </Paragraph>
                  </GovUK.GridCol>
                </GovUK.GridRow>
                {incompleteAnnex7Page.data === undefined ||
                incompleteAnnex7Page.data.values.length === 0 ? (
                  <>
                    <GovUK.Heading size="SMALL">
                      {t(
                        'exportJourney.incompleteAnnexSeven.notResultsMessage'
                      )}
                    </GovUK.Heading>
                  </>
                ) : (
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
                          {t('exportJourney.updateAnnexSeven.table.wasteCode')}
                        </TableHeader>

                        <TableHeader setWidth="10%" id="table-header-actions">
                          {t('exportJourney.updateAnnexSeven.table.actions')}
                        </TableHeader>
                      </GovUK.Table.Row>

                      {incompleteAnnex7Page.data.values.map((item, index) => (
                        <GovUK.Table.Row key={index}>
                          <TableCell id={'your-reference-' + index}>
                            {' '}
                            {item.reference && <span>{item.reference}</span>}
                            {!item.reference && (
                              <span id="your-reference-not-provided">
                                {t('exportJourney.checkAnswers.notProvided')}
                              </span>
                            )}
                          </TableCell>

                          <TableCell id={'date-' + index}>
                            {formatDate(item.submissionState.timestamp)}
                          </TableCell>

                          <TableCell id={'waste-code-' + index}>
                            {item.wasteDescription?.status === 'Complete' && (
                              <>
                                {item.wasteDescription?.wasteCode.type !==
                                  'NotApplicable' && (
                                  <>
                                    {item.wasteDescription?.wasteCode.value && (
                                      <span>
                                        {item.wasteDescription?.wasteCode.value}
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
                            <Action>
                              <AppLink
                                id={'continue-link-' + index}
                                href={{
                                  pathname: '/export/incomplete/tasklist',
                                  query: { id: item.id },
                                }}
                              >
                                {t('continueButton')}
                              </AppLink>
                            </Action>

                            <AppLink
                              id={'delete-link-' + index}
                              onClick={(e) => handleRemove(e, item)}
                              href="#"
                            >
                              {t('deleteButton')}
                            </AppLink>
                          </TableCellActions>
                        </GovUK.Table.Row>
                      ))}
                    </GovUK.Table>
                    <Pagination
                      url="/export/incomplete"
                      pages={incompleteAnnex7Page.data.pages}
                      currentPage={incompleteAnnex7Page.data.currentPage}
                      totalPages={incompleteAnnex7Page.data.totalPages}
                    />
                  </>
                )}
              </>
            ) : null}

            {incompleteAnnex7Page.showView === VIEWS.CONFIRM ? (
              <form onSubmit={handleConfirmSubmit}>
                <GovUK.GridRow>
                  <GovUK.GridCol setWidth="two-thirds">
                    {incompleteAnnex7Page.errors &&
                      !!Object.keys(incompleteAnnex7Page.errors).length && (
                        <GovUK.ErrorSummary
                          heading={t('errorSummary.title')}
                          errors={Object.keys(incompleteAnnex7Page.errors).map(
                            (key) => ({
                              targetName: key,
                              text: incompleteAnnex7Page.errors[key],
                            })
                          )}
                        />
                      )}

                    {item.reference && (
                      <GovUK.Caption>
                        {t('exportJourney.incompleteAnnexSeven.delete.caption')}
                        {item.reference}
                      </GovUK.Caption>
                    )}
                    <GovUK.Fieldset>
                      <GovUK.Fieldset.Legend size="LARGE" isPageHeading>
                        {t('exportJourney.incompleteAnnexSeven.delete.title')}
                      </GovUK.Fieldset.Legend>
                    </GovUK.Fieldset>

                    <GovUK.FormGroup>
                      <GovUK.MultiChoice
                        label=""
                        meta={{
                          error: incompleteAnnex7Page.errors?.confirm,
                          touched: !!incompleteAnnex7Page.errors?.confirm,
                        }}
                      >
                        <GovUK.Radio
                          name="confirm-delete"
                          onChange={() => setConfirm('yes')}
                        >
                          {t('radio.yes')}
                        </GovUK.Radio>
                        <GovUK.Radio
                          name="confirm-delete"
                          onChange={() => setConfirm('no')}
                        >
                          {t('radio.no')}
                        </GovUK.Radio>
                      </GovUK.MultiChoice>
                    </GovUK.FormGroup>
                    <GovUK.Button id="saveButton">
                      {t('exportJourney.incompleteAnnexSeven.delete.button')}
                    </GovUK.Button>
                  </GovUK.GridCol>
                </GovUK.GridRow>
              </form>
            ) : null}
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default IncompleteAnnex7;
