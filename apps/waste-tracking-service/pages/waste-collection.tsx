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
  validatePostcode,
  validateSelectAddress,
} from '../utils/validators';
import styled from 'styled-components';

const VIEWS = {
  POSTCODE_SEARCH: 1,
  SEARCH_RESULTS: 2,
  MANUAL_ADDRESS: 3,
  CONTACT_DETAILS: 4,
};

type State = {
  data: any;
  addressData: any;
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
  data: {},
  addressData: {},
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

const WasteCollection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [addressPage, dispatchAddressPage] = useReducer(
    addressReducer,
    initialState
  );
  const [id, setId] = useState(null);
  const [postcode, setPostcode] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>();

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
          status: 'Started',
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
                  type: 'SHOW_VIEW',
                  payload: VIEWS.CONTACT_DETAILS,
                });
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
        <title>{t('exportJourney.wasteTransitCountries.title')}</title>
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
                        <GovUK.ErrorText>
                          {addressPage.errors?.selectedAddress}
                        </GovUK.ErrorText>
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
                        <SaveReturnButton />
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
                    <AppLink
                      href="#"
                      onClick={() => {
                        dispatchAddressPage({
                          type: 'SHOW_VIEW',
                          payload: VIEWS.POSTCODE_SEARCH,
                        });
                      }}
                    >
                      Change address
                    </AppLink>
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
