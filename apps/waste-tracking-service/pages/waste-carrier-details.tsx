import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
  WasteCarrierHeadingNoCaps,
} from '../components';
import { GetCarriersResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import {
  isNotEmpty,
  validateOrganisationName,
  validateCountry,
  validateAddress,
} from '../utils/validators';

const SmallHeading = styled(GovUK.Caption)`
  margin-bottom: 0;
`;

const AddressInput = styled(GovUK.InputField)`
  max-width: 59ex;
  margin-bottom: 20px;
`;
const AddressTextArea = styled(GovUK.TextArea)`
  margin-bottom: 20px;
`;

const WasteCarrierDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(undefined);
  const [carrierId, setCarrierId] = useState(undefined);
  const [data, setData] = useState<GetCarriersResponse>(null);
  const [carrierCount, setCarrierCount] = useState(0);
  const [carrierIndex, setCarrierIndex] = useState(0);
  const [country, setCountry] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [organisationName, setOrganisationName] = useState<string>('');
  const [errors, setErrors] = useState<{
    organisationName?: string;
    country?: string;
    address?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
      setCarrierId(router.query.carrierId);
    }
  }, [router.isReady, router.query.id, router.query.carrierId]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    if (id !== undefined && carrierId === undefined) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            setIsLoading(false);
            setIsError(true);
          }
        })
        .then((data) => {
          if (data !== undefined) {
            const noOfCarriers = data.values?.length;

            if (noOfCarriers === undefined) {
              createFirstCarrierRecord();
            }

            if (noOfCarriers === 1) {
              router.push({
                pathname: '/waste-carrier-details',
                query: { id, carrierId: data.values[0].id },
              });
            }

            if (noOfCarriers > 1) {
              router.push({
                pathname: '/waste-carrier-details',
                query: { id, carrierId: data.values[noOfCarriers - 1].id },
              });
            }

            setIsLoading(false);
            setIsError(false);
          }
        });
    }
    if (id !== undefined && carrierId !== undefined) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            setIsLoading(false);
            setIsError(true);
          }
        })
        .then((data) => {
          if (data !== undefined) {
            setCarrierCount(data.values.length);
            setCarrierIndex(
              data.values.findIndex((item) => item.id === carrierId)
            );
            const targetData = data.values.find(
              (singleCarrier) => singleCarrier.id === carrierId
            );
            const singleRecord = {
              status: data.status,
              transport: data.transport,
              values: [targetData],
            };
            setData(singleRecord);
            setOrganisationName(targetData.addressDetails?.organisationName);
            setAddress(targetData.addressDetails?.address);
            setCountry(targetData.addressDetails?.country);
            setIsLoading(false);
            setIsError(false);
          }
        });
    }
  }, [router.isReady, id, carrierId, router.query.carrierId, router]);

  const createFirstCarrierRecord = () => {
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

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const updateArray = (arr, id, updatedData) => {
    return arr.map((item) => {
      return item.id === id ? { ...item, ...updatedData } : item;
    });
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        organisationName: validateOrganisationName(organisationName),
        country: validateCountry(country),
        address: validateAddress(address),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        let body;
        const newData = {
          addressDetails: {
            organisationName: organisationName,
            address: address,
            country: country,
          },
        };
        if (data.status === 'Started' || data.status === 'Complete') {
          body = {
            ...data,
            values: updateArray(data.values, carrierId, newData),
          };
        }
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers/${carrierId}`,
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
                const path = returnToDraft
                  ? '/submit-an-export-tasklist'
                  : '/waste-carrier-contact-details';
                router.push({
                  pathname: path,
                  query: { id, carrierId: data.values[0].id },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }

      e.preventDefault();
    },
    [data, organisationName, country, address, carrierId, id, router]
  );

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
        <title>
          {t('exportJourney.wasteCarrierDetails.firstPageQuestion')}
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
            {isError && !isLoading && <p>No valid record found</p>}
            {isLoading && <p>Loading</p>}
            {!isError && !isLoading && (
              <>
                {' '}
                <SmallHeading>
                  {t('exportJourney.wasteCarrierDetails.title')}
                </SmallHeading>
                <GovUK.Heading size={'LARGE'}>
                  <WasteCarrierHeadingNoCaps
                    index={carrierIndex}
                    noOfCarriers={carrierCount}
                    pageType="firstPage"
                  />
                </GovUK.Heading>
                <GovUK.Paragraph>
                  {t('exportJourney.wasteCarrierDetails.YouCanEditMessage')}
                </GovUK.Paragraph>
                {errors && !!Object.keys(errors).length && (
                  <GovUK.ErrorSummary
                    heading={t('errorSummary.title')}
                    errors={Object.keys(errors).map((key) => ({
                      targetName: key,
                      text: errors[key],
                    }))}
                  />
                )}
                <form onSubmit={handleSubmit}>
                  <GovUK.FormGroup>
                    <AddressInput
                      input={{
                        name: 'organisationName',
                        id: 'organisationName',
                        value: organisationName,
                        maxLength: 250,
                        onChange: (e) => setOrganisationName(e.target.value),
                      }}
                      meta={{
                        error: errors?.organisationName,
                        touched: !!errors?.organisationName,
                      }}
                    >
                      {t('exportJourney.wasteCarrierDetails.organisationName')}
                    </AddressInput>
                    <AddressTextArea
                      input={{
                        name: 'address',
                        id: 'address',
                        value: address,
                        maxLength: 250,
                        onChange: (e) => setAddress(e.target.value),
                      }}
                      meta={{
                        error: errors?.address,
                        touched: !!errors?.address,
                      }}
                    >
                      {t('exportJourney.wasteCarrierDetails.address')}
                    </AddressTextArea>
                    <AddressInput
                      input={{
                        name: 'country',
                        id: 'country',
                        value: country,
                        maxLength: 250,
                        onChange: (e) => setCountry(e.target.value),
                      }}
                      meta={{
                        error: errors?.country,
                        touched: !!errors?.country,
                      }}
                    >
                      {t('exportJourney.wasteCarrierDetails.country')}
                    </AddressInput>
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
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};
export default WasteCarrierDetails;
