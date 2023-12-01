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
  ButtonGroup,
  SaveReturnButton,
  SubmissionNotFound,
  Loading,
  SummaryCard,
  SummaryList,
  CountrySelector,
} from 'components';
import {
  isNotEmpty,
  validateRecoveryFacilityName,
  validateAddress,
  validateCountry,
  validateEmail,
  validateFullName,
  validateInternationalPhone,
  validateRecoveryCode,
  validateAddAnotherFacility,
  validateConfirmRemove,
} from 'utils/validators';

import styled from 'styled-components';
import { GetRecoveryFacilityDetailResponse } from '@wts/api/waste-tracking-gateway';
import Autocomplete from 'accessible-autocomplete/react';
import boldUpToFirstColon from 'utils/boldUpToFirstColon';
import i18n from 'i18next';

const VIEWS = {
  ADDRESS_DETAILS: 1,
  CONTACT_DETAILS: 2,
  RECOVERY_CODE: 3,
  LIST: 4,
  CONFIRM_DELETE: 5,
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
    | 'DATA_DELETE_INIT'
    | 'DATA_DELETE_SUCCESS'
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
    case 'DATA_DELETE_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'DATA_DELETE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
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

type codeType = {
  type: string;
  values: Array<{
    code: string;
    description: string;
  }>;
};

const RecoveryFacilityDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [recoveryPage, dispatchRecoveryPage] = useReducer(
    recoveryReducer,
    initialState
  );
  const [refData, setRefData] = useState<Array<codeType>>();
  const [id, setId] = useState<string | string[]>(null);
  const [page, setPage] = useState(null);
  const [siteId, setSiteId] = useState<string | string[]>(null);
  const [facilityCount, setFacilityCount] = useState<number>(0);
  const [additionalFacility, setAdditionalFacility] = useState<string>(null);
  const [facCount, setFacCount] = useState<number>(0);
  const [startPage, setStartPage] = useState<number>(1);
  const [confirmRemove, setConfirmRemove] = useState(null);
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
  }>({ type: 'RecoveryFacility', recoveryCode: '' });

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
      setPage(router.query.page);
      setSiteId(router.query.site);
    }
  }, [router.isReady, router.query.id]);

  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/wts-info/recovery-codes?language=${currentLanguage}`
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            setRefData(data);
          }
        });
    };
    if (currentLanguage) {
      fetchData();
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (recoveryPage.data?.values !== undefined) {
      const countRecoveryFacilities = recoveryPage.data?.values?.filter(
        (site) => site.recoveryFacilityType?.type === 'RecoveryFacility'
      );
      setFacilityCount(countRecoveryFacilities.length);
    }
  }, [recoveryPage.data]);

  useEffect(() => {
    dispatchRecoveryPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/recovery-facility`
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
              if (siteId !== undefined) {
                const getRecord = data.values.filter(
                  (record) => record.id === siteId
                );
                dispatchRecoveryPage({
                  type: 'FACILITY_DATA_UPDATE',
                  payload: getRecord[0],
                });
                const index = data.values
                  .filter(
                    (site) =>
                      site.recoveryFacilityType?.type === 'RecoveryFacility'
                  )
                  .findIndex((record) => record.id === siteId);
                setFacCount(index + 1);
                setAddressDetails(getRecord[0].addressDetails);
                setContactDetails(getRecord[0].contactDetails);
                setRecoveryFacilityType(getRecord[0].recoveryFacilityType);
                dispatchRecoveryPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS[page],
                });
              } else {
                setStartPage(VIEWS.LIST);
                dispatchRecoveryPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.LIST,
                });
              }
            } else {
              const filteredValues = data.values?.filter(
                (site) => site.recoveryFacilityType?.type === 'RecoveryFacility'
              );
              const emptyRecords = data.values?.filter(
                (site) =>
                  site.addressDetails === undefined &&
                  site.recoveryFacilityType === undefined
              );
              if (
                (filteredValues === undefined && emptyRecords === undefined) ||
                (filteredValues.length === 0 && emptyRecords.length === 0)
              ) {
                createRecoveryFacility();
              } else {
                let record;
                if (filteredValues.length > 0) {
                  record = filteredValues.at(-1);
                } else {
                  record = emptyRecords.at(-1);
                  record.recoveryFacilityType = {
                    type: 'RecoveryFacility',
                    recoveryCode: '',
                  };
                }
                dispatchRecoveryPage({
                  type: 'FACILITY_DATA_UPDATE',
                  payload: record,
                });
                setFacCount(filteredValues.length);
                setAddressDetails(record?.addressDetails);
                setContactDetails(record?.contactDetails);
                setRecoveryFacilityType(record?.recoveryFacilityType);
                setStartPage(VIEWS.ADDRESS_DETAILS);
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
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/recovery-facility`,
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

            data.status = 'Started';

            if (recoveryPage.data?.values !== undefined) {
              recoveryPage.data.values.push({ id: facility.id });
            } else {
              dispatchRecoveryPage({
                type: 'DATA_UPDATE',
                payload: data,
              });
            }

            dispatchRecoveryPage({
              type: 'SHOW_VIEW',
              payload: VIEWS.ADDRESS_DETAILS,
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
                recoveryFacilityType: {
                  ...recoveryPage.facilityData.recoveryFacilityType,
                  ...recoveryFacilityType,
                },
              },
            ],
          };
          break;
        case 'contact':
          nextView = VIEWS.RECOVERY_CODE;
          newErrors = {
            fullName: validateFullName(contactDetails?.fullName),
            emailAddress: validateEmail(contactDetails?.emailAddress),
            phoneNumber: validateInternationalPhone(
              contactDetails?.phoneNumber
            ),
          };
          body = {
            status: 'Started',
            values: [
              {
                ...recoveryPage.facilityData,
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
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/recovery-facility/${recoveryPage.facilityData.id}`,
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
                const currentData = recoveryPage.data;
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

                dispatchRecoveryPage({
                  type: 'FACILITY_DATA_UPDATE',
                  payload: data.values[0],
                });

                dispatchRecoveryPage({
                  type: 'DATA_FETCH_SUCCESS',
                  payload: updatedData,
                });

                setAdditionalFacility(null);

                if (returnToDraft) {
                  router.push({
                    pathname: `/export/incomplete/tasklist`,
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
    [
      addressDetails,
      contactDetails,
      recoveryFacilityType,
      recoveryPage.facilityData,
    ]
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

  function suggest(query, populateResults) {
    const filterResults = (result) => {
      const tempString = `${result.code}: ${result.description}`;
      return tempString.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    };
    const filteredResults = refData.filter(filterResults);
    populateResults(filteredResults);
  }

  const suggestionTemplate = (suggestion) => {
    return typeof suggestion !== 'string'
      ? `${suggestion?.code}: ${suggestion?.description}`
      : suggestion;
  };

  const inputValueTemplate = (suggestion) => {
    return `${suggestion?.code}`;
  };

  const handleSubmitAdditionalFacility = (e) => {
    const newErrors = {
      additionalFacility: validateAddAnotherFacility(additionalFacility),
    };
    if (isNotEmpty(newErrors)) {
      dispatchRecoveryPage({ type: 'ERRORS_UPDATE', payload: newErrors });
    } else {
      const emptyRecords = recoveryPage.data.values.filter(
        (site) =>
          site.addressDetails === undefined &&
          site.recoveryFacilityType === undefined
      );
      dispatchRecoveryPage({ type: 'ERRORS_UPDATE', payload: null });
      if (additionalFacility === 'No') {
        router.push({
          pathname: `/export/incomplete/tasklist`,
          query: { id },
        });
      } else {
        setFacCount(facilityCount + 1);
        setAddressDetails(null);
        setContactDetails(null);
        setRecoveryFacilityType({ type: 'RecoveryFacility', recoveryCode: '' });
        if (emptyRecords.length === 0) {
          createRecoveryFacility();
        } else {
          emptyRecords.at(-1).recoveryFacilityType = {
            type: 'RecoveryFacility',
            recoveryCode: '',
          };
          dispatchRecoveryPage({
            type: 'FACILITY_DATA_UPDATE',
            payload: emptyRecords.at(-1),
          });
          dispatchRecoveryPage({
            type: 'SHOW_VIEW',
            payload: VIEWS.ADDRESS_DETAILS,
          });
        }
      }
    }
    e.preventDefault();
  };

  const handleChangeLink = (facilityId, e) => {
    e.preventDefault();
    const getRecord = recoveryPage.data.values.filter(
      (record) => record.id === facilityId
    );
    dispatchRecoveryPage({
      type: 'FACILITY_DATA_UPDATE',
      payload: getRecord[0],
    });
    const index = recoveryPage.data.values
      .filter(
        (record) => record.recoveryFacilityType?.type === 'RecoveryFacility'
      )
      .findIndex((record) => record.id === facilityId);
    setFacCount(index + 1);
    setAddressDetails(getRecord[0].addressDetails);
    setContactDetails(getRecord[0].contactDetails);
    setRecoveryFacilityType(getRecord[0].recoveryFacilityType);
    dispatchRecoveryPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.ADDRESS_DETAILS,
    });
  };

  const handleRemoveLink = (facilityId, e) => {
    e.preventDefault();
    const getRecord = recoveryPage.data.values.filter(
      (record) => record.id === facilityId
    );
    dispatchRecoveryPage({
      type: 'FACILITY_DATA_UPDATE',
      payload: getRecord[0],
    });

    dispatchRecoveryPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM_DELETE,
    });
  };

  const handleReturnConfirmRemove = (e) => {
    handleConfirmRemove(e, true);
  };

  const handleConfirmRemove = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        confirmRemove: validateConfirmRemove(
          confirmRemove,
          'recovery facility'
        ),
      };
      if (isNotEmpty(newErrors)) {
        dispatchRecoveryPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchRecoveryPage({ type: 'ERRORS_UPDATE', payload: null });
        const callBack = () => {
          dispatchRecoveryPage({
            type: 'SHOW_VIEW',
            payload: VIEWS.LIST,
          });
        };
        if (confirmRemove === 'No' && !returnToDraft) {
          callBack();
        } else if (confirmRemove === 'No' && returnToDraft) {
          router.push({
            pathname: `/export/incomplete/tasklist`,
            query: { id },
          });
        } else {
          dispatchRecoveryPage({ type: 'DATA_DELETE_INIT' });
          try {
            fetch(
              `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/recovery-facility/${recoveryPage.facilityData.id}`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            ).then(() => {
              const updatedValues = recoveryPage.data.values.filter(
                (facility) => facility.id !== recoveryPage.facilityData.id
              );
              dispatchRecoveryPage({
                type: 'DATA_UPDATE',
                payload: { values: updatedValues },
              });
              dispatchRecoveryPage({
                type: 'DATA_DELETE_SUCCESS',
              });
              dispatchRecoveryPage({
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
    [confirmRemove]
  );

  const completedRecoveryFacilities = (facilities) => {
    return facilities.filter(
      (facility) =>
        facility.recoveryFacilityType?.type === 'RecoveryFacility' &&
        facility.addressDetails !== undefined
    );
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (startPage === recoveryPage.showView) {
              router.push({
                pathname: `/export/incomplete/treatment/interim-site`,
                query: { id },
              });
            } else {
              dispatchRecoveryPage({
                type: 'SHOW_VIEW',
                payload:
                  recoveryPage.showView === 1
                    ? startPage
                    : recoveryPage.showView - 1,
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
        <title>
          {t('exportJourney.recoveryFacilities.addressTitle', {
            n: null,
          })}
        </title>
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
                <GovUK.Caption size="L">
                  {t('exportJourney.recoveryFacilities.caption')}
                </GovUK.Caption>
                {recoveryPage.showView === VIEWS.ADDRESS_DETAILS && (
                  <div id="page-recovery-facilities-address-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.recoveryFacilities.addressTitle', {
                        n:
                          (facCount === 1 && facilityCount === 1) ||
                          facCount === 0
                            ? null
                            : t(`numberAdjective.${facCount}`).toLowerCase(),
                      })}
                    </GovUK.Heading>
                    <form onSubmit={(e) => handleSubmit(e, 'address')}>
                      <AddressField
                        mb={6}
                        input={{
                          name: 'name',
                          id: 'name',
                          value: addressDetails?.name || '',
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
                          value: addressDetails?.address || '',
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: recoveryPage.errors?.address,
                          touched: !!recoveryPage.errors?.address,
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
                        error={recoveryPage.errors?.country}
                        hint={t('exportJourney.recoveryFacilities.countryHint')}
                        size={75}
                      />
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
                      {t('exportJourney.recoveryFacilities.contactTitle', {
                        n:
                          (facCount === 1 && facilityCount === 1) ||
                          facCount === 0
                            ? null
                            : t(`numberAdjective.${facCount}`).toLowerCase(),
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
                          value: contactDetails?.emailAddress || '',
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
                          <GovUK.HintText>
                            {t('contact.numberHint')}
                          </GovUK.HintText>
                          <TelephoneInput
                            name="phoneNumber"
                            id="phoneNumber"
                            value={contactDetails?.phoneNumber || ''}
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
                          <GovUK.HintText>
                            {t('contact.numberHint')}
                          </GovUK.HintText>
                          <TelephoneInput
                            name="faxNumber"
                            id="faxNumber"
                            value={contactDetails?.faxNumber || ''}
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
                      {t('exportJourney.recoveryFacilities.codeTitle', {
                        n:
                          (facCount === 1 && facilityCount === 1) ||
                          facCount === 0
                            ? null
                            : t(`numberAdjective.${facCount}`).toLowerCase(),
                      })}
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
                              type: 'RecoveryFacility',
                              recoveryCode: option.code,
                            })
                          }
                          confirmOnBlur={false}
                          defaultValue={recoveryFacilityType?.recoveryCode}
                          templates={{
                            inputValue: inputValueTemplate,
                            suggestion: suggestionTemplate,
                          }}
                          dropdownArrow={() => {
                            return;
                          }}
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
                    <GovUK.Heading size={'LARGE'}>
                      {facilityCount > 1
                        ? t(
                            'exportJourney.recoveryFacilities.listTitleMultiple'
                          )
                        : t('exportJourney.recoveryFacilities.listTitleSingle')}
                    </GovUK.Heading>
                    {completedRecoveryFacilities(recoveryPage.data.values).map(
                      (facility, index) => {
                        return (
                          <SummaryCard
                            key={`facility-list-item-${index + 1}`}
                            id={`facility-list-item-${index + 1}`}
                            title={
                              facilityCount === 1
                                ? t(
                                    'exportJourney.recoveryFacilities.cardTitle'
                                  )
                                : t(
                                    'exportJourney.recoveryFacilities.multipleCardTitle',
                                    { n: t(`numberAdjective.${index + 1}`) }
                                  )
                            }
                            actions={[
                              {
                                label: (
                                  <>
                                    {t('actions.change')}
                                    <GovUK.VisuallyHidden>
                                      {' '}
                                      {facility.addressDetails.name}
                                    </GovUK.VisuallyHidden>
                                  </>
                                ),
                                action: (e) => handleChangeLink(facility.id, e),
                              },
                              {
                                label: (
                                  <>
                                    {t('actions.remove')}
                                    <GovUK.VisuallyHidden>
                                      {' '}
                                      {facility.addressDetails.name}
                                    </GovUK.VisuallyHidden>
                                  </>
                                ),
                                action: (e) => handleRemoveLink(facility.id, e),
                                hidden: facilityCount === 1,
                              },
                            ]}
                          >
                            <SummaryList
                              content={[
                                {
                                  title: t(
                                    'exportJourney.recoveryFacilities.name'
                                  ),
                                  definition: facility.addressDetails.name,
                                },
                                {
                                  title: t('address.country'),
                                  definition: facility.addressDetails.country,
                                },
                                {
                                  title: t(
                                    'exportJourney.recoveryFacilities.recoveryCode'
                                  ),
                                  definition: boldUpToFirstColon(
                                    facility.recoveryFacilityType?.recoveryCode
                                  ),
                                },
                              ]}
                            />
                          </SummaryCard>
                        );
                      }
                    )}
                    {facilityCount < 5 && (
                      <form onSubmit={handleSubmitAdditionalFacility}>
                        <GovUK.Fieldset>
                          <GovUK.Fieldset.Legend size="M">
                            {t('exportJourney.recoveryFacilities.addLegend')}
                          </GovUK.Fieldset.Legend>
                          <GovUK.MultiChoice
                            mb={6}
                            hint={t(
                              'exportJourney.recoveryFacilities.addHint',
                              { n: 5 - facilityCount }
                            )}
                            label=""
                            meta={{
                              error: recoveryPage.errors?.additionalFacility,
                              touched:
                                !!recoveryPage.errors?.additionalFacility,
                            }}
                          >
                            <GovUK.Radio
                              name="additionalFacility"
                              id="additionalFacilityYes"
                              checked={additionalFacility === 'Yes'}
                              onChange={() => setAdditionalFacility('Yes')}
                              value="Yes"
                            >
                              {t('radio.yes')}
                            </GovUK.Radio>

                            <GovUK.Radio
                              name="additionalFacility"
                              id="additionalFacilityNo"
                              checked={additionalFacility === 'No'}
                              onChange={() => setAdditionalFacility('No')}
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
                          <SaveReturnButton
                            onClick={() => {
                              router.push({
                                pathname: `/export/incomplete/tasklist`,
                                query: { id },
                              });
                            }}
                          />
                        </ButtonGroup>
                      </form>
                    )}
                    {facilityCount === 5 && (
                      <>
                        <GovUK.Heading as="p" size={'MEDIUM'}>
                          {t('exportJourney.recoveryFacilities.maxReached')}
                        </GovUK.Heading>
                        <ButtonGroup>
                          <GovUK.Button
                            id="saveButton"
                            onClick={() => {
                              router.push({
                                pathname: `/export/incomplete/tasklist`,
                                query: { id },
                              });
                            }}
                          >
                            {t('saveButton')}
                          </GovUK.Button>
                          <SaveReturnButton
                            onClick={() => {
                              router.push({
                                pathname: `/export/incomplete/tasklist`,
                                query: { id },
                              });
                            }}
                          />
                        </ButtonGroup>
                      </>
                    )}
                  </div>
                )}
                {recoveryPage.showView === VIEWS.CONFIRM_DELETE && (
                  <div id="page-recovery-facilities-confirmation">
                    <form onSubmit={handleConfirmRemove}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                          {t(
                            'exportJourney.recoveryFacilities.confirmRemoveTitle',
                            {
                              name: recoveryPage.facilityData.addressDetails
                                .name,
                            }
                          )}
                        </GovUK.Fieldset.Legend>
                        <GovUK.MultiChoice
                          mb={6}
                          label=""
                          meta={{
                            error: recoveryPage.errors?.confirmRemove,
                            touched: !!recoveryPage.errors?.confirmRemove,
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
                        <SaveReturnButton onClick={handleReturnConfirmRemove} />
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

export default RecoveryFacilityDetails;
