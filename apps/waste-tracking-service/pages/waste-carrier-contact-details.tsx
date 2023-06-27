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
  validateFullName,
  validateEmail,
  validatePhone,
} from '../utils/validators';

const SmallHeading = styled(GovUK.Caption)`
  margin-bottom: 0;
`;
const AddressInput = styled(GovUK.InputField)`
  max-width: 66ex;
  margin-bottom: 20px;
`;
const PostcodeInput = styled(GovUK.InputField)`
  max-width: 56ex;
  margin-bottom: 20px;
`;

const WasteCarrierContactDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [carrierId, setCarrierId] = useState(undefined);
  const [data, setData] = useState<GetCarriersResponse>(null);
  const [carrierCount, setCarrierCount] = useState(0);
  const [carrierIndex, setCarrierIndex] = useState(0);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [fax, setFax] = useState<string>('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    fax?: string;
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
    if (id !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers/${carrierId}`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else {
            setIsLoading(false);
            setIsError(true);
          }
        })
        .then((data) => {
          if (data !== undefined) {
            const targetData = data.values.find(
              (singleCarrier) => singleCarrier.id === carrierId
            );
            setData(data);
            setFullName(targetData.contactDetails?.fullName);
            setEmail(targetData.contactDetails?.emailAddress);
            setPhone(targetData.contactDetails?.phoneNumber);
            setFax(targetData.contactDetails?.faxNumber);
            setIsLoading(false);
            setIsError(false);
          }
        });
    }
  }, [router.isReady, id, carrierId]);
  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const carrierNumber = '';

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
        fullName: validateFullName(fullName),
        email: validateEmail(email),
        phone: validatePhone(phone),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        let body;
        const newData = {
          contactDetails: {
            fullName: fullName,
            emailAddress: email,
            phoneNumber: phone,
            faxNumber: fax,
          },
        };

        if (data.status === 'Started' || data.status === 'Complete') {
          if (data.transport === true) {
            body = {
              ...data,
              values: updateArray(data.values, carrierId, newData),
            };
          } else {
            body = {
              ...data,
              status: 'Complete',
              values: updateArray(data.values, carrierId, newData),
            };
          }
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
                if (data.transport === true) {
                  const path = returnToDraft
                    ? '/submit-an-export-tasklist'
                    : '/waste-carrier-transport-choice';
                  router.push({
                    pathname: path,
                    query: { id, carrierId: data.values[0].id },
                  });
                } else {
                  const path = returnToDraft
                    ? '/submit-an-export-tasklist'
                    : '/waste-carriers';
                  router.push({
                    pathname: path,
                    query: { id },
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
    [fullName, email, phone, fax, data, carrierId, id, router]
  );

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
            data.values.findIndex(
              (item: { id: unknown }) => item.id === carrierId
            )
          );

          setIsLoading(false);
          setIsError(false);
        }
      });
  }

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            history.back();
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
          {' '}
          {t('exportJourney.wasteCarrierDetails.secondPageQuestion', {
            n: carrierNumber,
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
            {isError && !isLoading && <p>No valid record found</p>}
            {isLoading && <p>Loading</p>}
            {!isError && !isLoading && (
              <>
                {' '}
                <SmallHeading size="L">
                  {t('exportJourney.wasteCarrierDetails.title')}
                </SmallHeading>
                <GovUK.Heading size={'LARGE'}>
                  <WasteCarrierHeadingNoCaps
                    index={carrierIndex}
                    noOfCarriers={carrierCount}
                    pageType="secondPage"
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
                      hint={
                        <>{t('exportJourney.wasteCarrierDetails.nameHint')}</>
                      }
                      input={{
                        name: 'fullName',
                        id: 'fullName',
                        value: fullName,
                        maxLength: 250,
                        onChange: (e) => setFullName(e.target.value),
                      }}
                      meta={{
                        error: errors?.fullName,
                        touched: !!errors?.fullName,
                      }}
                    >
                      {t('exportJourney.wasteCarrierDetails.contactPerson')}
                    </AddressInput>
                    <AddressInput
                      input={{
                        name: 'email',
                        id: 'email',
                        value: email,
                        maxLength: 250,
                        onChange: (e) => setEmail(e.target.value),
                      }}
                      meta={{
                        error: errors?.email,
                        touched: !!errors?.email,
                      }}
                    >
                      {t('exportJourney.wasteCarrierDetails.email')}
                    </AddressInput>
                    <PostcodeInput
                      hint={
                        <>{t('exportJourney.wasteCarrierDetails.phoneHint')}</>
                      }
                      input={{
                        name: 'phone',
                        id: 'phone',
                        value: phone,
                        maxLength: 250,
                        onChange: (e) => setPhone(e.target.value),
                      }}
                      meta={{
                        error: errors?.phone,
                        touched: !!errors?.phone,
                      }}
                    >
                      {t('exportJourney.wasteCarrierDetails.phone')}
                    </PostcodeInput>
                    <PostcodeInput
                      hint={
                        <> {t('exportJourney.wasteCarrierDetails.faxHint')}</>
                      }
                      input={{
                        name: 'fax',
                        id: 'fax',
                        value: fax,
                        maxLength: 250,
                        onChange: (e) => setFax(e.target.value),
                      }}
                    >
                      {t('exportJourney.wasteCarrierDetails.fax')}
                    </PostcodeInput>
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
export default WasteCarrierContactDetails;
