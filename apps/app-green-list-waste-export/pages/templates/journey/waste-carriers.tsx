import React, {
  FormEvent,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
  Error404Content,
  ErrorSummary,
  Loading,
  SummaryCard,
  SummaryList,
  CountrySelector,
} from 'components';
import {
  isNotEmpty,
  validateConfirmRemove,
  validateEmail,
  validateInternationalPhone,
  validateInternationalFax,
  validateSelection,
} from 'utils/validators';
import { GetCarriersResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import useApiConfig from 'utils/useApiConfig';
enum VIEWS {
  ADDRESS_DETAILS = 1,
  CONTACT_DETAILS = 2,
  LIST = 3,
  CONFIRM_DELETE = 4,
}

interface State {
  data: GetCarriersResponse;
  carrierData: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  errors: any;
}

interface Action {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE'
    | 'DATA_DELETE_INIT'
    | 'DATA_DELETE_SUCCESS'
    | 'CARRIER_DATA_UPDATE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
}

const initialState: State = {
  data: null,
  carrierData: null,
  isLoading: true,
  isError: false,
  showView: VIEWS.ADDRESS_DETAILS,
  errors: null,
};

const carrierReducer = (state: State, action: Action) => {
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
    case 'DATA_DELETE_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'DATA_DELETE_SUCCESS':
      return {
        ...state,
        carrierData: null,
        isLoading: false,
        isError: false,
      };
    case 'CARRIER_DATA_UPDATE':
      return {
        ...state,
        carrierData: action.payload,
      };
    case 'ERRORS_UPDATE':
      return {
        ...state,
        errors: action.payload,
      };
    case 'SHOW_VIEW':
      return {
        ...state,
        errors: null,
        showView: action.payload,
      };
    default:
      throw new Error();
  }
};

const AddressField = styled(GovUK.InputField)`
  @media (min-width: 641px) {
    input {
      width: 75%;
    }
  }
`;

const TelephoneInput = styled(GovUK.Input)`
  max-width: 20.5em;
`;

const WasteCarriers = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [carrierPage, dispatchCarrierPage] = useReducer(
    carrierReducer,
    initialState
  );
  const [templateId, setTemplateId] = useState(null);
  const [showTransport, setShowTransport] = useState(false);
  const [carrierIndex, setCarrierIndex] = useState(1);
  const [carrierCount, setCarrierCount] = useState<number>(0);
  const [additionalCarrier, setAdditionalCarrier] = useState<'Yes' | 'No'>(
    null
  );
  const [confirmRemove, setConfirmRemove] = useState(null);

  const [addressDetails, setAddressDetails] = useState<{
    organisationName: string;
    address: string;
    country: string;
  }>();

  const [contactDetails, setContactDetails] = useState<{
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber: string;
  }>();

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
      setCarrierIndex(parseInt(router.query.carrierIndex?.toString()) || 0);
    }
  }, [router.isReady, router.query.templateId, router.query.carrierIndex]);

  useEffect(() => {
    setCarrierCount(carrierPage.data?.values?.length || 0);
  }, [carrierPage.data]);

  useEffect(() => {
    const index = carrierPage.data?.values.findIndex(
      (record) => record.id === carrierPage.carrierData?.id
    );
    if (index !== -1) {
      setAddressDetails(carrierPage.carrierData?.addressDetails);
      setContactDetails(carrierPage.carrierData?.contactDetails);
    }
    setCarrierIndex(index + 1);
  }, [carrierPage.carrierData]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchCarrierPage({ type: 'DATA_FETCH_INIT' });
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/carriers`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchCarrierPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              setCarrierCount(data.values?.length);
              setShowTransport(data.transport);
              dispatchCarrierPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
              if (data.status === 'Started') {
                dispatchCarrierPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.LIST,
                });
              } else {
                const emptyRecords = data.values?.filter(
                  (site) =>
                    site.addressDetails === undefined ||
                    site.contactDetails === undefined
                );
                if (emptyRecords === undefined || emptyRecords.length === 0) {
                  createCarrierRecord();
                } else {
                  const record = emptyRecords.at(-1);
                  dispatchCarrierPage({
                    type: 'CARRIER_DATA_UPDATE',
                    payload: record,
                  });
                }
              }
            }
          });
      }
    };
    fetchData();
  }, [templateId]);

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/templates/tasklist`,
      query: { templateId },
    });
  };

  const handleSubmit = useCallback(
    (e: FormEvent, form, returnToDraft = false) => {
      e.preventDefault();
      let newErrors = {};
      let nextView;
      let body;
      switch (form) {
        case 'address':
          nextView = VIEWS.CONTACT_DETAILS;
          body = {
            status: 'Started',
            values: [
              {
                ...carrierPage.carrierData,
                addressDetails: {
                  organisationName: addressDetails?.organisationName || '',
                  address: addressDetails?.address || '',
                  country: addressDetails?.country || '',
                },
              },
            ],
          };
          break;
        case 'contact':
          nextView = VIEWS.LIST;
          newErrors = {
            emailAddress: validateEmail(contactDetails?.emailAddress, true),
            phoneNumber: validateInternationalPhone(
              contactDetails?.phoneNumber,
              true
            ),
            faxNumber: validateInternationalFax(
              contactDetails?.faxNumber,
              true
            ),
          };
          body = {
            status: 'Started',
            values: [
              {
                ...carrierPage.carrierData,
                contactDetails: {
                  fullName: contactDetails?.fullName || '',
                  emailAddress: contactDetails?.emailAddress || '',
                  phoneNumber: contactDetails?.phoneNumber || '',
                  faxNumber: contactDetails?.faxNumber || '',
                },
              },
            ],
          };
          break;
      }
      body.transport = showTransport;

      if (isNotEmpty(newErrors)) {
        dispatchCarrierPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchCarrierPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchCarrierPage({ type: 'DATA_FETCH_INIT' });

        try {
          fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/carriers/${carrierPage.carrierData.id}`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify(body),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const currentData = carrierPage.data;
                let updatedData;
                if (currentData.values !== undefined) {
                  updatedData = {
                    ...currentData,
                    values: currentData.values.map((obj) => {
                      return data.values.find((o) => o.id === obj.id) || obj;
                    }),
                  };
                } else {
                  updatedData = data;
                }

                dispatchCarrierPage({
                  type: 'CARRIER_DATA_UPDATE',
                  payload: data.values[0],
                });

                dispatchCarrierPage({
                  type: 'DATA_FETCH_SUCCESS',
                  payload: updatedData,
                });

                setAdditionalCarrier(null);

                if (returnToDraft) {
                  router.push({
                    pathname: `/templates/tasklist`,
                    query: { templateId },
                  });
                } else {
                  dispatchCarrierPage({
                    type: 'SHOW_VIEW',
                    payload: nextView,
                  });
                }
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [addressDetails, contactDetails, carrierPage.data]
  );

  const handleChangeLink = (carrierId, e) => {
    e.preventDefault();
    const getRecord = carrierPage.data.values.filter(
      (record) => record.id === carrierId
    );
    dispatchCarrierPage({
      type: 'CARRIER_DATA_UPDATE',
      payload: getRecord[0],
    });

    dispatchCarrierPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.ADDRESS_DETAILS,
    });
  };

  const handleRemoveLink = (carrierId, e) => {
    e.preventDefault();
    const getRecord = carrierPage.data.values.filter(
      (record) => record.id === carrierId
    );
    dispatchCarrierPage({
      type: 'CARRIER_DATA_UPDATE',
      payload: getRecord[0],
    });

    dispatchCarrierPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM_DELETE,
    });
  };

  const handleConfirmRemove = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        confirmRemove: validateConfirmRemove(
          confirmRemove,
          t('exportJourney.wasteCarrierDetails.single')
        ),
      };
      if (isNotEmpty(newErrors)) {
        dispatchCarrierPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchCarrierPage({ type: 'ERRORS_UPDATE', payload: null });
        const callBack = () => {
          dispatchCarrierPage({
            type: 'SHOW_VIEW',
            payload: VIEWS.LIST,
          });
        };
        if (confirmRemove === 'No' && !returnToDraft) {
          callBack();
        } else if (confirmRemove === 'No' && returnToDraft) {
          router.push({
            pathname: `/templates/tasklist`,
            query: { templateId },
          });
        } else {
          dispatchCarrierPage({ type: 'DATA_DELETE_INIT' });
          try {
            fetch(
              `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/carriers/${carrierPage.carrierData.id}`,
              {
                method: 'DELETE',
                headers: apiConfig,
              }
            ).then(() => {
              const updatedValues = carrierPage.data.values.filter(
                (carrier) => carrier.id !== carrierPage.carrierData.id
              );
              dispatchCarrierPage({
                type: 'DATA_UPDATE',
                payload: { values: updatedValues },
              });
              dispatchCarrierPage({
                type: 'DATA_DELETE_SUCCESS',
              });
              dispatchCarrierPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.LIST,
              });
            });
          } catch (e) {
            console.error(e);
          }
        }
        setConfirmRemove(null);
      }
      e.preventDefault();
    },
    [confirmRemove, carrierPage.carrierData]
  );

  const handleSubmitAdditionalCarrier = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = {
      additionalCarrier: validateSelection(
        additionalCarrier,
        'if you want to add another waste carrier'
      ),
    };
    if (isNotEmpty(newErrors)) {
      dispatchCarrierPage({ type: 'ERRORS_UPDATE', payload: newErrors });
    } else {
      dispatchCarrierPage({ type: 'ERRORS_UPDATE', payload: null });
      if (additionalCarrier === 'No') {
        router.push({
          pathname: `/templates/journey/collection-details`,
          query: { templateId },
        });
      } else {
        setAdditionalCarrier(null);
        setAddressDetails(null);
        setContactDetails(null);

        const emptyCarriers = carrierPage.data.values.filter(
          (site) => site.addressDetails === undefined
        );
        if (emptyCarriers.length === 0) {
          createCarrierRecord();
        } else {
          dispatchCarrierPage({
            type: 'CARRIER_DATA_UPDATE',
            payload: emptyCarriers.at(-1),
          });
          dispatchCarrierPage({
            type: 'SHOW_VIEW',
            payload: VIEWS.ADDRESS_DETAILS,
          });
        }
      }
    }
  };

  const createCarrierRecord = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/carriers`,
        {
          method: 'POST',
          headers: apiConfig,
          body: JSON.stringify({ status: 'Started' }),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            let updatedData;
            if (carrierPage.data?.values === undefined) {
              updatedData = data;
            } else {
              updatedData = carrierPage.data;
              updatedData.values.push(data.values[0]);
            }
            dispatchCarrierPage({
              type: 'DATA_UPDATE',
              payload: updatedData,
            });
            dispatchCarrierPage({
              type: 'CARRIER_DATA_UPDATE',
              payload: data.values[0],
            });
            dispatchCarrierPage({
              type: 'SHOW_VIEW',
              payload: VIEWS.ADDRESS_DETAILS,
            });
          }
        });
    } catch (e) {
      console.error(e);
    }
  };

  const onCountryChange = (e) => {
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      country: e,
    }));
  };
  const onAddressDetailsChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      [name]: value || '',
    }));
  };

  const onContactDetailsChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((contactDetails) => ({
      ...contactDetails,
      [name]: value || '',
    }));
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (
              carrierPage.showView === VIEWS.ADDRESS_DETAILS ||
              carrierPage.showView === VIEWS.LIST
            ) {
              router.push({
                pathname: `/templates/tasklist`,
                query: { templateId },
              });
            } else {
              dispatchCarrierPage({
                type: 'SHOW_VIEW',
                payload: carrierPage.showView - 1,
              });
            }
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
        <title>{t('exportJourney.wasteCarrierDetails.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {carrierPage.isError && !carrierPage.isLoading && (
              <Error404Content />
            )}
            {carrierPage.isLoading && <Loading />}
            {!carrierPage.isError && !carrierPage.isLoading && (
              <>
                {carrierPage.errors &&
                  !!Object.keys(carrierPage.errors).length && (
                    <ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(carrierPage.errors).map((key) => ({
                        targetName: key,
                        text: carrierPage.errors[key],
                      }))}
                    />
                  )}
                <GovUK.Caption size="L">
                  {t('exportJourney.wasteCarrierDetails.title')}
                </GovUK.Caption>
                {carrierPage.showView === VIEWS.ADDRESS_DETAILS && (
                  <div id="page-waste-carrier-address-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.wasteCarrierDetails.addressTitle', {
                        n: t(`numberAdjective.${carrierIndex}`).toLowerCase(),
                      })}
                    </GovUK.Heading>
                    <form onSubmit={(e) => handleSubmit(e, 'address')}>
                      <AddressField
                        mb={6}
                        input={{
                          name: 'organisationName',
                          id: 'organisationName',
                          value: addressDetails?.organisationName || '',
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: carrierPage.errors?.organisationName,
                          touched: !!carrierPage.errors?.organisationName,
                        }}
                      >
                        {t('contact.orgName')}
                      </AddressField>
                      <GovUK.TextArea
                        mb={6}
                        input={{
                          name: 'address',
                          id: 'address',
                          value: addressDetails?.address || '',
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: carrierPage.errors?.address,
                          touched: !!carrierPage.errors?.address,
                        }}
                      >
                        {t('address')}
                      </GovUK.TextArea>
                      <CountrySelector
                        id={'country'}
                        name={'country'}
                        label={t('address.country')}
                        value={addressDetails?.country || ''}
                        size={75}
                        onChange={onCountryChange}
                        error={null}
                        apiConfig={apiConfig}
                        includeUk={true}
                      />
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonAddress">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {carrierPage.showView === VIEWS.CONTACT_DETAILS && (
                  <div id="page-waste-carrier-contact-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.wasteCarrierDetails.contactTitle', {
                        n: t(`numberAdjective.${carrierIndex}`).toLowerCase(),
                      })}
                    </GovUK.Heading>
                    <form
                      onSubmit={(e) => handleSubmit(e, 'contact')}
                      noValidate={true}
                    >
                      <GovUK.InputField
                        mb={6}
                        hint={t('contact.nameHint')}
                        input={{
                          name: 'fullName',
                          id: 'fullName',
                          value: contactDetails?.fullName || '',
                          maxLength: 250,
                          onChange: onContactDetailsChange,
                        }}
                        meta={{
                          error: carrierPage.errors?.fullName,
                          touched: !!carrierPage.errors?.fullName,
                        }}
                      >
                        {t('exportJourney.wasteCarrierDetails.contactPerson')}
                      </GovUK.InputField>
                      <GovUK.InputField
                        mb={6}
                        input={{
                          name: 'emailAddress',
                          id: 'emailAddress',
                          type: 'email',
                          value: contactDetails?.emailAddress || '',
                          maxLength: 250,
                          onChange: onContactDetailsChange,
                        }}
                        meta={{
                          error: carrierPage.errors?.emailAddress,
                          touched: !!carrierPage.errors?.emailAddress,
                        }}
                      >
                        {t('contact.emailAddress')}
                      </GovUK.InputField>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'phoneNumber'}
                          error={!!carrierPage.errors?.phoneNumber}
                        >
                          <GovUK.LabelText>
                            {t('contact.phoneNumber')}
                          </GovUK.LabelText>

                          {carrierPage.errors?.phoneNumber && (
                            <GovUK.ErrorText>
                              {carrierPage.errors?.phoneNumber}
                            </GovUK.ErrorText>
                          )}
                          <GovUK.HintText>
                            {t('contact.numberHint')}
                          </GovUK.HintText>
                          <TelephoneInput
                            name="phoneNumber"
                            id="phoneNumber"
                            value={contactDetails?.phoneNumber || ''}
                            maxLength={50}
                            type="tel"
                            error={carrierPage.errors?.phoneNumber}
                            onChange={onContactDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'faxNumber'}
                          error={!!carrierPage.errors?.faxNumber}
                        >
                          <GovUK.LabelText>
                            {t('contact.faxNumber')}
                          </GovUK.LabelText>

                          {carrierPage.errors?.faxNumber && (
                            <GovUK.ErrorText>
                              {carrierPage.errors?.faxNumber}
                            </GovUK.ErrorText>
                          )}
                          <GovUK.HintText>
                            {t('contact.numberHint')}
                          </GovUK.HintText>
                          <TelephoneInput
                            name="faxNumber"
                            id="faxNumber"
                            value={contactDetails?.faxNumber || ''}
                            maxLength={50}
                            type="tel"
                            error={carrierPage.errors?.faxNumber}
                            onChange={onContactDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonContact">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {carrierPage.showView === VIEWS.LIST && (
                  <div id="page-waste-carriers">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.wasteCarrier.carriersPage.title')}
                    </GovUK.Heading>
                    {carrierPage.data.values.map((carrier, index) => {
                      return (
                        <SummaryCard
                          key={`carrier-list-item-${index + 1}`}
                          id={`carrier-list-item-${index + 1}`}
                          title={t(
                            'exportJourney.wasteCarrier.carriersPage.cardTitle',
                            { n: t(`numberAdjective.${index + 1}`) }
                          )}
                          actions={[
                            {
                              label: (
                                <>
                                  {t('actions.change')}
                                  <GovUK.VisuallyHidden>
                                    {' '}
                                    {carrier.addressDetails?.organisationName}
                                  </GovUK.VisuallyHidden>
                                </>
                              ),
                              action: (e) => handleChangeLink(carrier.id, e),
                            },
                            {
                              label: (
                                <>
                                  {t('actions.remove')}
                                  <GovUK.VisuallyHidden>
                                    {' '}
                                    {carrier.addressDetails?.organisationName}
                                  </GovUK.VisuallyHidden>
                                </>
                              ),
                              action: (e) => handleRemoveLink(carrier.id, e),
                              hidden: carrierCount === 1,
                            },
                          ]}
                        >
                          <SummaryList
                            content={[
                              {
                                title: t('contact.orgName'),
                                definition:
                                  carrier.addressDetails?.organisationName,
                              },
                              {
                                title: t('address.country'),
                                definition: carrier.addressDetails?.country,
                              },
                            ]}
                          />
                        </SummaryCard>
                      );
                    })}
                    {carrierCount < 5 && (
                      <form onSubmit={handleSubmitAdditionalCarrier}>
                        <GovUK.Fieldset>
                          <GovUK.Fieldset.Legend size="M">
                            {t(
                              'exportJourney.wasteCarrier.carriersPage.question'
                            )}
                          </GovUK.Fieldset.Legend>
                          <GovUK.MultiChoice
                            mb={6}
                            hint={t(
                              'exportJourney.wasteCarrier.carriersPage.hint',
                              { n: 5 - carrierCount }
                            )}
                            label=""
                            meta={{
                              error: carrierPage.errors?.additionalCarrier,
                              touched: !!carrierPage.errors?.additionalCarrier,
                            }}
                          >
                            <GovUK.Radio
                              name="additionalCarrier"
                              id="additionalCarrierYes"
                              checked={additionalCarrier === 'Yes'}
                              onChange={() => setAdditionalCarrier('Yes')}
                              value="Yes"
                            >
                              {t('radio.yes')}
                            </GovUK.Radio>

                            <GovUK.Radio
                              name="additionalCarrier"
                              id="additionalCarrierNo"
                              checked={additionalCarrier === 'No'}
                              onChange={() => setAdditionalCarrier('No')}
                              value="No"
                            >
                              {t('radio.no')}
                            </GovUK.Radio>
                          </GovUK.MultiChoice>
                        </GovUK.Fieldset>
                        <ButtonGroup>
                          <GovUK.Button id="saveButton">
                            {t('saveButton')}
                          </GovUK.Button>
                          <SaveReturnButton onClick={handleCancelReturn}>
                            {t('templates.cancelReturnButton')}
                          </SaveReturnButton>
                        </ButtonGroup>
                      </form>
                    )}
                    {carrierCount === 5 && (
                      <>
                        <GovUK.Heading as="p" size={'MEDIUM'}>
                          {t(
                            'exportJourney.wasteCarrier.carriersPage.noMoreCarriers'
                          )}
                        </GovUK.Heading>
                        <ButtonGroup>
                          <GovUK.Button
                            id="saveButton"
                            onClick={() => {
                              router.push({
                                pathname: `/templates/journey/collection-details`,
                                query: { templateId },
                              });
                            }}
                          >
                            {t('saveButton')}
                          </GovUK.Button>
                          <SaveReturnButton onClick={handleCancelReturn}>
                            {t('templates.cancelReturnButton')}
                          </SaveReturnButton>
                        </ButtonGroup>
                      </>
                    )}
                  </div>
                )}
                {carrierPage.showView === VIEWS.CONFIRM_DELETE && (
                  <div id="page-waste-carriers-confirmation">
                    <form onSubmit={handleConfirmRemove}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                          {t(
                            'exportJourney.wasteCarrier.carriersPage.removeQuestion'
                          )}
                        </GovUK.Fieldset.Legend>
                        <GovUK.Paragraph>
                          {
                            carrierPage.carrierData.addressDetails
                              ?.organisationName
                          }
                        </GovUK.Paragraph>
                        <GovUK.MultiChoice
                          mb={6}
                          label=""
                          meta={{
                            error: carrierPage.errors?.confirmRemove,
                            touched: !!carrierPage.errors?.confirmRemove,
                          }}
                        >
                          <GovUK.Radio
                            name="removeTransitCountries"
                            id="removeTransitCountriesYes"
                            checked={confirmRemove === 'Yes'}
                            onChange={(e) => setConfirmRemove(e.target.value)}
                            value="Yes"
                          >
                            {t('radio.yes')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            name="removeTransitCountries"
                            id="removeTransitCountriesNo"
                            checked={confirmRemove === 'No'}
                            onChange={(e) => setConfirmRemove(e.target.value)}
                            value="No"
                          >
                            {t('radio.no')}
                          </GovUK.Radio>
                        </GovUK.MultiChoice>
                      </GovUK.Fieldset>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </div>
                )}
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default WasteCarriers;
WasteCarriers.auth = true;
