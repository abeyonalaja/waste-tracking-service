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
  Address,
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  Paragraph,
  ButtonGroup,
  SaveReturnButton,
  SubmissionNotFound,
  Loading,
  RadioList,
} from 'components';
import {
  isNotEmpty,
  validateAddress,
  validateCountrySelect,
  validateEmail,
  validateFullName,
  validateOrganisationName,
  validatePhone,
  validatePostcode,
  validateSelectAddress,
  validateTownCity,
} from 'utils/validators';
import styled from 'styled-components';
import { GetCollectionDetailResponse } from '@wts/api/waste-tracking-gateway';
import { countriesData } from 'utils/countriesData';
import { BORDER_COLOUR } from 'govuk-colours';

const VIEWS = {
  POSTCODE_SEARCH: 1,
  SEARCH_RESULTS: 2,
  MANUAL_ADDRESS: 3,
  CONTACT_DETAILS: 4,
  SHOW_ADDRESS: 5,
  EDIT_ADDRESS: 6,
};

type State = {
  data: GetCollectionDetailResponse;
  addressData: Array<object>;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  provided: string;
  errors: {
    postcode?: string;
    selectedAddress?: string;
  };
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'ADDRESS_DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE'
    | 'ADDRESS_DATA_UPDATE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
};

const initialState: State = {
  data: null,
  addressData: null,
  isLoading: true,
  isError: false,
  showView: VIEWS.POSTCODE_SEARCH,
  provided: null,
  errors: null,
};

const addressReducer = (state: State, action: Action) => {
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
    case 'ADDRESS_DATA_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        addressData: action.payload,
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
    case 'ADDRESS_DATA_UPDATE':
      return {
        ...state,
        addressData: { ...state.addressData, ...action.payload },
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

const DefinitionList = styled('dl')`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    margin-bottom: 30px;
    display: table;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 19px;
    line-height: 1.35;
  }
`;

const Row = styled('div')`
  border-bottom: 1px solid ${BORDER_COLOUR};
  margin-bottom: 15px;
  @media (min-width: 40.0625em) {
    display: table-row;
  }
`;

const Title = styled('dt')`
  margin-bottom: 5px;
  font-weight: 700;
  @media (min-width: 40.0625em) {
    display: table-cell;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    width: 18%;
  }
`;

const Definition = styled('dd')`
  margin-bottom: 5px;
  margin-left: 0;
  @media (min-width: 40.0625em) {
    display: table-cell;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    width: 68%;
  }
  &::first-letter {
    text-transform: uppercase;
  }
`;

const Actions = styled('dd')`
  margin: 10px 0 15px;
  @media (min-width: 40.0625em) {
    width: 14%;
    display: table-cell;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    text-align: right;
  }
  a {
    margin-right: 10px;
    @media (min-width: 40.0625em) {
      margin: 0 0 0 15px;
    }
  }
`;

const PostcodeInput = styled(GovUK.Input)`
  max-width: 23ex;
`;

const TelephoneInput = styled(GovUK.Input)`
  max-width: 20.5em;
`;

const CollectionDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [addressPage, dispatchAddressPage] = useReducer(
    addressReducer,
    initialState
  );
  const [id, setId] = useState(null);
  const [page, setPage] = useState(null);
  const [returnToTask, setReturnToTask] = useState(false);
  const [viewToReturnTo, setViewToReturnTo] = useState<number>();
  const [noOfWasteCarriers, setNoOfWasteCarriers] = useState<number>(1);
  const [postcode, setPostcode] = useState<string>('');
  const [buildingNameOrNumber, setNumber] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [addressDetails, setAddressDetails] = useState<{
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    postcode: string;
    country: string;
  }>(null);
  const [contactDetails, setContactDetails] = useState<{
    organisationName: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber: string;
  }>(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
      setPage(router.query.page);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchAddressPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchAddressPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchAddressPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data.collectionDetail,
            });
            if (data.carriers?.values !== undefined) {
              setNoOfWasteCarriers(data.carriers.values.length);
            }
            if (data.collectionDetail?.address !== undefined) {
              setReturnToTask(true);
              setAddressDetails(data.collectionDetail.address);
              setContactDetails(data.collectionDetail.contactDetails);
              if (page !== undefined) {
                dispatchAddressPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS[page],
                });
              } else {
                dispatchAddressPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.MANUAL_ADDRESS,
                });
              }
            }
          }
        });
    }
  }, [router.isReady, id]);

  const handlePostcodeSearch = useCallback(
    (e: FormEvent) => {
      const newErrors = {
        postcode: validatePostcode(postcode),
      };
      if (isNotEmpty(newErrors)) {
        dispatchAddressPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchAddressPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchAddressPage({ type: 'DATA_FETCH_INIT' });
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/addresses?postcode=${postcode}&buildingNameOrNumber=${buildingNameOrNumber}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
              else {
                dispatchAddressPage({ type: 'DATA_FETCH_FAILURE' });
              }
            })
            .then((data) => {
              if (data !== undefined) {
                if (data.length === 1) {
                  setAddressDetails(data[0]);
                  setViewToReturnTo(VIEWS.POSTCODE_SEARCH);
                  dispatchAddressPage({
                    type: 'SHOW_VIEW',
                    payload: VIEWS.EDIT_ADDRESS,
                  });
                } else {
                  dispatchAddressPage({
                    type: 'ADDRESS_DATA_FETCH_SUCCESS',
                    payload: data,
                  });
                  setViewToReturnTo(VIEWS.POSTCODE_SEARCH);
                  dispatchAddressPage({
                    type: 'SHOW_VIEW',
                    payload: VIEWS.SEARCH_RESULTS,
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
    [postcode]
  );

  const handleLinkSubmit = (e, formSubmit) => {
    formSubmit(e, true);
  };

  const handleSubmitAddress = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        selectedAddress: validateSelectAddress(selectedAddress),
      };
      if (isNotEmpty(newErrors)) {
        dispatchAddressPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchAddressPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchAddressPage({ type: 'DATA_FETCH_INIT' });
        const body = {
          ...addressPage.data,
          status:
            addressPage.data.status === 'NotStarted'
              ? 'Started'
              : addressPage.data.status,
          address: JSON.parse(selectedAddress),
        };
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/collection-detail`,
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
                setAddressDetails(data.address);
                dispatchAddressPage({
                  type: 'DATA_UPDATE',
                  payload: data,
                });
                if (returnToDraft) {
                  router.push({
                    pathname: `/export/incomplete/tasklist`,
                    query: { id },
                  });
                } else {
                  setViewToReturnTo(VIEWS.SEARCH_RESULTS);
                  dispatchAddressPage({
                    type: 'SHOW_VIEW',
                    payload: VIEWS.SHOW_ADDRESS,
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
    [selectedAddress]
  );

  const handleSingleAddressFormSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      dispatchAddressPage({
        type: 'SHOW_VIEW',
        payload: VIEWS.CONTACT_DETAILS,
      });
      e.preventDefault();
    },
    []
  );

  const handleContactFormSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        organisationName: validateOrganisationName(
          contactDetails?.organisationName
        ),
        fullName: validateFullName(contactDetails?.fullName),
        emailAddress: validateEmail(contactDetails?.emailAddress),
        phoneNumber: validatePhone(contactDetails?.phoneNumber),
      };
      if (isNotEmpty(newErrors)) {
        dispatchAddressPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchAddressPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchAddressPage({ type: 'DATA_FETCH_INIT' });
        const body = {
          ...addressPage.data,
          status: 'Complete',
          contactDetails: contactDetails,
        };
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/collection-detail`,
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
                router.push({
                  pathname: returnToDraft
                    ? `/export/incomplete/tasklist`
                    : `/export/incomplete/journey/exit-location`,
                  query: { id },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
      e.preventDefault();
    },
    [contactDetails]
  );

  const handleManualAddressSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        addressLine1: validateAddress(addressDetails?.addressLine1),
        townCity: validateTownCity(addressDetails?.townCity),
        postcode: validatePostcode(addressDetails?.postcode),
        country: validateCountrySelect(addressDetails?.country),
      };
      if (isNotEmpty(newErrors)) {
        dispatchAddressPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchAddressPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchAddressPage({ type: 'DATA_FETCH_INIT' });
        const body = {
          ...addressPage.data,
          status:
            addressPage.data.status === 'NotStarted'
              ? 'Started'
              : addressPage.data.status,
          address: addressDetails,
        };
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/collection-detail`,
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
                dispatchAddressPage({
                  type: 'DATA_UPDATE',
                  payload: data,
                });
                if (returnToDraft) {
                  router.push({
                    pathname: `/export/incomplete/tasklist`,
                    query: { id },
                  });
                } else {
                  setViewToReturnTo(VIEWS.MANUAL_ADDRESS);
                  dispatchAddressPage({
                    type: 'SHOW_VIEW',
                    payload: VIEWS.SHOW_ADDRESS,
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
    [addressDetails]
  );

  const onContactDetailsChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((contactDetails) => ({
      ...contactDetails,
      [name]: value,
    }));
  };

  const onAddressDetailsChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((addressDetails) => ({
      ...addressDetails,
      [name]: value,
    }));
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (addressPage.showView === VIEWS.SEARCH_RESULTS) {
              dispatchAddressPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.POSTCODE_SEARCH,
              });
            } else if (addressPage.showView === VIEWS.MANUAL_ADDRESS) {
              setViewToReturnTo(addressPage.showView);
              dispatchAddressPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.POSTCODE_SEARCH,
              });
            } else if (addressPage.showView === VIEWS.EDIT_ADDRESS) {
              setViewToReturnTo(addressPage.showView);
              dispatchAddressPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.POSTCODE_SEARCH,
              });
            } else if (addressPage.showView === VIEWS.CONTACT_DETAILS) {
              dispatchAddressPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.MANUAL_ADDRESS,
              });
            } else if (
              addressPage.showView === VIEWS.SHOW_ADDRESS &&
              !returnToTask
            ) {
              setViewToReturnTo(addressPage.showView);
              dispatchAddressPage({
                type: 'SHOW_VIEW',
                payload: viewToReturnTo,
              });
            } else {
              router.push({
                pathname: `/export/incomplete/tasklist`,
                query: { id },
              });
            }
          }}
        >
          Back
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  const getMultipleWord = (number) => {
    switch (number) {
      case 2:
        return 'second';
      case 3:
        return 'third';
      case 4:
        return 'fourth';
      case 5:
        return 'fifth';
    }
    return '';
  };

  return (
    <>
      <Head>
        <title>
          {t('exportJourney.wasteCollectionDetails.postcodeTitle', {
            n: getMultipleWord(noOfWasteCarriers),
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
            {addressPage.isError && !addressPage.isLoading && (
              <SubmissionNotFound />
            )}
            {addressPage.isLoading && <Loading />}
            {!addressPage.isError && !addressPage.isLoading && (
              <>
                {addressPage.errors &&
                  !!Object.keys(addressPage.errors).length && (
                    <GovUK.ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(addressPage.errors).map((key) => ({
                        targetName: key,
                        text: addressPage.errors[key],
                      }))}
                    />
                  )}
                <GovUK.Caption size="L">
                  {t('exportJourney.wasteCollectionDetails.caption')}
                </GovUK.Caption>
                {addressPage.showView === VIEWS.POSTCODE_SEARCH && (
                  <div id="page-waste-collection-postcode-search">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.wasteCollectionDetails.postcodeTitle', {
                        n: getMultipleWord(noOfWasteCarriers),
                      })}{' '}
                    </GovUK.Heading>
                    <form onSubmit={handlePostcodeSearch}>
                      <Paragraph>
                        {t('exportJourney.wasteCollectionDetails.intro')}
                      </Paragraph>
                      <GovUK.FormGroup error={!!addressPage.errors?.postcode}>
                        <GovUK.Label htmlFor={'postcode'}>
                          <GovUK.LabelText>
                            {t('postcode.label')}
                          </GovUK.LabelText>
                        </GovUK.Label>
                        <GovUK.ErrorText>
                          {addressPage.errors?.postcode}
                        </GovUK.ErrorText>
                        <PostcodeInput
                          name="postcode"
                          id="postcode"
                          value={postcode}
                          maxLength={50}
                          autoComplete="postal-code"
                          onChange={(e) => setPostcode(e.target.value)}
                        />
                      </GovUK.FormGroup>
                      <GovUK.FormGroup>
                        <GovUK.Label htmlFor={'buildingNameOrNumber'}>
                          <GovUK.LabelText>
                            {t('buildingNameNumber.label')}
                          </GovUK.LabelText>
                        </GovUK.Label>
                        <GovUK.ErrorText />
                        <PostcodeInput
                          name="buildingNameOrNumber"
                          id="buildingNameOrNumber"
                          value={buildingNameOrNumber}
                          maxLength={50}
                          autoComplete="street-address"
                          onChange={(e) => setNumber(e.target.value)}
                        />
                      </GovUK.FormGroup>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('postcode.findButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          onClick={() =>
                            router.push({
                              pathname: `/export/incomplete/tasklist`,
                              query: { id },
                            })
                          }
                        >
                          {t('returnToDraft')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                    <Paragraph>
                      <AppLink
                        href="#"
                        onClick={() => {
                          setViewToReturnTo(VIEWS.POSTCODE_SEARCH);
                          dispatchAddressPage({
                            type: 'SHOW_VIEW',
                            payload: VIEWS.MANUAL_ADDRESS,
                          });
                        }}
                      >
                        {t('postcode.manualAddressLink')}
                      </AppLink>
                    </Paragraph>
                  </div>
                )}
                {addressPage.showView === VIEWS.SEARCH_RESULTS && (
                  <div id="page-waste-collection-search-results">
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.wasteCollectionDetails.postcodeTitle', {
                        n: getMultipleWord(noOfWasteCarriers),
                      })}{' '}
                    </GovUK.Heading>

                    <form onSubmit={handleSubmitAddress}>
                      {addressPage.errors?.selectedAddress && (
                        <GovUK.ErrorText />
                      )}
                      <GovUK.Fieldset>
                        <GovUK.MultiChoice
                          mb={6}
                          label=""
                          meta={{
                            error: addressPage.errors?.selectedAddress,
                            touched: !!addressPage.errors?.selectedAddress,
                          }}
                        >
                          {addressPage.addressData.map((address, key) => {
                            return (
                              <GovUK.Radio
                                key={key}
                                name="addressSelection"
                                checked={
                                  selectedAddress === JSON.stringify(address)
                                }
                                onChange={(e) =>
                                  setSelectedAddress(e.target.value)
                                }
                                value={JSON.stringify(address)}
                              >
                                {Object.keys(address)
                                  .map((line) => address[line])
                                  .join(', ')}
                              </GovUK.Radio>
                            );
                          })}
                        </GovUK.MultiChoice>
                      </GovUK.Fieldset>

                      <Paragraph>
                        <AppLink
                          href="#"
                          onClick={() => {
                            setViewToReturnTo(VIEWS.SEARCH_RESULTS);
                            dispatchAddressPage({
                              type: 'SHOW_VIEW',
                              payload: VIEWS.MANUAL_ADDRESS,
                            });
                          }}
                        >
                          {t('postcode.enterManualy')}
                        </AppLink>
                      </Paragraph>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          onClick={(e) =>
                            handleLinkSubmit(e, handleSubmitAddress)
                          }
                        />
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {addressPage.showView === VIEWS.MANUAL_ADDRESS && (
                  <div id="page-waste-collection-manual-address">
                    <GovUK.Heading size="L">
                      {t('exportJourney.wasteCollectionDetails.postcodeTitle', {
                        n: getMultipleWord(noOfWasteCarriers),
                      })}{' '}
                    </GovUK.Heading>
                    <form onSubmit={handleManualAddressSubmit}>
                      <GovUK.InputField
                        mb={6}
                        hint={t('address.addressLine.hint')}
                        input={{
                          name: 'addressLine1',
                          id: 'addressLine1',
                          value: addressDetails?.addressLine1,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: addressPage.errors?.addressLine1,
                          touched: !!addressPage.errors?.addressLine1,
                        }}
                      >
                        {' '}
                        {t('address.addressLine1')}
                      </GovUK.InputField>
                      <GovUK.InputField
                        mb={6}
                        hint={t('address.addressLine.hint')}
                        input={{
                          name: 'addressLine2',
                          id: 'addressLine2',
                          value: addressDetails?.addressLine2,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: addressPage.errors?.addressLine2,
                          touched: !!addressPage.errors?.addressLine2,
                        }}
                      >
                        {' '}
                        {t('address.addressLine2')}
                      </GovUK.InputField>
                      <GovUK.InputField
                        mb={6}
                        input={{
                          name: 'townCity',
                          id: 'townCity',
                          value: addressDetails?.townCity,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: addressPage.errors?.townCity,
                          touched: !!addressPage.errors?.townCity,
                        }}
                      >
                        {' '}
                        {t('address.townCity')}
                      </GovUK.InputField>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'postcode'}
                          error={!!addressPage.errors?.postcode}
                        >
                          <GovUK.LabelText>
                            {t('address.postcode')}
                          </GovUK.LabelText>
                          {addressPage.errors?.postcode && (
                            <GovUK.ErrorText>
                              {addressPage.errors?.postcode}
                            </GovUK.ErrorText>
                          )}
                          <PostcodeInput
                            name="postcode"
                            id="postcode"
                            value={addressDetails?.postcode}
                            maxLength={50}
                            autoComplete="postal-code"
                            error={!!addressPage.errors?.postcode}
                            onChange={onAddressDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <RadioList
                        value={addressDetails?.country}
                        id="country"
                        name="country"
                        label={t('address.country')}
                        hint={t(
                          'exportJourney.wasteCollectionDetails.countryHint'
                        )}
                        errorMessage={addressPage.errors?.country}
                        options={countriesData.UK}
                        onChange={onAddressDetailsChange}
                      />
                      <ButtonGroup>
                        <GovUK.Button id="manualAddressSaveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          id="manualAddressSaveReturnButton"
                          onClick={(e) =>
                            handleLinkSubmit(e, handleManualAddressSubmit)
                          }
                        />
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {addressPage.showView === VIEWS.EDIT_ADDRESS && (
                  <div id="page-waste-collection-manual-address">
                    <GovUK.Heading size="L">
                      {t(
                        'exportJourney.wasteCollectionDetails.editCollectionAddress'
                      )}{' '}
                    </GovUK.Heading>
                    <form onSubmit={handleManualAddressSubmit}>
                      <GovUK.InputField
                        mb={6}
                        hint={t('address.addressLine.hint')}
                        input={{
                          name: 'addressLine1',
                          id: 'addressLine1',
                          value: addressDetails?.addressLine1,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: addressPage.errors?.addressLine1,
                          touched: !!addressPage.errors?.addressLine1,
                        }}
                      >
                        {' '}
                        {t('address.addressLine1')}
                      </GovUK.InputField>
                      <GovUK.InputField
                        mb={6}
                        hint={t('address.addressLine.hint')}
                        input={{
                          name: 'addressLine2',
                          id: 'addressLine2',
                          value: addressDetails?.addressLine2,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: addressPage.errors?.addressLine2,
                          touched: !!addressPage.errors?.addressLine2,
                        }}
                      >
                        {' '}
                        {t('address.addressLine2')}
                      </GovUK.InputField>
                      <GovUK.InputField
                        mb={6}
                        input={{
                          name: 'townCity',
                          id: 'townCity',
                          value: addressDetails?.townCity,
                          maxLength: 250,
                          onChange: onAddressDetailsChange,
                        }}
                        meta={{
                          error: addressPage.errors?.townCity,
                          touched: !!addressPage.errors?.townCity,
                        }}
                      >
                        {' '}
                        {t('address.townCity')}
                      </GovUK.InputField>
                      <GovUK.FormGroup>
                        <GovUK.Label
                          htmlFor={'postcode'}
                          error={!!addressPage.errors?.postcode}
                        >
                          <GovUK.LabelText>
                            {t('address.postcode')}
                          </GovUK.LabelText>
                          {addressPage.errors?.postcode && (
                            <GovUK.ErrorText>
                              {addressPage.errors?.postcode}
                            </GovUK.ErrorText>
                          )}
                          <PostcodeInput
                            name="postcode"
                            id="postcode"
                            value={addressDetails?.postcode}
                            maxLength={50}
                            autoComplete="postal-code"
                            error={!!addressPage.errors?.postcode}
                            onChange={onAddressDetailsChange}
                          />
                        </GovUK.Label>
                      </GovUK.FormGroup>
                      <RadioList
                        value={addressDetails?.country}
                        id="country"
                        name="country"
                        label={t('address.country')}
                        hint={t(
                          'exportJourney.wasteCollectionDetails.countryHint'
                        )}
                        errorMessage={addressPage.errors?.country}
                        options={countriesData.UK}
                        onChange={onAddressDetailsChange}
                      />
                      <ButtonGroup>
                        <GovUK.Button id="manualAddressSaveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          id="manualAddressSaveReturnButton"
                          onClick={(e) =>
                            handleLinkSubmit(e, handleManualAddressSubmit)
                          }
                        />
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {addressPage.showView === VIEWS.SHOW_ADDRESS && (
                  <div id="page-waste-collection-contact-details">
                    <GovUK.Heading size="L">
                      {t(
                        'exportJourney.wasteCollectionDetails.singleAddressTitle'
                      )}
                    </GovUK.Heading>

                    <DefinitionList id="address-list">
                      <Row>
                        <Title>
                          {t('postcode.checkAddress.collectionAddress')}
                        </Title>
                        <Definition id="exporter-address">
                          {addressPage.data.status !== 'NotStarted' && (
                            <Address address={addressPage.data.address} />
                          )}
                        </Definition>

                        <Actions>
                          <AppLink
                            id="address-change-link"
                            href="#"
                            onClick={() => {
                              setViewToReturnTo(VIEWS.CONTACT_DETAILS);
                              dispatchAddressPage({
                                type: 'SHOW_VIEW',
                                payload: VIEWS.MANUAL_ADDRESS,
                              });
                            }}
                          >
                            {t('address.justChange')}
                          </AppLink>
                        </Actions>
                      </Row>
                    </DefinitionList>

                    <form
                      noValidate={true}
                      onSubmit={handleSingleAddressFormSubmit}
                    >
                      <ButtonGroup>
                        <GovUK.Button id="contactDetailsSaveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          id="contactDetailsSaveReturnButton"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push({
                              pathname: `/export/incomplete/tasklist`,
                              query: { id },
                            });
                          }}
                        />
                      </ButtonGroup>
                    </form>
                  </div>
                )}
                {addressPage.showView === VIEWS.CONTACT_DETAILS && (
                  <div id="page-waste-collection-contact-details">
                    <GovUK.Heading size="L">
                      {t('exportJourney.wasteCollectionDetails.contactTitle')}
                    </GovUK.Heading>

                    <form noValidate={true} onSubmit={handleContactFormSubmit}>
                      <GovUK.InputField
                        mb={6}
                        input={{
                          name: 'organisationName',
                          id: 'organisationName',
                          value: contactDetails?.organisationName || '',
                          maxLength: 250,
                          onChange: onContactDetailsChange,
                        }}
                        meta={{
                          error: addressPage.errors?.organisationName,
                          touched: !!addressPage.errors?.organisationName,
                        }}
                      >
                        {t('contact.orgName')}
                      </GovUK.InputField>
                      <GovUK.Fieldset>
                        <GovUK.FormGroup>
                          <GovUK.InputField
                            hint={t('contact.fullName')}
                            input={{
                              name: 'fullName',
                              id: 'fullName',
                              value: contactDetails?.fullName,
                              maxLength: 250,
                              onChange: onContactDetailsChange,
                            }}
                            meta={{
                              error: addressPage.errors?.fullName,
                              touched: !!addressPage.errors?.fullName,
                            }}
                          >
                            {t('contact.orgContactName')}
                          </GovUK.InputField>
                        </GovUK.FormGroup>
                        <GovUK.FormGroup>
                          <GovUK.InputField
                            input={{
                              name: 'emailAddress',
                              id: 'emailAddress',
                              value: contactDetails?.emailAddress || '',
                              type: 'emailAddress',
                              maxLength: 250,
                              onChange: onContactDetailsChange,
                            }}
                            meta={{
                              error: addressPage.errors?.emailAddress,
                              touched: !!addressPage.errors?.emailAddress,
                            }}
                          >
                            {t('contact.emailAddress')}
                          </GovUK.InputField>
                        </GovUK.FormGroup>
                        <GovUK.FormGroup>
                          <GovUK.Label
                            htmlFor={'phoneNumber'}
                            error={!!addressPage.errors?.phoneNumber}
                          >
                            <GovUK.LabelText>
                              {t('contact.phoneNumber')}
                            </GovUK.LabelText>

                            {addressPage.errors?.phoneNumber && (
                              <GovUK.ErrorText>
                                {addressPage.errors?.phoneNumber}
                              </GovUK.ErrorText>
                            )}
                            <TelephoneInput
                              name="phoneNumber"
                              id="phoneNumber"
                              value={contactDetails?.phoneNumber || ''}
                              maxLength={50}
                              type="tel"
                              error={addressPage.errors?.phoneNumber}
                              onChange={onContactDetailsChange}
                            />
                          </GovUK.Label>
                        </GovUK.FormGroup>
                        <GovUK.FormGroup>
                          <GovUK.Label
                            htmlFor={'faxNumber'}
                            error={!!addressPage.errors?.faxNumber}
                          >
                            <GovUK.LabelText>
                              {t('contact.faxNumber')}
                            </GovUK.LabelText>

                            {addressPage.errors?.fax && (
                              <GovUK.ErrorText>
                                {addressPage.errors?.faxNumber}
                              </GovUK.ErrorText>
                            )}
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
                      </GovUK.Fieldset>
                      <ButtonGroup>
                        <GovUK.Button id="contactDetailsSaveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          id="contactDetailsSaveReturnButton"
                          onClick={(e) =>
                            handleLinkSubmit(e, handleContactFormSubmit)
                          }
                        />
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

export default CollectionDetails;
