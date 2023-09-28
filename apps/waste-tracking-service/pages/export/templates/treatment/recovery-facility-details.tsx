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
} from 'components';
import {
  isNotEmpty,
  validateEmail,
  validateInternationalPhone,
  validateAddAnotherFacility,
  validateConfirmRemove,
} from 'utils/validators';

import styled from 'styled-components';
import { GetRecoveryFacilityDetailResponse } from '@wts/api/waste-tracking-gateway';
import Autocomplete from 'accessible-autocomplete/react';
import { recoveryData } from 'utils/recoveryData';
import boldUpToFirstColon from 'utils/boldUpToFirstColon';

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

const RecoveryFacilityDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [recoveryPage, dispatchRecoveryPage] = useReducer(
    recoveryReducer,
    initialState
  );
  const [templateId, setTemplateId] = useState<string>(null);
  const [page, setPage] = useState<string>(null);
  const [siteId, setSiteId] = useState<string | string[]>(null);
  const [facilityCount, setFacilityCount] = useState<number>(0);
  const [additionalFacility, setAdditionalFacility] = useState<string>(null);
  const [isSecond, setIsSecond] = useState<boolean>(false);
  const [startPage, setStartPage] = useState<number>(1);
  const [confirmRemove, setConfirmRemove] = useState(null);
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
    recoveryCode: string;
  }>({ type: 'RecoveryFacility', recoveryCode: '' });

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(String(router.query.templateId));
      setPage(String(router.query.page));
      setSiteId(router.query.site);
    }
  }, [router.isReady, router.query.templateId]);

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
    if (templateId !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/recovery-facility`
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
                const index = data.values.findIndex(
                  (record) => record.id === siteId
                );
                setIsSecond(index === 1);

                if (getRecord[0].addressDetails !== undefined)
                  setAddressDetails(getRecord[0].addressDetails);

                if (getRecord[0].contactDetails !== undefined)
                  setContactDetails(getRecord[0].contactDetails);

                if (getRecord[0].recoveryFacilityType !== undefined)
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
                setIsSecond(filteredValues.length === 2);

                if (record.addressDetails !== undefined)
                  setAddressDetails(record?.addressDetails);

                if (record.contactDetails !== undefined)
                  setContactDetails(record?.contactDetails);

                if (record.recoveryFacilityType !== undefined)
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
  }, [router.isReady, templateId, startPage]);

  const createRecoveryFacility = () => {
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

  const handleSubmit = useCallback(
    (e: FormEvent, form, returnToDraft = false) => {
      let newErrors;
      let nextView;
      let body;
      switch (form) {
        case 'address':
          nextView = VIEWS.CONTACT_DETAILS;
          newErrors = {};
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
            emailAddress: validateEmail(contactDetails?.emailAddress, true),
            phoneNumber: validateInternationalPhone(
              contactDetails?.phoneNumber,
              true
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
          newErrors = {};
          body = {
            status: 'Started',
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
            `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/recovery-facility/${recoveryPage.facilityData.id}`,
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
                    pathname: `/export/templates/tasklist`,
                    query: { templateId },
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

  const onContactDetailsChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((contactDetails) => ({
      ...contactDetails,
      [name]: value || '',
    }));
  };

  const suggest = (query, populateResults) => {
    const results = recoveryData['labRecoveryCodes'];
    const filteredResults = results.filter(
      (result) => result.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
    populateResults(filteredResults);
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
          pathname: `/export/templates/tasklist`,
          query: { templateId },
        });
      } else {
        setIsSecond(true);
        setAddressDetails({
          name: '',
          address: '',
          country: '',
        });
        setContactDetails({
          fullName: '',
          emailAddress: '',
          phoneNumber: '',
          faxNumber: '',
        });
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

  const handleChangeLink = (facilityId) => {
    const getRecord = recoveryPage.data.values.filter(
      (record) => record.id === facilityId
    );
    dispatchRecoveryPage({
      type: 'FACILITY_DATA_UPDATE',
      payload: getRecord[0],
    });
    const index = recoveryPage.data.values.findIndex(
      (record) => record.id === facilityId
    );
    setIsSecond(index === 1);
    setAddressDetails(getRecord[0].addressDetails);
    setContactDetails(getRecord[0].contactDetails);
    setRecoveryFacilityType(getRecord[0].recoveryFacilityType);
    dispatchRecoveryPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.ADDRESS_DETAILS,
    });
  };

  const handleRemoveLink = (facilityId) => {
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
            pathname: `/export/templates/tasklist`,
            query: { templateId },
          });
        } else {
          dispatchRecoveryPage({ type: 'DATA_DELETE_INIT' });
          try {
            fetch(
              `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/recovery-facility/${recoveryPage.facilityData.id}`,
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
            if (startPage === recoveryPage.showView) {
              router.push({
                pathname: `/export/templates/treatment/interim-site`,
                query: { templateId },
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
          {t('back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>
          {t('exportJourney.recoveryFacilities.addressTitle', {
            n: isSecond ? 'second' : '',
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
                        n: isSecond ? 'second' : '',
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
                      >
                        {t('address')}
                      </GovUK.TextArea>
                      <AddressField
                        mb={6}
                        hint={t('exportJourney.recoveryFacilities.countryHint')}
                        input={{
                          name: 'country',
                          id: 'country',
                          value: addressDetails?.country || '',
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                      >
                        {t('address.country')}
                      </AddressField>
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
                {recoveryPage.showView === VIEWS.CONTACT_DETAILS && (
                  <div id="page-recovery-facilities-contact-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.recoveryFacilities.contactTitle', {
                        n: isSecond ? 'second' : '',
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
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {recoveryPage.showView === VIEWS.RECOVERY_CODE && (
                  <div id="page-recovery-facilities-recovery-details">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.recoveryFacilities.codeTitle', {
                        n: isSecond ? 'second' : '',
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
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
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
                                : index === 0
                                ? t(
                                    'exportJourney.recoveryFacilities.firstCardTitle'
                                  )
                                : t(
                                    'exportJourney.recoveryFacilities.secondCardTitle'
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
                                action: () => handleChangeLink(facility.id),
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
                                action: () => handleRemoveLink(facility.id),
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
                    {facilityCount === 1 && (
                      <form onSubmit={handleSubmitAdditionalFacility}>
                        <GovUK.Fieldset>
                          <GovUK.Fieldset.Legend size="M">
                            {t('exportJourney.recoveryFacilities.addLegend')}
                          </GovUK.Fieldset.Legend>
                          <GovUK.MultiChoice
                            mb={6}
                            hint={t('exportJourney.recoveryFacilities.addHint')}
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
                          <SaveReturnButton onClick={handleCancelReturn}>
                            {t('templates.cancelReturnButton')}
                          </SaveReturnButton>
                        </ButtonGroup>
                      </form>
                    )}
                    {facilityCount > 1 && (
                      <>
                        <GovUK.Heading as="p" size={'MEDIUM'}>
                          {t('exportJourney.recoveryFacilities.maxReached')}
                        </GovUK.Heading>
                        <ButtonGroup>
                          <GovUK.Button
                            id="saveButton"
                            onClick={() => {
                              router.push({
                                pathname: `/export/templates/tasklist`,
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

export default RecoveryFacilityDetails;
