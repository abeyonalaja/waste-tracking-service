import React, {
  FormEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  ButtonGroup,
  SaveReturnButton,
  SubmissionNotFound,
  Loading,
  SummaryCard,
  Paragraph,
} from '../components';
import {
  isNotEmpty,
  validateRecoveryFacilityName,
  validateAddress,
  validateCountry,
  validateEmail,
  validateFullName,
  validatePhone,
  validateRecoveryCode,
} from '../utils/validators';

import styled from 'styled-components';
import { GetRecoveryFacilityDetailResponse } from '@wts/api/waste-tracking-gateway';
import Autocomplete from 'accessible-autocomplete/react';
import { recoveryData } from '../utils/recoveryData';

const VIEWS = {
  ADDRESS_DETAILS: 1,
  CONTACT_DETAILS: 2,
  RECOVERY_CODE: 3,
  LIST: 4,
};

type State = {
  data: GetRecoveryFacilityDetailResponse;
  facilityData: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  errors: any;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE'
    | 'FACILITY_DATA_UPDATE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
};

const initialState: State = {
  data: null,
  facilityData: null,
  isLoading: true,
  isError: false,
  showView: VIEWS.ADDRESS_DETAILS,
  errors: null,
};

const recoveryReducer = (state: State, action: Action) => {
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
    case 'FACILITY_DATA_UPDATE':
      return {
        ...state,
        facilityData: action.payload,
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
        isLoading: false,
        isError: false,
        showView: action.payload,
      };
    default:
      throw new Error();
  }
};

const AddressField = styled(GovUK.InputField)`
  @media (min-width: 641px) {
    width: 75%;
  }
`;

const TelephoneInput = styled(GovUK.Input)`
  max-width: 20.5em;
`;

const RecoveryFacilityDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [recoveryPage, dispatchRecoveryPage] = useReducer(
    recoveryReducer,
    initialState
  );
  const [id, setId] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [addressDetails, setAddressDetails] = useState<{
    name: string;
    address: string;
    country: string;
  }>();

  const [contactDetails, setContactDetails] = useState<{
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber: string;
  }>();

  const [recoveryFacilityType, setRecoveryFacilityType] = useState<{
    type: string;
    recoveryCode: string;
  }>();

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchRecoveryPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/recovery-facility`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchRecoveryPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchRecoveryPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
            if (data.status === 'Complete') {
              setStartPage(VIEWS.LIST);
              dispatchRecoveryPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.LIST,
              });
            } else {
              if (data.values === undefined || data.values.length === 0) {
                createRecoveryFacility();
              } else {
                dispatchRecoveryPage({
                  type: 'FACILITY_DATA_UPDATE',
                  payload: data.values.at(-1),
                });
                setAddressDetails(data.values.at(-1)?.addressDetails);
                setContactDetails(data.values.at(-1)?.contactDetails);
                setRecoveryFacilityType(
                  data.values.at(-1)?.recoveryFacilityDetail
                );

                if (data.values.at(-1)?.addressDetails === undefined) {
                  setStartPage(VIEWS.ADDRESS_DETAILS);
                } else if (data.values.at(-1)?.contactDetails === undefined) {
                  setStartPage(VIEWS.CONTACT_DETAILS);
                } else if (
                  data.values.at(-1)?.recoveryFacilityType === undefined
                ) {
                  setStartPage(VIEWS.RECOVERY_CODE);
                }

                dispatchRecoveryPage({
                  type: 'SHOW_VIEW',
                  payload: startPage,
                });
              }
            }
          }
        });
    }
  }, [router.isReady, id, startPage]);

  const createRecoveryFacility = () => {
    try {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/recovery-facility`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Started' }),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            const [facility] = data.values;
            dispatchRecoveryPage({
              type: 'FACILITY_DATA_UPDATE',
              payload: { id: facility.id },
            });
          }
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkSubmit = (e, form, formSubmit) => {
    formSubmit(e, form, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, form, returnToDraft = false) => {
      let newErrors;
      let nextView;
      let body;
      switch (form) {
        case 'address':
          nextView = VIEWS.CONTACT_DETAILS;
          newErrors = {
            name: validateRecoveryFacilityName(addressDetails?.name),
            address: validateAddress(addressDetails?.address),
            country: validateCountry(addressDetails?.country),
          };
          body = {
            status: 'Started',
            values: [
              {
                ...recoveryPage.facilityData,
                addressDetails,
              },
            ],
          };
          break;
        case 'contact':
          nextView = VIEWS.RECOVERY_CODE;
          newErrors = {
            fullName: validateFullName(contactDetails?.fullName),
            emailAddress: validateEmail(contactDetails?.emailAddress),
            phoneNumber: validatePhone(contactDetails?.phoneNumber),
          };
          body = {
            status: 'Started',
            values: [
              {
                ...recoveryPage.facilityData,
                addressDetails,
                contactDetails,
              },
            ],
          };
          break;
        case 'code':
          nextView = VIEWS.LIST;
          newErrors = {
            recoveryCode: validateRecoveryCode(
              recoveryFacilityType?.recoveryCode
            ),
          };
          body = {
            status: 'Complete',
            values: [
              {
                ...recoveryPage.facilityData,
                addressDetails,
                contactDetails,
                recoveryFacilityType,
              },
            ],
          };
          break;
      }

      if (isNotEmpty(newErrors)) {
        dispatchRecoveryPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchRecoveryPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchRecoveryPage({ type: 'DATA_FETCH_INIT' });

        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/recovery-facility/${recoveryPage.facilityData.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                dispatchRecoveryPage({
                  type: 'DATA_UPDATE',
                  payload: data,
                });
                if (returnToDraft) {
                  router.push({
                    pathname: '/submit-an-export-tasklist',
                    query: { id },
                  });
                } else {
                  dispatchRecoveryPage({
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
      e.preventDefault();
    },
    [addressDetails, contactDetails, recoveryFacilityType]
  );

  const onAddressDetailsChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      [name]: value,
    }));
  };

  const onContactDetailsChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((contactDetails) => ({
      ...contactDetails,
      [name]: value,
    }));
  };

  const suggest = (query, populateResults) => {
    const results = recoveryData['labRecoveryCodes'];
    const filteredResults = results.filter(
      (result) => result.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
    populateResults(filteredResults);
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (startPage === recoveryPage.showView) {
              router.push({
                pathname: '/submit-an-export-tasklist',
                query: { id },
              });
            } else {
              dispatchRecoveryPage({
                type: 'SHOW_VIEW',
                payload: recoveryPage.showView - 1,
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
        <title>{t('exportJourney.recoveryFacilities.addressTitle')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {recoveryPage.isError && !recoveryPage.isLoading && (
              <SubmissionNotFound />
            )}
            {recoveryPage.isLoading && <Loading />}
            {!recoveryPage.isError && !recoveryPage.isLoading && (
              <>
                {recoveryPage.errors &&
                  !!Object.keys(recoveryPage.errors).length && (
                    <GovUK.ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(recoveryPage.errors).map((key) => ({
                        targetName: key,
                        text: recoveryPage.errors[key],
                      }))}
                    />
                  )}
                <GovUK.Caption>
                  {t('exportJourney.recoveryFacilities.caption')}
                </GovUK.Caption>
                {recoveryPage.showView === VIEWS.ADDRESS_DETAILS && (
                  <div id="page-recovery-facilities-address-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.recoveryFacilities.addressTitle')}
                    </GovUK.Heading>
                    <form onSubmit={(e) => handleSubmit(e, 'address')}>
                      <AddressField
                        mb={6}
                        input={{
                          name: 'name',
                          id: 'name',
                          value: addressDetails?.name,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: recoveryPage.errors?.name,
                          touched: !!recoveryPage.errors?.name,
                        }}
                      >
                        {t('exportJourney.recoveryFacilities.name')}
                      </AddressField>
                      <GovUK.TextArea
                        mb={6}
                        input={{
                          name: 'address',
                          id: 'address',
                          value: addressDetails?.address,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: recoveryPage.errors?.address,
                          touched: !!recoveryPage.errors?.address,
                        }}
                      >
                        {t('address')}
                      </GovUK.TextArea>
                      <AddressField
                        mb={6}
                        input={{
                          name: 'country',
                          id: 'country',
                          value: addressDetails?.country,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: recoveryPage.errors?.country,
                          touched: !!recoveryPage.errors?.country,
                        }}
                      >
                        {t('address.country')}
                      </AddressField>
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonAddress">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          id="saveReturnButtonAddress"
                          onClick={(e) =>
                            handleLinkSubmit(e, 'address', handleSubmit)
                          }
                        />
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {recoveryPage.showView === VIEWS.CONTACT_DETAILS && (
                  <div id="page-recovery-facilities-contact-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.recoveryFacilities.contactTitle')}
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
                          value: contactDetails?.fullName,
                          maxLength: 250,
                          onChange: onContactDetailsChange,
                        }}
                        meta={{
                          error: recoveryPage.errors?.fullName,
                          touched: !!recoveryPage.errors?.fullName,
                        }}
                      >
                        {t('exportJourney.recoveryFacilities.contactPerson')}
                      </GovUK.InputField>
                      <GovUK.InputField
                        mb={6}
                        input={{
                          name: 'emailAddress',
                          id: 'emailAddress',
                          type: 'email',
                          value: contactDetails?.emailAddress,
                          maxLength: 250,
                          onChange: onContactDetailsChange,
                        }}
                        meta={{
                          error: recoveryPage.errors?.emailAddress,
                          touched: !!recoveryPage.errors?.emailAddress,
                        }}
                      >
                        {t('contact.emailAddress')}
                      </GovUK.InputField>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'phoneNumber'}
                          error={!!recoveryPage.errors?.phoneNumber}
                        >
                          <GovUK.LabelText>
                            {t('contact.phoneNumber')}
                          </GovUK.LabelText>

                          {recoveryPage.errors?.phoneNumber && (
                            <GovUK.ErrorText>
                              {recoveryPage.errors?.phoneNumber}
                            </GovUK.ErrorText>
                          )}
                          <TelephoneInput
                            name="phoneNumber"
                            id="phoneNumber"
                            value={contactDetails?.phoneNumber}
                            maxLength={50}
                            type="tel"
                            error={recoveryPage.errors?.phoneNumber}
                            onChange={onContactDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'faxNumber'}
                          error={!!recoveryPage.errors?.faxNumber}
                        >
                          <GovUK.LabelText>
                            {t('contact.faxNumber')}
                          </GovUK.LabelText>

                          {recoveryPage.errors?.fax && (
                            <GovUK.ErrorText>
                              {recoveryPage.errors?.faxNumber}
                            </GovUK.ErrorText>
                          )}
                          <TelephoneInput
                            name="faxNumber"
                            id="faxNumber"
                            value={contactDetails?.faxNumber}
                            maxLength={50}
                            type="tel"
                            onChange={onContactDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonContact">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          id="saveReturnButtonContact"
                          onClick={(e) =>
                            handleLinkSubmit(e, 'contact', handleSubmit)
                          }
                        />
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {recoveryPage.showView === VIEWS.RECOVERY_CODE && (
                  <div id="page-recovery-facilities-recovery-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.recoveryFacilities.codeTitle')}
                    </GovUK.Heading>
                    <form
                      onSubmit={(e) => handleSubmit(e, 'code')}
                      noValidate={true}
                    >
                      <GovUK.FormGroup
                        error={!!recoveryPage.errors?.recoveryCode}
                      >
                        <GovUK.Label htmlFor="recoveryCode">
                          <GovUK.LabelText>
                            {t('autocompleteHint')}
                          </GovUK.LabelText>
                        </GovUK.Label>
                        <GovUK.ErrorText>
                          {recoveryPage.errors?.recoveryCode}
                        </GovUK.ErrorText>
                        <Autocomplete
                          id="recoveryCode"
                          source={suggest}
                          showAllValues={true}
                          onConfirm={(option) =>
                            setRecoveryFacilityType({
                              type: 'InterimSite',
                              recoveryCode: option,
                            })
                          }
                          confirmOnBlur={false}
                          defaultValue={recoveryFacilityType?.recoveryCode}
                        />
                      </GovUK.FormGroup>
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonCode">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          id="saveReturnButtonCode"
                          onClick={(e) =>
                            handleLinkSubmit(e, 'code', handleSubmit)
                          }
                        />
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {recoveryPage.showView === VIEWS.LIST && (
                  <div id="page-recovery-facilities">
                    <GovUK.Heading size={'LARGE'}>List page</GovUK.Heading>
                    {recoveryPage.data.values.map((facility) => (
                      <SummaryCard
                        key={facility.id}
                        title={facility.addressDetails.name}
                      >
                        <Paragraph>
                          {facility.addressDetails.name}
                          <br />
                          {facility.addressDetails.address}
                          <br />
                          {facility.addressDetails.country}
                        </Paragraph>
                        <Paragraph>
                          {facility.contactDetails.fullName}
                          <br />
                          {facility.contactDetails.emailAddress}
                          <br />
                          {facility.contactDetails.phoneNumber}
                          <br />
                          {facility.contactDetails.faxNumber}
                        </Paragraph>
                        <Paragraph>
                          {facility.recoveryFacilityType.recoveryCode}
                        </Paragraph>
                      </SummaryCard>
                    ))}
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

export default RecoveryFacilityDetails;
