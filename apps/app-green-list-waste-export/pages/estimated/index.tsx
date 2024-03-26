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

import {
  AppLink,
  Footer,
  Header,
  BreadCrumbLink,
  BreadcrumbWrap,
  ButtonGroup,
  ErrorSummary,
  Paragraph,
  Pagination,
  SubmissionNotFound,
  Loading,
  NotificationBanner,
  ConditionalRadioWrap,
  SaveReturnButton,
  TextareaCharCount,
} from 'components';
import styled from 'styled-components';

import {
  validateConfirmCancelReason,
  validateConfirmCancelDocument,
  isNotEmpty,
} from 'utils/validators';
import { formatDate } from 'utils/formatDate';

import useRefDataLookup from '../../utils/useRefDataLookup';
import useApiConfig from 'utils/useApiConfig';

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
    | 'SHOW_VIEW'
    | 'DATA_UPDATE'
    | 'ERRORS_UPDATE'
    | 'CANCEL_WASTE_CARRIER';
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

const updateAnnex7Reducer = (state: State, action: Action) => {
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
    case 'DATA_UPDATE':
      return {
        ...state,
        data: { ...state.data, submissionState: action.payload },
      };
    case 'ERRORS_UPDATE':
      return {
        ...state,
        errors: action.payload,
      };
    case 'CANCEL_WASTE_CARRIER':
      return {
        ...state,
        data: action.payload,
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

const UpdateAnnex7 = () => {
  const { t } = useTranslation();
  const apiConfig = useApiConfig();
  const getRefData = useRefDataLookup(apiConfig);
  const router = useRouter();
  const [updateAnnex7Page, dispatchUpdateAnnex7Page] = useReducer(
    updateAnnex7Reducer,
    initialPageState
  );
  const [item, setItem] = useState(null);
  const [type, setType] = useState(null);
  const [reason, setReason] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef(null);

  const [paginationToken, setPaginationToken] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setPaginationToken(router.query.paginationToken || 'NO_TOKEN_SET');
    }
  }, [router.isReady, router.query.paginationToken]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchUpdateAnnex7Page({ type: 'DATA_FETCH_INIT' });
      let url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions?state=SubmittedWithEstimates&order=desc`;
      if (paginationToken !== 'NO_TOKEN_SET') {
        url = `${url}&paginationToken=${paginationToken}`;
      }
      await fetch(url, { headers: apiConfig })
        .then((response) => {
          if (response.ok) return response.json();
          else {
            if (response.status === 403) {
              router.push({
                pathname: `/403/`,
              });
            }
            dispatchUpdateAnnex7Page({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          let filteredData;
          if (data) {
            filteredData = data;
          }
          dispatchUpdateAnnex7Page({
            type: 'DATA_FETCH_SUCCESS',
            payload: filteredData,
          });
        });
    };
    if (paginationToken) {
      fetchData();
    }
  }, [paginationToken]);

  const doNotCancel = () => {
    dispatchUpdateAnnex7Page({
      type: 'SHOW_VIEW',
      payload: VIEWS.LIST,
    });
    setType(null);
    setReason(null);
    setShowNotification(false);
    dispatchUpdateAnnex7Page({ type: 'ERRORS_UPDATE', payload: null });
  };

  const handleRemove = (e, item) => {
    setItem(item);
    dispatchUpdateAnnex7Page({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM,
    });
    setType(null); // reset the type, so the radio button is unchecked if user tries to cancel another record
    e.preventDefault();
  };

  const handleConfirmSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = {
      type: validateConfirmCancelDocument(type),
      reason: validateConfirmCancelReason(type, reason),
    };
    if (isNotEmpty(newErrors)) {
      dispatchUpdateAnnex7Page({
        type: 'ERRORS_UPDATE',
        payload: newErrors,
      });
    } else {
      const body: any = {
        type: type,
      };
      if (type === 'Other') {
        body.reason = reason;
      }

      dispatchUpdateAnnex7Page({ type: 'ERRORS_UPDATE', payload: null });

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${item.id}/cancel`,
          {
            method: 'PUT',
            headers: apiConfig,
            body: JSON.stringify(body),
          }
        ).then(() => {
          const newData = updateAnnex7Page.data;
          newData.values = newData.values.filter((wc) => wc.id !== item.id);
          setShowNotification(true);
          dispatchUpdateAnnex7Page({
            type: 'DATA_FETCH_SUCCESS',
            payload: newData,
          });
          dispatchUpdateAnnex7Page({
            type: 'SHOW_VIEW',
            payload: VIEWS.LIST,
          });
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const BreadCrumbs = () => {
    const { t } = useTranslation();
    return (
      <BreadcrumbWrap>
        {updateAnnex7Page.showView === VIEWS.LIST ? (
          <GovUK.Breadcrumbs>
            <BreadCrumbLink href="/">{t('app.parentTitle')}</BreadCrumbLink>
            <BreadCrumbLink href="/">{t('app.title')}</BreadCrumbLink>
            {t('exportJourney.updateAnnexSeven.title')}
          </GovUK.Breadcrumbs>
        ) : (
          <GovUK.BackLink
            href="#"
            onClick={() => {
              dispatchUpdateAnnex7Page({
                type: 'SHOW_VIEW',
                payload: VIEWS.LIST,
              });
            }}
          >
            {t('Back')}
          </GovUK.BackLink>
        )}
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
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {updateAnnex7Page.isError && !updateAnnex7Page.isLoading && (
          <SubmissionNotFound />
        )}
        {updateAnnex7Page.isLoading && <Loading />}
        {!updateAnnex7Page.isError && !updateAnnex7Page.isLoading && (
          <>
            {updateAnnex7Page.showView === VIEWS.LIST ? (
              <>
                <GovUK.GridRow>
                  <GovUK.GridCol setWidth="two-thirds">
                    {showNotification && (
                      <div ref={notificationRef}>
                        <NotificationBanner
                          type="success"
                          id="cancel-success-banner"
                          headingText={
                            item.reference === null
                              ? t(
                                  'exportJourney.updateAnnexSeven.delete.notification'
                                )
                              : `${item.reference} ${t(
                                  'exportJourney.updateAnnexSeven.delete.notificationRef'
                                )}`
                          }
                        />
                      </div>
                    )}

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
                    {updateAnnex7Page.data === undefined ||
                    updateAnnex7Page.data.values.length === 0 ? (
                      <>
                        <GovUK.Heading size="SMALL">
                          {t(
                            'exportJourney.updateAnnexSeven.notResultsMessage'
                          )}
                        </GovUK.Heading>
                      </>
                    ) : (
                      <>
                        <GovUK.Table>
                          <GovUK.Table.Row>
                            <TableHeader
                              id="table-header-transaction-number"
                              scope="col"
                            >
                              {t(
                                'exportJourney.updateAnnexSeven.table.transactionNumber'
                              )}
                            </TableHeader>

                            <TableHeader
                              setWidth="15%"
                              id="table-header-submitted"
                              scope="col"
                            >
                              {t(
                                'exportJourney.updateAnnexSeven.table.submitted'
                              )}
                            </TableHeader>

                            <TableHeader
                              setWidth="one-half"
                              id="table-header-waste-code"
                              scope="col"
                            >
                              {t(
                                'exportJourney.updateAnnexSeven.table.wasteCode'
                              )}
                            </TableHeader>

                            <TableHeader
                              setWidth="15%"
                              id="table-header-your-own-ref"
                              scope="col"
                            >
                              {t(
                                'exportJourney.updateAnnexSeven.table.yourOwnReference'
                              )}
                            </TableHeader>

                            <TableHeader id="table-header-actions" scope="col">
                              {t(
                                'exportJourney.updateAnnexSeven.table.actions'
                              )}
                            </TableHeader>
                          </GovUK.Table.Row>

                          {updateAnnex7Page.data.values.map((item, index) => (
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
                                {formatDate(item.submissionState.timestamp)}
                              </TableCell>

                              <TableCell id={'waste-code-' + index}>
                                {item.wasteDescription?.status ===
                                  'Complete' && (
                                  <>
                                    {item.wasteDescription?.wasteCode.type !==
                                      'NotApplicable' && (
                                      <>
                                        <strong>
                                          {
                                            item.wasteDescription?.wasteCode
                                              .code
                                          }
                                          :{' '}
                                        </strong>
                                        {getRefData(
                                          'WasteCode',
                                          item.wasteDescription?.wasteCode.code,
                                          item.wasteDescription?.wasteCode.type
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
                                <Action>
                                  <AppLink
                                    id={'update-' + index}
                                    href={{
                                      pathname: '/estimated/update',
                                      query: { id: item.id },
                                    }}
                                  >
                                    {t('updateButton')}
                                  </AppLink>
                                </Action>

                                <AppLink
                                  id={'cancel-link-' + index}
                                  onClick={(e) => handleRemove(e, item)}
                                  href="#"
                                >
                                  {t('cancelButton')}
                                </AppLink>
                              </TableCellActions>
                            </GovUK.Table.Row>
                          ))}
                        </GovUK.Table>
                        <Pagination
                          url="/estimated"
                          pages={updateAnnex7Page.data.pages}
                          currentPage={updateAnnex7Page.data.currentPage}
                          totalPages={updateAnnex7Page.data.totalPages}
                        />
                      </>
                    )}
                  </GovUK.GridCol>
                </GovUK.GridRow>
              </>
            ) : null}

            {updateAnnex7Page.showView === VIEWS.CONFIRM ? (
              <form onSubmit={handleConfirmSubmit}>
                <GovUK.GridRow>
                  <GovUK.GridCol setWidth="two-thirds">
                    {updateAnnex7Page.errors &&
                      !!Object.keys(updateAnnex7Page.errors).length && (
                        <ErrorSummary
                          heading={t('errorSummary.title')}
                          errors={Object.keys(updateAnnex7Page.errors).map(
                            (key) => ({
                              targetName: key,
                              text: updateAnnex7Page.errors[key],
                            })
                          )}
                        />
                      )}

                    {item.submissionDeclaration.values.transactionId && (
                      <GovUK.Caption>
                        {t('exportJourney.updateAnnexSeven.delete.caption')}
                        {item.submissionDeclaration.values.transactionId}
                      </GovUK.Caption>
                    )}
                    <GovUK.Fieldset>
                      <GovUK.Fieldset.Legend size="LARGE" isPageHeading>
                        {t('exportJourney.updateAnnexSeven.delete.title')}
                      </GovUK.Fieldset.Legend>
                    </GovUK.Fieldset>
                    <GovUK.Paragraph>
                      {t('exportJourney.updateAnnexSeven.delete.paragraph')}
                    </GovUK.Paragraph>
                    <GovUK.FormGroup>
                      <GovUK.MultiChoice
                        label=""
                        meta={{
                          error: updateAnnex7Page.errors?.type,
                          touched: !!updateAnnex7Page.errors?.type,
                        }}
                      >
                        <GovUK.Radio
                          id="change-of-recovery-facility-or-laboratory"
                          name="confirm-cancel"
                          checked={
                            type === 'ChangeOfRecoveryFacilityOrLaboratory'
                          }
                          onChange={() =>
                            setType('ChangeOfRecoveryFacilityOrLaboratory')
                          }
                        >
                          {t('exportJourney.updateAnnexSeven.delete.q1')}
                        </GovUK.Radio>
                        <GovUK.Radio
                          id="no-longer-exporting-waste"
                          name="confirm-cancel"
                          checked={type === 'NoLongerExportingWaste'}
                          onChange={() => setType('NoLongerExportingWaste')}
                        >
                          {t('exportJourney.updateAnnexSeven.delete.q2')}
                        </GovUK.Radio>
                        <GovUK.Radio
                          id="other"
                          name="confirm-cancel"
                          checked={type === 'Other'}
                          onChange={() => setType('Other')}
                        >
                          {t('exportJourney.updateAnnexSeven.delete.q3')}
                        </GovUK.Radio>

                        {type === 'Other' && (
                          <ConditionalRadioWrap>
                            <TextareaCharCount
                              id="reason"
                              name="reason"
                              onChange={(e) => setReason(e.target.value)}
                              errorMessage={updateAnnex7Page.errors?.reason}
                              charCount={100}
                              rows={3}
                              value={reason}
                            >
                              <GovUK.LabelText>
                                {t(
                                  'exportJourney.updateAnnexSeven.delete.q3.additionalText'
                                )}
                              </GovUK.LabelText>
                            </TextareaCharCount>
                          </ConditionalRadioWrap>
                        )}
                      </GovUK.MultiChoice>
                    </GovUK.FormGroup>
                    <ButtonGroup>
                      <GovUK.Button id="saveButton">
                        {t('exportJourney.updateAnnexSeven.delete.button')}
                      </GovUK.Button>
                      <SaveReturnButton onClick={doNotCancel}>
                        {t('returnToAnnexs')}
                      </SaveReturnButton>
                    </ButtonGroup>
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

export default UpdateAnnex7;
UpdateAnnex7.auth = true;
