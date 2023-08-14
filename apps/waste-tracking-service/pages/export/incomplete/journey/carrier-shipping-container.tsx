import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
} from 'components';
import { GetCarriersResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import { isNotEmpty, validateShippingContainerNumber } from 'utils/validators';

const SmallHeading = styled(GovUK.Caption)`
  margin-bottom: 0;
`;
const AddressInput = styled(GovUK.InputField)`
  max-width: 66ex;
  margin-bottom: 20px;
`;
const PostcodeInput = styled(GovUK.InputField)`
  max-width: 46ex;
  margin-bottom: 20px;
`;

const CarrierShippingContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [carrierId, setCarrierId] = useState(undefined);
  const [data, setData] = useState<GetCarriersResponse>(null);
  const [shippingContainerNumber, setShippingContainerNumber] =
    useState<string>('');
  const [vehicleRegistration, setVehicleRegistration] = useState<string>('');
  const [errors, setErrors] = useState<{
    shippingContainerNumber?: string;
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
            setShippingContainerNumber(
              targetData.transportDetails?.shippingContainerNumber
            );
            setVehicleRegistration(
              targetData.transportDetails?.vehicleRegistration
            );
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
        shippingContainerNumber: validateShippingContainerNumber(
          shippingContainerNumber
        ),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);

        let body;
        const newData = {
          transportDetails: {
            type: 'ShippingContainer',
            shippingContainerNumber: shippingContainerNumber,
            vehicleRegistration: vehicleRegistration,
          },
        };
        if (data.status === 'Started' || data.status === 'Complete') {
          body = {
            ...data,
            status: 'Complete',
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
                  ? `/export/incomplete/tasklist`
                  : `/export/incomplete/journey/carriers`;
                router.push({
                  pathname: path,
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
    [carrierId, data, id, router, shippingContainerNumber, vehicleRegistration]
  );
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
        <title>{t('exportJourney.wasteCarrier.shippingContainer.title')}</title>
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
                  {t('exportJourney.wasteCarrier.shippingContainer.title')}
                </GovUK.Heading>
                <GovUK.Paragraph>
                  {t('exportJourney.wasteCarrier.YouCanEditMessage')}
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
                        <>
                          {t(
                            'exportJourney.wasteCarrier.shippingContainer.containerNumberHint'
                          )}
                        </>
                      }
                      input={{
                        name: 'shippingContainerNumber',
                        id: 'shippingContainerNumber',
                        value: shippingContainerNumber,
                        maxLength: 250,
                        onChange: (e) =>
                          setShippingContainerNumber(e.target.value),
                      }}
                      meta={{
                        error: errors?.shippingContainerNumber,
                        touched: !!errors?.shippingContainerNumber,
                      }}
                    >
                      {t(
                        'exportJourney.wasteCarrier.shippingContainer.containerNumberMessage'
                      )}
                    </AddressInput>

                    <PostcodeInput
                      hint={
                        <>
                          {t(
                            'exportJourney.wasteCarrier.shippingContainer.vehicleRegHint'
                          )}
                        </>
                      }
                      input={{
                        name: 'vehicleRegistration',
                        id: 'vehicleRegistration',
                        value: vehicleRegistration,
                        maxLength: 250,
                        onChange: (e) => setVehicleRegistration(e.target.value),
                      }}
                    >
                      {t(
                        'exportJourney.wasteCarrier.shippingContainer.vehicleReg'
                      )}
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
export default CarrierShippingContainer;
