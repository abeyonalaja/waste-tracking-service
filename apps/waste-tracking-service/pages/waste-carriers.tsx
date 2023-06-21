import React, { FormEvent, useReducer, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
  WasteCarrierHeading,
} from '../components';
import { isNotEmpty, validateConfirmRemoveCarrier } from '../utils/validators';
import { GetCarriersResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';

const SmallHeading = styled(GovUK.Caption)`
  margin-bottom: 0;
`;

type State = {
  data: GetCarriersResponse;
  isLoading: boolean;
  isError: boolean;
  isReadyToUpdate: boolean;
  showView: number;
  errors: {
    confirmRemove?: string;
  };
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATED_SUCCESS'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW'
    | 'REMOVE_WASTE_CARRIER';
  payload?: any;
};

const VIEWS = {
  LIST: 1,
  CONFIRM: 2,
};
const initialState: State = {
  isLoading: true,
  isError: false,
  data: {
    status: 'NotStarted',
    transport: true,
  },
  isReadyToUpdate: false,
  showView: VIEWS.LIST,
  errors: null,
};

const wasteCarriersReducer = (state: State, action: Action) => {
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
    case 'DATA_UPDATED_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        showView: VIEWS.LIST,
      };
    case 'ERRORS_UPDATE':
      return {
        ...state,
        errors: action.payload,
      };
    case 'SHOW_VIEW':
      return {
        ...state,
        isLoading: false,
        isError: false,
        showView: action.payload,
      };
    case 'REMOVE_WASTE_CARRIER':
      return {
        ...state,
        data: action.payload,
      };
    default:
      throw new Error();
  }
};

const WasteCarriers = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);

  const [wasteCarriersPage, dispatchWasteCarriersPage] = useReducer(
    wasteCarriersReducer,
    initialState
  );

  const [item, setItem] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchWasteCarriersPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchWasteCarriersPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchWasteCarriersPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, id]);

  const createAnotherCarrierRecord = () => {
    try {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Started' }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            router.push({
              pathname: '/waste-carrier-details',
              query: { id, carrierId: data.values[0].id },
            });
          }
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = (index) => {
    setItem(index);
    dispatchWasteCarriersPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM,
    });
  };

  const handleConfirmSubmit = (e: FormEvent) => {
    const newErrors = {
      confirm: validateConfirmRemoveCarrier(confirm),
    };
    if (isNotEmpty(newErrors)) {
      dispatchWasteCarriersPage({ type: 'ERRORS_UPDATE', payload: newErrors });
    } else {
      if (confirm === 'no') {
        dispatchWasteCarriersPage({
          type: 'SHOW_VIEW',
          payload: VIEWS.LIST,
        });
        setConfirm(null);
        dispatchWasteCarriersPage({ type: 'ERRORS_UPDATE', payload: null });
      }
      if (confirm === 'yes') {
        const newValues = wasteCarriersPage.data.values.filter(
          (wc) => wc.id !== item.id
        );
        const newData = { ...wasteCarriersPage.data, values: newValues };
        dispatchWasteCarriersPage({ type: 'ERRORS_UPDATE', payload: null });
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers/${item.id}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          ).then(() => {
            dispatchWasteCarriersPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: newData,
            });
            dispatchWasteCarriersPage({
              type: 'SHOW_VIEW',
              payload: VIEWS.LIST,
            });
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    e.preventDefault();
  };

  const handleLinkSubmit = () => {
    router.push({
      pathname: '/submit-an-export-tasklist',
      query: { id: router.query.id },
    });
  };

  const handleRedirect = (e) => {
    if (selectedOption === 'no') {
      router.push({
        pathname: '/waste-collection',
        query: { id: router.query.id },
      });
    } else if (selectedOption === 'yes') {
      createAnotherCarrierRecord();
    }
    e.preventDefault();
  };

  const numberLeft = (
    5 - (wasteCarriersPage.data.values?.length ?? 0)
  ).toString();

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: '/submit-an-export-tasklist',
              query: { id },
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
        <title>{t('exportJourney.exporterPostcode.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {wasteCarriersPage.errors &&
              !!Object.keys(wasteCarriersPage.errors).length && (
                <GovUK.ErrorSummary
                  heading={t('errorSummary.title')}
                  errors={Object.keys(wasteCarriersPage.errors).map((key) => ({
                    targetName: key,
                    text: wasteCarriersPage.errors[key],
                  }))}
                />
              )}
            <>
              {wasteCarriersPage.showView === VIEWS.LIST ? (
                <>
                  {' '}
                  <SmallHeading>
                    {t('exportJourney.wasteCarrierDetails.title')}
                  </SmallHeading>
                  <GovUK.Heading size={'LARGE'}>
                    {t('exportJourney.wasteCarrier.carriersPage.title')}
                  </GovUK.Heading>
                  {wasteCarriersPage.data.values?.map((item, index) => (
                    <div
                      className="govuk-summary-card"
                      key={index}
                      id={'carrier-card-' + index}
                    >
                      <div className="govuk-summary-card__title-wrapper">
                        <h2 className="govuk-summary-card__title">
                          <WasteCarrierHeading
                            index={index}
                            noOfCarriers={wasteCarriersPage.data.values.length}
                          />
                        </h2>
                        <ul className="govuk-summary-card__actions">
                          <li className="govuk-summary-card__action">
                            {' '}
                            <AppLink
                              href={
                                '/waste-carrier-details?id=' +
                                router.query.id +
                                '&carrierId=' +
                                item.id
                              }
                              isBold={true}
                            >
                              Change
                              <GovUK.VisuallyHidden>
                                {' '}
                                {item.addressDetails?.organisationName}
                              </GovUK.VisuallyHidden>
                            </AppLink>
                          </li>
                          {wasteCarriersPage.data.values.length > 1 ? (
                            <li className="govuk-summary-card__action">
                              {' '}
                              <AppLink
                                href="#"
                                isBold={true}
                                onClick={(e) => handleRemove(item)}
                              >
                                Remove
                                <GovUK.VisuallyHidden>
                                  {' '}
                                  {item.addressDetails?.organisationName}
                                </GovUK.VisuallyHidden>
                              </AppLink>
                            </li>
                          ) : (
                            ''
                          )}
                        </ul>
                      </div>
                      <div className="govuk-summary-card__content">
                        <dl className="govuk-summary-list">
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">
                              Organisation name
                            </dt>
                            <dd className="govuk-summary-list__value">
                              {item.addressDetails?.organisationName}
                            </dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Country</dt>
                            <dd className="govuk-summary-list__value">
                              {item.addressDetails?.country}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  ))}
                  {wasteCarriersPage.data.values?.length === 5 ? (
                    <>
                      <GovUK.Heading size={'SMALL'}>
                        {t(
                          'exportJourney.wasteCarrier.carriersPage.noMoreCarriers'
                        )}
                      </GovUK.Heading>
                      <form onSubmit={handleLinkSubmit}>
                        <ButtonGroup>
                          <GovUK.Button id="saveButton">
                            {t('saveButton')}
                          </GovUK.Button>
                          <SaveReturnButton onClick={handleLinkSubmit} />
                        </ButtonGroup>
                      </form>
                    </>
                  ) : (
                    <>
                      <GovUK.Heading size={'MEDIUM'}>
                        {t('exportJourney.wasteCarrier.carriersPage.question')}
                      </GovUK.Heading>
                      <GovUK.Paragraph id="item-to-delete">
                        {t('exportJourney.wasteCarrier.carriersPage.hint', {
                          n: numberLeft,
                        })}
                      </GovUK.Paragraph>
                      <form onSubmit={handleRedirect}>
                        <GovUK.FormGroup>
                          <GovUK.Radio
                            id="delete-yes"
                            name="group1"
                            value="yes"
                            checked={selectedOption === 'yes'}
                            onChange={handleOptionChange}
                          >
                            {t('radio.yes')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            id="delete-no"
                            name="group1"
                            value="no"
                            checked={selectedOption === 'no'}
                            onChange={handleOptionChange}
                          >
                            {t('radio.no')}
                          </GovUK.Radio>
                        </GovUK.FormGroup>
                        <ButtonGroup>
                          <GovUK.Button id="saveButton">
                            {t('saveButton')}
                          </GovUK.Button>
                          <SaveReturnButton onClick={handleLinkSubmit} />
                        </ButtonGroup>
                      </form>
                    </>
                  )}
                </>
              ) : null}
              {wasteCarriersPage.showView === VIEWS.CONFIRM ? (
                <form onSubmit={handleConfirmSubmit}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend size="LARGE" isPageHeading>
                      {t(
                        'exportJourney.wasteCarrier.carriersPage.removeQuestion'
                      )}
                    </GovUK.Fieldset.Legend>
                  </GovUK.Fieldset>
                  <GovUK.Paragraph>
                    {item.addressDetails?.organisationName}
                  </GovUK.Paragraph>
                  <GovUK.FormGroup>
                    <GovUK.MultiChoice
                      label=""
                      meta={{
                        error: wasteCarriersPage.errors?.confirm,
                        touched: !!wasteCarriersPage.errors?.confirm,
                      }}
                    >
                      <GovUK.Radio
                        inline
                        name="confirm-delete"
                        onChange={() => setConfirm('yes')}
                      >
                        {t('radio.yes')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        inline
                        name="confirm-delete"
                        onChange={() => setConfirm('no')}
                      >
                        {t('radio.no')}
                      </GovUK.Radio>
                    </GovUK.MultiChoice>
                  </GovUK.FormGroup>
                  <GovUK.Button id="saveButton">{t('saveButton')}</GovUK.Button>
                </form>
              ) : null}
            </>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};
export default WasteCarriers;
