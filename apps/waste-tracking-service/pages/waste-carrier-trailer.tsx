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
} from '../components';
import { GetCarriersResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import { isNotEmpty, validateVehicleRegistration } from '../utils/validators';

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

const WasteCarrierTrailer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [carrierId, setCarrierId] = useState(undefined);
  const [data, setData] = useState<GetCarriersResponse>(null);
  const [trailerNumber, setTrailerNumber] = useState<string>('');
  const [vehicleRegistration, setVehicleRegistration] = useState<string>('');
  const [errors, setErrors] = useState<{
    vehicleRegistration?: string;
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
            setTrailerNumber(targetData.transportDetails?.trailerNumber);
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
        vehicleRegistration: validateVehicleRegistration(vehicleRegistration),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);

        let body;
        const newData = {
          transportDetails: {
            type: 'Trailer',
            trailerNumber: trailerNumber,
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
                  ? '/submit-an-export-tasklist'
                  : '/waste-carriers';
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
    [carrierId, data, id, router, trailerNumber, vehicleRegistration]
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
        <title>{t('exportJourney.wasteCarrier.trailer.title')}</title>
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
                  {t('exportJourney.wasteCarrier.trailer.title')}
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
                      input={{
                        name: 'vehicleRegistration',
                        id: 'vehicleRegistration',
                        value: vehicleRegistration,
                        maxLength: 250,
                        onChange: (e) => setVehicleRegistration(e.target.value),
                      }}
                      meta={{
                        error: errors?.vehicleRegistration,
                        touched: !!errors?.vehicleRegistration,
                      }}
                    >
                      {t('exportJourney.wasteCarrier.trailer.vehicleReg')}
                    </AddressInput>

                    <PostcodeInput
                      input={{
                        name: 'trailerNumber',
                        id: 'trailerNumber',
                        value: trailerNumber,
                        maxLength: 250,
                        onChange: (e) => setTrailerNumber(e.target.value),
                      }}
                    >
                      {t('exportJourney.wasteCarrier.trailer.trailerNumber')}
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
export default WasteCarrierTrailer;
