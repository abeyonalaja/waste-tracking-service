import Head from 'next/head';
import * as GovUK from 'govuk-react';
import {
  BreadcrumbWrap,
  ButtonGroup,
  ErrorSummary,
  Footer,
  Header,
  Loading,
  SaveReturnButton,
  SubmissionNotFound,
  Paragraph,
  AppLink,
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
import useApiConfig from 'utils/useApiConfig';

const StyledInputWrap = styled.div`
  margin-bottom: 15px;
`;

const StyledLink = styled(AppLink)`
  margin-bottom: 40px;
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
            pathname: `/incomplete/about/quantity`,
            query: { id, context: router.query.context },
          });
        }}
      >
        {t('Back')}
      </GovUK.BackLink>
    </BreadcrumbWrap>
  );
};

const QuantityEntry = () => {
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
  const apiConfig = useApiConfig();

  const [errors, setErrors] = useState<{
    quantityTypeError?: string;
    quantityWeightError?: string;
    quantityVolumeError?: string;
  }>({});

  function filterUndefinedErrors(errors) {
    return Object.keys(errors).reduce((acc, key) => {
      if (errors[key] !== undefined) {
        acc[key] = errors[key];
      }
      return acc;
    }, {});
  }

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
      setQuantityType(router.query.weightOrVolume);
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
              setQuantityType(router.query.weightOrVolume);
              setIsLoading(false);
              setIsError(false);
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const handleLinkSubmit = async (e) => {
    await handleSubmit(e);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
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
      const onlyRealErrors = filterUndefinedErrors(newErrors);
      if (isNotEmpty(onlyRealErrors)) {
        setErrors(onlyRealErrors);
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
                  pathname: `/incomplete/tasklist`,
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

  function changetoActual(event) {
    event.preventDefault();
    setEstimate(false);
  }
  function changetoEstimate(event) {
    event.preventDefault();
    setEstimate(true);
  }

  return (
    <>
      <Head>
        <title>
          {estimate
            ? t('exportJourney.quantityValueSmall.Estimate.title')
            : t('exportJourney.quantityValueSmall.Actual.title')}
        </title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs id={id} />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <SubmissionNotFound />}
            {isLoading && <Loading />}
            {!isError && !isLoading && (
              <>
                {errors && !!Object.keys(errors).length && (
                  <ErrorSummary
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
                {bulkWaste && quantityType === 'Weight' && (
                  <>
                    <GovUK.Heading size="LARGE">
                      {estimate
                        ? t(
                            'exportJourney.quantity.entry.bulk.estimateWeight.title'
                          )
                        : t(
                            'exportJourney.quantity.entry.bulk.actualWeight.title'
                          )}
                    </GovUK.Heading>
                    {!estimate ? (
                      <Paragraph>
                        {t(
                          'exportJourney.quantity.entry.bulk.actualWeight.intro'
                        )}
                        <AppLink href="#" onClick={changetoEstimate}>
                          {t('exportJourney.quantity.entry.switchToEstimate')}
                        </AppLink>
                        .
                      </Paragraph>
                    ) : (
                      <GovUK.Paragraph>
                        {t(
                          'exportJourney.quantity.entry.bulk.estimateWeight.intro'
                        )}
                      </GovUK.Paragraph>
                    )}
                    {estimate && (
                      <StyledInputWrap>
                        <GovUK.WarningText>
                          {t('exportJourney.quantity.entry.bulk.warning')}
                        </GovUK.WarningText>
                      </StyledInputWrap>
                    )}
                    <form onSubmit={handleSubmit}>
                      <InputWithSuffix
                        id="valueWeight"
                        name="quantityWeightError"
                        label={
                          estimate
                            ? t(
                                'exportJourney.quantity.entry.bulk.estimateWeightInputLabel'
                              )
                            : t(
                                'exportJourney.quantity.entry.bulk.actualWeightInputLabel'
                              )
                        }
                        onChange={(e) => setWeight(e.target.value)}
                        value={weight}
                        errorMessage={errors?.quantityWeightError}
                        suffix={t('weight.tonnes')}
                        maxLength={10}
                        hint={t('exportJourney.quantityValue.inputHint')}
                      />
                      {estimate && (
                        <ButtonGroup>
                          <StyledLink href="#" onClick={changetoActual}>
                            {t(
                              'exportJourney.quantity.entry.weight.switchToActual'
                            )}
                          </StyledLink>
                        </ButtonGroup>
                      )}
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleLinkSubmit} />
                      </ButtonGroup>
                    </form>
                  </>
                )}
                {bulkWaste && quantityType === 'Volume' && (
                  <>
                    <GovUK.Heading size="LARGE">
                      {estimate
                        ? t(
                            'exportJourney.quantity.entry.bulk.estimateVolume.title'
                          )
                        : t(
                            'exportJourney.quantity.entry.bulk.actualVolume.title'
                          )}
                    </GovUK.Heading>
                    {!estimate ? (
                      <Paragraph>
                        {t(
                          'exportJourney.quantity.entry.bulk.actualVolume.intro'
                        )}
                        <AppLink href="#" onClick={changetoEstimate}>
                          {t('exportJourney.quantity.entry.switchToEstimate')}
                        </AppLink>
                        .
                      </Paragraph>
                    ) : (
                      <GovUK.Paragraph>
                        {t(
                          'exportJourney.quantity.entry.bulk.estimateVolume.intro'
                        )}
                      </GovUK.Paragraph>
                    )}
                    {estimate && (
                      <StyledInputWrap>
                        <GovUK.WarningText>
                          {t('exportJourney.quantity.entry.bulk.warning')}
                        </GovUK.WarningText>
                      </StyledInputWrap>
                    )}
                    <form onSubmit={handleSubmit}>
                      <InputWithSuffix
                        id="valueVolume"
                        name="quantityVolumeError"
                        label={
                          estimate
                            ? t(
                                'exportJourney.quantity.entry.bulk.estimateVolumeInputLabel'
                              )
                            : t(
                                'exportJourney.quantity.entry.bulk.actualVolumeInputLabel'
                              )
                        }
                        onChange={(e) => setVolume(e.target.value)}
                        value={volume}
                        errorMessage={errors?.quantityVolumeError}
                        suffix={t('volume.m3')}
                        maxLength={10}
                        hint={t('exportJourney.quantityValue.inputHint')}
                      />
                      {estimate && (
                        <ButtonGroup>
                          <StyledLink href="#" onClick={changetoActual}>
                            {t(
                              'exportJourney.quantity.entry.volume.switchToActual'
                            )}
                          </StyledLink>
                        </ButtonGroup>
                      )}
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleLinkSubmit} />
                      </ButtonGroup>
                    </form>
                  </>
                )}
                {!bulkWaste && (
                  <>
                    <GovUK.Heading size="LARGE">
                      {estimate
                        ? t('exportJourney.quantityValueSmall.Estimate.title')
                        : t('exportJourney.quantityValueSmall.Actual.title')}
                    </GovUK.Heading>
                    {!estimate ? (
                      <Paragraph>
                        {t('exportJourney.quantityValueSmall.Actual.intro')}
                        <AppLink href="#" onClick={changetoEstimate}>
                          {t('exportJourney.quantity.entry.switchToEstimate')}
                        </AppLink>
                        .
                      </Paragraph>
                    ) : (
                      <GovUK.Paragraph>
                        {t('exportJourney.quantityValueSmall.Estimate.intro')}
                      </GovUK.Paragraph>
                    )}
                    {estimate && (
                      <StyledInputWrap>
                        <GovUK.WarningText>
                          {t('exportJourney.quantity.entry.bulk.warning')}
                        </GovUK.WarningText>
                      </StyledInputWrap>
                    )}
                    <form onSubmit={handleSubmit}>
                      <InputWithSuffix
                        id="valueWeight"
                        name="quantityWeightError"
                        label={
                          estimate
                            ? t(
                                'exportJourney.quantityValueSmall.weightLabelEstimate'
                              )
                            : t(
                                'exportJourney.quantityValueSmall.weightLabelActual'
                              )
                        }
                        onChange={(e) => setWeight(e.target.value)}
                        value={weight}
                        errorMessage={errors?.quantityWeightError}
                        suffix={t('weight.kg')}
                        maxLength={10}
                        hint={t('exportJourney.quantityValue.inputHint')}
                      />
                      {estimate && (
                        <ButtonGroup>
                          <StyledLink href="#" onClick={changetoActual}>
                            {t(
                              'exportJourney.quantity.entry.weight.switchToActual'
                            )}
                          </StyledLink>
                        </ButtonGroup>
                      )}
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
QuantityEntry.auth = true;
