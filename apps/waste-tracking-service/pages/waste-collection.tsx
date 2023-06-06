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
} from '../components';
import {
  isNotEmpty,
  validateEmail,
  validateFullName,
  validateOrganisationName,
  validatePhone,
  validatePostcode,
  validateSelectAddress,
} from '../utils/validators';
import styled from 'styled-components';
import { GetCollectionDetailResponse } from '@wts/api/waste-tracking-gateway';

const VIEWS = {
  POSTCODE_SEARCH: 1,
  SEARCH_RESULTS: 2,
  MANUAL_ADDRESS: 3,
  CONTACT_DETAILS: 4,
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

const PostcodeInput = styled(GovUK.Input)`
  max-width: 23ex;
`;

const TelephoneInput = styled(GovUK.Input)`
  max-width: 20.5em;
`;

const WasteCollection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [addressPage, dispatchAddressPage] = useReducer(
    addressReducer,
    initialState
  );
  const [id, setId] = useState(null);
  const [returnToTask, setReturnToTask] = useState(false);
  const [postcode, setPostcode] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [addressDetails, setAddressDetails] = useState<object>(null);
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
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchAddressPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/collection-detail`
      )
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
              payload: data,
            });
            if (data.values === undefined || data.values.length === 0) {
              if (data.address !== undefined) {
                setReturnToTask(true);
                setContactDetails(data.contactDetails);
                dispatchAddressPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.CONTACT_DETAILS,
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
            `${process.env.NX_API_GATEWAY_URL}/addresses?postcode=${postcode}`,
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
                dispatchAddressPage({
                  type: 'ADDRESS_DATA_FETCH_SUCCESS',
                  payload: data,
                });
                dispatchAddressPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.SEARCH_RESULTS,
                });
                console.log(data);
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
                dispatchAddressPage({
                  type: 'DATA_UPDATE',
                  payload: data,
                });
                if (returnToDraft) {
                  router.push({
                    pathname: '/submit-an-export-tasklist',
                    query: { id },
                  });
                } else {
                  dispatchAddressPage({
                    type: 'SHOW_VIEW',
                    payload: VIEWS.CONTACT_DETAILS,
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
                    ? '/submit-an-export-tasklist'
                    : '/waste-exit-location',
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
            if (
              addressPage.showView === VIEWS.SEARCH_RESULTS ||
              addressPage.showView === VIEWS.MANUAL_ADDRESS
            ) {
              dispatchAddressPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.POSTCODE_SEARCH,
              });
            } else if (
              addressPage.showView === VIEWS.CONTACT_DETAILS &&
              !returnToTask
            ) {
              dispatchAddressPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.SEARCH_RESULTS,
              });
            } else {
              router.push({
                pathname: '/submit-an-export-tasklist',
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

  return (
    <>
      <Head>
        <title>{t('exportJourney.wasteCollectionDetails.postcodeTitle')}</title>
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
                <GovUK.Caption>
                  {t('exportJourney.wasteCollectionDetails.caption')}
                </GovUK.Caption>
                {addressPage.showView === VIEWS.POSTCODE_SEARCH && (
                  <>
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.wasteCollectionDetails.postcodeTitle')}
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

                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('postcode.findButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          onClick={() =>
                            router.push({
                              pathname: '/submit-an-export-tasklist',
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
                        onClick={() =>
                          dispatchAddressPage({
                            type: 'SHOW_VIEW',
                            payload: VIEWS.MANUAL_ADDRESS,
                          })
                        }
                      >
                        {t('postcode.manualAddressLink')}
                      </AppLink>
                    </Paragraph>
                  </>
                )}
                {addressPage.showView === VIEWS.SEARCH_RESULTS && (
                  <>
                    <GovUK.Heading size={'LARGE'}>
                      {t('exportJourney.wasteCollectionDetails.postcodeTitle')}
                    </GovUK.Heading>
                    <Paragraph>
                      {postcode.toUpperCase()}
                      <span> </span>
                      <AppLink
                        href="#"
                        onClick={() => {
                          dispatchAddressPage({
                            type: 'SHOW_VIEW',
                            payload: VIEWS.POSTCODE_SEARCH,
                          });
                        }}
                      >
                        Change{' '}
                        <GovUK.VisuallyHidden>
                          the postcode
                        </GovUK.VisuallyHidden>
                      </AppLink>
                    </Paragraph>
                    <form onSubmit={handleSubmitAddress}>
                      <GovUK.FormGroup
                        error={!!addressPage.errors?.selectedAddress}
                      >
                        <GovUK.Label htmlFor={'selectedAddress'}>
                          <GovUK.LabelText>
                            {t('postcode.selectLabel')}
                          </GovUK.LabelText>
                        </GovUK.Label>
                        {addressPage.errors?.selectedAddress && (
                          <GovUK.ErrorText>
                            {addressPage.errors?.selectedAddress}
                          </GovUK.ErrorText>
                        )}
                        <GovUK.Select
                          label={''}
                          input={{
                            id: 'selectedAddress',
                            name: 'selectedAddress',
                            onChange: (e) => setSelectedAddress(e.target.value),
                          }}
                        >
                          <option value="">
                            {addressPage.addressData.length > 1
                              ? t('postcode.addressesFound', {
                                  n: addressPage.addressData.length,
                                })
                              : t('postcode.addressFound', {
                                  n: addressPage.addressData.length,
                                })}
                          </option>
                          {addressPage.addressData.map((address, key) => {
                            return (
                              <option
                                key={`address${key}`}
                                value={JSON.stringify(address)}
                              >
                                {Object.keys(address)
                                  .map((line) => address[line])
                                  .join(', ')}
                              </option>
                            );
                          })}
                        </GovUK.Select>
                      </GovUK.FormGroup>
                      <Paragraph>
                        <AppLink
                          href="#"
                          onClick={() =>
                            dispatchAddressPage({
                              type: 'SHOW_VIEW',
                              payload: VIEWS.MANUAL_ADDRESS,
                            })
                          }
                        >
                          {t('postcode.notFoundLink')}
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
                  </>
                )}
                {addressPage.showView === VIEWS.MANUAL_ADDRESS && (
                  <>Manual address page</>
                )}
                {addressPage.showView === VIEWS.CONTACT_DETAILS && (
                  <>
                    <GovUK.Heading size="L">
                      {t('exportJourney.wasteCollectionDetails.contactTitle')}
                    </GovUK.Heading>
                    <Address address={addressPage.data.address} />
                    <Paragraph>
                      <AppLink
                        href="#"
                        onClick={() => {
                          dispatchAddressPage({
                            type: 'SHOW_VIEW',
                            payload: VIEWS.MANUAL_ADDRESS,
                          });
                        }}
                      >
                        Change address
                      </AppLink>
                    </Paragraph>
                    <form noValidate={true} onSubmit={handleContactFormSubmit}>
                      <GovUK.InputField
                        mb={6}
                        input={{
                          name: 'organisationName',
                          id: 'organisationName',
                          value: contactDetails?.organisationName,
                          maxLength: 250,
                          onChange: onContactDetailsChange,
                        }}
                        meta={{
                          error: addressPage.errors?.organisationName,
                          touched: !!addressPage.errors?.organisationName,
                        }}
                      >
                        {t('exportJourney.exporterDetails.organisationName')}
                      </GovUK.InputField>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend size="M">
                          {t('exportJourney.exporterDetails.contactDetails')}
                        </GovUK.Fieldset.Legend>
                        <GovUK.FormGroup>
                          <GovUK.InputField
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
                            {t('exportJourney.exporterDetails.fullName')}
                          </GovUK.InputField>
                        </GovUK.FormGroup>
                        <GovUK.FormGroup>
                          <GovUK.InputField
                            input={{
                              name: 'emailAddress',
                              id: 'emailAddress',
                              value: contactDetails?.emailAddress,
                              type: 'emailAddress',
                              maxLength: 250,
                              onChange: onContactDetailsChange,
                            }}
                            meta={{
                              error: addressPage.errors?.emailAddress,
                              touched: !!addressPage.errors?.emailAddress,
                            }}
                          >
                            {t('exportJourney.exporterDetails.email')}
                          </GovUK.InputField>
                        </GovUK.FormGroup>
                        <GovUK.FormGroup>
                          <GovUK.Label
                            htmlFor={'phoneNumber'}
                            error={!!addressPage.errors?.phoneNumber}
                          >
                            <GovUK.LabelText>
                              {t('exportJourney.exporterDetails.phone')}
                            </GovUK.LabelText>

                            {addressPage.errors?.phoneNumber && (
                              <GovUK.ErrorText>
                                {addressPage.errors?.phoneNumber}
                              </GovUK.ErrorText>
                            )}
                            <TelephoneInput
                              name="phoneNumber"
                              id="phoneNumber"
                              value={contactDetails?.phoneNumber}
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
                              {t('exportJourney.exporterDetails.fax')}
                            </GovUK.LabelText>

                            {addressPage.errors?.fax && (
                              <GovUK.ErrorText>
                                {addressPage.errors?.faxNumber}
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
                      </GovUK.Fieldset>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          onClick={(e) =>
                            handleLinkSubmit(e, handleContactFormSubmit)
                          }
                        />
                      </ButtonGroup>
                    </form>
                  </>
                )}
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default WasteCollection;
