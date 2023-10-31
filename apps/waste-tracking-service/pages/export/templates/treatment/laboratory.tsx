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

import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  ButtonGroup,
  SaveReturnButton,
  CountrySelector,
} from 'components';
import styled from 'styled-components';
import {
  isNotEmpty,
  validateAddress,
  validateCountry,
  validateEmail,
  validateFieldNotEmpty,
  validateFullName,
  validatePhone,
} from 'utils/validators';
import Autocomplete from 'accessible-autocomplete/react';
import { recoveryData } from 'utils/recoveryData';

const VIEWS = {
  ADDRESS_DETAILS: 1,
  CONTACT_DETAILS: 2,
  RECOVERY_CODE: 3,
};

type State = {
  data: any;
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

const laboratoryReducer = (state: State, action: Action) => {
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

const Laboratory = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [laboratoryPage, dispatchLaboratoryPage] = useReducer(
    laboratoryReducer,
    initialState
  );
  const [templateId, setTemplateId] = useState<string>(null);
  const [page, setPage] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [addressDetails, setAddressDetails] = useState<{
    name: string;
    address: string;
    country: string;
  }>({
    name: '',
    address: '',
    country: '',
  });

  const [contactDetails, setContactDetails] = useState<{
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber: string;
  }>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    faxNumber: '',
  });

  const [recoveryFacilityType, setRecoveryFacilityType] = useState<{
    type: string;
    disposalCode: string;
  }>({ type: 'Laboratory', disposalCode: '' });

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(String(router.query.templateId));
      setPage(router.query.page);
    }
  }, [router.isReady, router.query.templateId]);

  useEffect(() => {
    dispatchLaboratoryPage({ type: 'DATA_FETCH_INIT' });
    if (templateId !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/recovery-facility`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchLaboratoryPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchLaboratoryPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
            if (data.values !== undefined) {
              const labSite = data.values.filter(
                (site) => site.recoveryFacilityType?.type === 'Laboratory'
              );
              const emptyRecords = data.values.filter(
                (site) => site.addressDetails === undefined
              );

              if (labSite.length > 0) {
                const [site] = labSite;
                dispatchLaboratoryPage({
                  type: 'FACILITY_DATA_UPDATE',
                  payload: site,
                });
                setAddressDetails(site.addressDetails);
                setContactDetails(site.contactDetails);
                setRecoveryFacilityType(site.recoveryFacilityType);
                if (page !== undefined) {
                  dispatchLaboratoryPage({
                    type: 'SHOW_VIEW',
                    payload: VIEWS[page],
                  });
                }
              } else if (emptyRecords.length > 0) {
                const [emptyLabSite] = emptyRecords;
                dispatchLaboratoryPage({
                  type: 'FACILITY_DATA_UPDATE',
                  payload: emptyLabSite,
                });
                setStartPage(VIEWS.ADDRESS_DETAILS);
              } else {
                createLaboratoryDetails();
              }
            } else {
              createLaboratoryDetails();
            }
          }
        });
    }
  }, [router.isReady, templateId, startPage]);

  const getStatus = () => {
    const newErrors = {
      name: validateFieldNotEmpty(addressDetails?.name, ''),
      address: validateAddress(addressDetails?.address),
      country: validateCountry(addressDetails?.country),
      fullName: validateFullName(contactDetails?.fullName),
      emailAddress: validateEmail(contactDetails?.emailAddress),
      phoneNumber: validatePhone(contactDetails?.phoneNumber),
      disposalCode: validateFieldNotEmpty(
        recoveryFacilityType?.disposalCode,
        ''
      ),
    };
    if (isNotEmpty(newErrors)) {
      return 'Started';
    }
    return 'Complete';
  };

  const handleSubmit = useCallback(
    (e: FormEvent, form, returnToDraft = false) => {
      let nextView;
      let newErrors;
      let body;
      switch (form) {
        case 'address':
          nextView = VIEWS.CONTACT_DETAILS;
          newErrors = {};
          body = {
            status: getStatus(),
            values: [
              {
                ...laboratoryPage.facilityData,
                addressDetails,
                recoveryFacilityType: {
                  ...laboratoryPage.facilityData.recoveryFacilityType,
                  ...recoveryFacilityType,
                },
              },
            ],
          };
          break;
        case 'contact':
          nextView = VIEWS.RECOVERY_CODE;

          newErrors = {
            emailAddress: validateEmail(contactDetails?.emailAddress, true),
            phoneNumber: validatePhone(contactDetails?.phoneNumber, true),
          };

          body = {
            status: getStatus(),
            values: [
              {
                ...laboratoryPage.facilityData,
                contactDetails,
              },
            ],
          };
          break;
        case 'code':
          newErrors = {};

          body = {
            status: getStatus(),
            values: [
              {
                ...laboratoryPage.facilityData,
                recoveryFacilityType,
              },
            ],
          };
          break;
      }

      if (isNotEmpty(newErrors)) {
        dispatchLaboratoryPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchLaboratoryPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchLaboratoryPage({ type: 'DATA_FETCH_INIT' });
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/recovery-facility/${laboratoryPage.facilityData.id}`,
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
                const currentData = laboratoryPage.data;
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

                dispatchLaboratoryPage({
                  type: 'FACILITY_DATA_UPDATE',
                  payload: data.values[0],
                });

                dispatchLaboratoryPage({
                  type: 'DATA_FETCH_SUCCESS',
                  payload: updatedData,
                });

                if (returnToDraft) {
                  router.push({
                    pathname: `/export/templates/tasklist`,
                    query: { templateId },
                  });
                } else if (form === 'code') {
                  router.push({
                    pathname: `/export/templates/tasklist`,
                    query: { templateId },
                  });
                } else {
                  dispatchLaboratoryPage({
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
    [laboratoryPage.data, addressDetails, contactDetails, recoveryFacilityType]
  );

  const onAddressDetailsChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      [name]: value || '',
    }));
  };

  const onCountryChange = (option) => {
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      ['country']: option,
    }));
  };

  const onContactDetailsChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((contactDetails) => ({
      ...contactDetails,
      [name]: value || '',
    }));
  };

  const createLaboratoryDetails = () => {
    try {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/recovery-facility`,
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
            const [interimSite] = data.values;
            dispatchLaboratoryPage({
              type: 'FACILITY_DATA_UPDATE',
              payload: interimSite,
            });
            dispatchLaboratoryPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: { status: 'Started', value: data.values[0] },
            });
            dispatchLaboratoryPage({
              type: 'SHOW_VIEW',
              payload: VIEWS.ADDRESS_DETAILS,
            });
          }
        });
    } catch (e) {
      console.error(e);
    }
  };

  const suggest = (query, populateResults) => {
    const results = recoveryData['disposalCodes'];
    const filteredResults = results.filter(
      (result) => result.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
    populateResults(filteredResults);
  };

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/export/templates/tasklist`,
      query: { templateId },
    });
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (startPage === laboratoryPage.showView) {
              router.push({
                pathname: `/export/templates/tasklist`,
                query: { templateId },
              });
            } else {
              dispatchLaboratoryPage({
                type: 'SHOW_VIEW',
                payload: laboratoryPage.showView - 1,
              });
            }
          }}
        >
          {t('back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.laboratorySite.addressTitle')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {laboratoryPage.isError && !laboratoryPage.isLoading && (
              <SubmissionNotFound />
            )}
            {laboratoryPage.isLoading && <Loading />}
            {!laboratoryPage.isError && !laboratoryPage.isLoading && (
              <>
                {laboratoryPage.errors &&
                  !!Object.keys(laboratoryPage.errors).length && (
                    <GovUK.ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(laboratoryPage.errors).map((key) => ({
                        targetName: key,
                        text: laboratoryPage.errors[key],
                      }))}
                    />
                  )}
                <GovUK.Caption size="L">
                  {t('exportJourney.laboratorySite.caption')}
                </GovUK.Caption>
                {laboratoryPage.showView === VIEWS.ADDRESS_DETAILS && (
                  <div id="page-laboratory-site-address-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.laboratorySite.addressTitle')}
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
                      >
                        {t('exportJourney.laboratorySite.name')}
                      </AddressField>
                      <GovUK.TextArea
                        mb={6}
                        input={{
                          name: 'address',
                          id: 'address',
                          value: addressDetails?.address,
                          onChange: onAddressDetailsChange,
                        }}
                      >
                        {t('address')}
                      </GovUK.TextArea>
                      <CountrySelector
                        id={'country'}
                        name={'country'}
                        label={t('address.country')}
                        value={addressDetails?.country || ''}
                        onChange={onCountryChange}
                        error={laboratoryPage.errors?.country}
                        size={75}
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
                {laboratoryPage.showView === VIEWS.CONTACT_DETAILS && (
                  <div id="page-laboratory-site-contact-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.laboratorySite.contactTitle')}
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
                          error: laboratoryPage.errors?.fullName,
                          touched: !!laboratoryPage.errors?.fullName,
                        }}
                      >
                        {t('exportJourney.laboratorySite.contactPerson')}
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
                          error: laboratoryPage.errors?.emailAddress,
                          touched: !!laboratoryPage.errors?.emailAddress,
                        }}
                      >
                        {t('contact.emailAddress')}
                      </GovUK.InputField>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'phoneNumber'}
                          error={!!laboratoryPage.errors?.phoneNumber}
                        >
                          <GovUK.LabelText>
                            {t('contact.phoneNumber')}
                          </GovUK.LabelText>

                          {laboratoryPage.errors?.phoneNumber && (
                            <GovUK.ErrorText>
                              {laboratoryPage.errors?.phoneNumber}
                            </GovUK.ErrorText>
                          )}
                          <GovUK.HintText>
                            {t('contact.numberHint')}
                          </GovUK.HintText>
                          <TelephoneInput
                            name="phoneNumber"
                            id="phoneNumber"
                            value={contactDetails?.phoneNumber}
                            maxLength={50}
                            type="tel"
                            error={laboratoryPage.errors?.phoneNumber}
                            onChange={onContactDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'faxNumber'}
                          error={!!laboratoryPage.errors?.faxNumber}
                        >
                          <GovUK.LabelText>
                            {t('contact.faxNumber')}
                          </GovUK.LabelText>

                          {laboratoryPage.errors?.fax && (
                            <GovUK.ErrorText>
                              {laboratoryPage.errors?.faxNumber}
                            </GovUK.ErrorText>
                          )}
                          <GovUK.HintText>
                            {t('contact.numberHint')}
                          </GovUK.HintText>
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
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {laboratoryPage.showView === VIEWS.RECOVERY_CODE && (
                  <div id="page-laboratory-site-recovery-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.laboratorySite.codeTitle')}
                    </GovUK.Heading>
                    <form
                      onSubmit={(e) => handleSubmit(e, 'code')}
                      noValidate={true}
                    >
                      <GovUK.FormGroup
                        error={!!laboratoryPage.errors?.disposalCode}
                      >
                        <GovUK.Label htmlFor="recoveryCode">
                          <GovUK.LabelText>
                            {t('autocompleteHint')}
                          </GovUK.LabelText>
                        </GovUK.Label>
                        <GovUK.ErrorText>
                          {laboratoryPage.errors?.disposalCode}
                        </GovUK.ErrorText>
                        <Autocomplete
                          id="recoveryCode"
                          source={suggest}
                          showAllValues={true}
                          onConfirm={(option) =>
                            setRecoveryFacilityType({
                              type: 'Laboratory',
                              disposalCode: option,
                            })
                          }
                          confirmOnBlur={false}
                          defaultValue={recoveryFacilityType?.disposalCode}
                        />
                      </GovUK.FormGroup>
                      <ButtonGroup>
                        <GovUK.Button id="saveButtonCode">
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

export default Laboratory;
