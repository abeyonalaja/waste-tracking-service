import Head from 'next/head';
import * as GovUK from 'govuk-react';
import {
  BreadcrumbWrap,
  ButtonGroup,
  CompleteFooter,
  CompleteHeader,
  Loading,
  SaveReturnButton,
  SubmissionNotFound,
} from 'components';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { InputWithSuffix } from 'components';
import styled from 'styled-components';
import {
  isNotEmpty,
  validateWeightOrVolume,
  validateQuantityValue,
} from 'utils/validators';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

const StyledInputWrap = styled.div`
  margin-bottom: 15px;
  margin-left: 55px;
`;

const BreadCrumbs = ({ id }) => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <GovUK.BackLink
        href="#"
        onClick={() => {
          router.push({
            pathname: `/export/incomplete/about/quantity`,
            query: { id },
          });
        }}
      >
        {t('Back')}
      </GovUK.BackLink>
    </BreadcrumbWrap>
  );
};

const QuantityEntry = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
  const [data, setData] = useState(null);
  const [estimate, setEstimate] = useState<boolean>(false);
  const [bulkWaste, setBulkWaste] = useState<boolean>(true);
  const [quantityType, setQuantityType] = useState(null);
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    quantityTypeError?: string;
    quantityWeightError?: string;
    quantityVolumeError?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const fetchData = async () => {
      if (id !== null) {
        fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`, {
          headers: apiConfig,
        })
          .then((response) => {
            if (response.ok) return response.json();
            else {
              setIsLoading(false);
              setIsError(true);
            }
          })
          .then((data) => {
            if (data !== undefined) {
              setData(data.wasteQuantity);

              setEstimate(data.wasteQuantity.value.type === 'EstimateData');
              const type =
                data.wasteQuantity.value.type === 'EstimateData'
                  ? 'estimateData'
                  : 'actualData';

              setQuantityType(
                data.wasteQuantity.value[type]?.quantityType || null
              );

              if (data.wasteQuantity.value[type]?.quantityType === 'Weight')
                setWeight(data.wasteQuantity.value[type]?.value);

              if (data.wasteQuantity.value[type]?.quantityType === 'Volume')
                setVolume(data.wasteQuantity.value[type]?.value);

              if (data.wasteDescription.wasteCode.type === 'NotApplicable') {
                setBulkWaste(false);
                setQuantityType('Weight');
              }

              setIsLoading(false);
              setIsError(false);
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const handleLinkSubmit = async (e) => {
    await handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const newErrors = {
        quantityTypeError: validateWeightOrVolume(quantityType, estimate),
        quantityWeightError: validateQuantityValue(
          quantityType === 'Weight',
          weight,
          quantityType,
          bulkWaste,
          bulkWaste ? 'tonnes' : 'kilograms'
        ),
        quantityVolumeError: validateQuantityValue(
          quantityType === 'Volume',
          volume,
          quantityType,
          bulkWaste,
          'cubic metres'
        ),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);

        const updatedData = {
          status: 'Complete',
          value: {
            type: estimate ? 'EstimateData' : 'ActualData',
            estimateData: { ...data.value.estimateData },
            actualData: { ...data.value.actualData },
          },
        };

        const type = estimate ? 'estimateData' : 'actualData';
        updatedData.value[type] = {
          quantityType: quantityType,
          value: parseFloat(quantityType === 'Weight' ? weight : volume),
        };

        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/waste-quantity`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify(updatedData),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                router.push({
                  pathname: `/export/incomplete/tasklist`,
                  query: { id },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [id, quantityType, weight, volume, estimate, bulkWaste]
  );

  return (
    <>
      <Head>
        <title>
          {bulkWaste
            ? estimate
              ? t('exportJourney.quantityValue.Estimate.title')
              : t('exportJourney.quantityValue.Actual.title')
            : estimate
            ? t('exportJourney.quantityValueSmall.Estimate.title')
            : t('exportJourney.quantityValueSmall.Actual.title')}
        </title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs id={id} />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <SubmissionNotFound />}
            {isLoading && <Loading />}
            {!isError && !isLoading && (
              <>
                {errors && !!Object.keys(errors).length && (
                  <GovUK.ErrorSummary
                    heading={t('errorSummary.title')}
                    errors={Object.keys(errors).map((key) => ({
                      targetName: key,
                      text: errors[key],
                    }))}
                  />
                )}
                <GovUK.Caption size="L">
                  {t('exportJourney.quantity.caption')}
                </GovUK.Caption>
                {bulkWaste && (
                  <form onSubmit={handleSubmit}>
                    <GovUK.Fieldset>
                      <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                        {estimate
                          ? t('exportJourney.quantityValue.Estimate.title')
                          : t('exportJourney.quantityValue.Actual.title')}
                      </GovUK.Fieldset.Legend>
                      <GovUK.Paragraph>
                        {t('exportJourney.quantityValue.intro')}
                      </GovUK.Paragraph>
                      <GovUK.MultiChoice
                        mb={6}
                        label=""
                        meta={{
                          error: errors?.quantityTypeError,
                          touched: !!errors?.quantityTypeError,
                        }}
                      >
                        <GovUK.Radio
                          name="quantityType"
                          id="quantityTypeYes"
                          checked={quantityType === 'Weight'}
                          onChange={(e) => setQuantityType('Weight')}
                          value="Weight"
                        >
                          {t('exportJourney.quantityValue.weightLabel')}
                        </GovUK.Radio>
                        <StyledInputWrap>
                          <InputWithSuffix
                            id="valueWeight"
                            label="Weight"
                            labelHidden={true}
                            onChange={(e) => setWeight(e.target.value)}
                            value={weight}
                            errorMessage={errors?.quantityWeightError}
                            suffix={t('weight.tonnes')}
                            maxLength={10}
                            hint={t('exportJourney.quantityValue.inputHint')}
                          />
                        </StyledInputWrap>
                        <GovUK.Radio
                          name="quantityType"
                          id="quantityTypeEstimate"
                          checked={quantityType === 'Volume'}
                          onChange={(e) => setQuantityType('Volume')}
                          value="Volume"
                        >
                          {t('exportJourney.quantityValue.volumeLabel')}
                        </GovUK.Radio>
                        <StyledInputWrap>
                          <InputWithSuffix
                            id="valueVolume"
                            label="Volume"
                            labelHidden={true}
                            onChange={(e) => setVolume(e.target.value)}
                            value={volume}
                            errorMessage={errors?.quantityVolumeError}
                            suffix={t('volume.m3')}
                            maxLength={10}
                            hint={t('exportJourney.quantityValue.inputHint')}
                          />
                        </StyledInputWrap>
                      </GovUK.MultiChoice>
                    </GovUK.Fieldset>
                    <ButtonGroup>
                      <GovUK.Button id="saveButton">
                        {t('saveButton')}
                      </GovUK.Button>
                      <SaveReturnButton onClick={handleLinkSubmit} />
                    </ButtonGroup>
                  </form>
                )}
                {!bulkWaste && (
                  <>
                    <GovUK.Heading size="LARGE">
                      {estimate
                        ? t('exportJourney.quantityValueSmall.Estimate.title')
                        : t('exportJourney.quantityValueSmall.Actual.title')}
                    </GovUK.Heading>
                    <GovUK.Paragraph>
                      {estimate
                        ? t('exportJourney.quantityValueSmall.Estimate.intro')
                        : t('exportJourney.quantityValueSmall.Actual.intro')}
                    </GovUK.Paragraph>
                    <form onSubmit={handleSubmit}>
                      <InputWithSuffix
                        id="valueWeight"
                        label={t(
                          'exportJourney.quantityValueSmall.weightLabel'
                        )}
                        onChange={(e) => setWeight(e.target.value)}
                        value={weight}
                        errorMessage={errors?.quantityWeightError}
                        suffix={t('weight.kg')}
                        maxLength={10}
                        hint={t('exportJourney.quantityValue.inputHint')}
                      />
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleLinkSubmit} />
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

export default QuantityEntry;
