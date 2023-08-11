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
} from '../../components';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { InputWithSuffix } from '../../components';
import styled from 'styled-components';
import {
  isNotEmpty,
  validateWeightOrVolume,
  validateQuantityValue,
} from '../../utils/validators';
import { PutWasteQuantityRequest } from '@wts/api/waste-tracking-gateway';

const StyledInputWrap = styled.div`
  margin-bottom: 15px;
  margin-left: 55px;
`;

const BreadCrumbs = ({ id }) => {
  const router = useRouter();
  return (
    <BreadcrumbWrap>
      <GovUK.BackLink
        href="#"
        onClick={() => {
          router.push({
            pathname: `${process.env.NX_EXPORT_URL}/waste-quantity`,
            query: { id },
          });
        }}
      >
        Back
      </GovUK.BackLink>
    </BreadcrumbWrap>
  );
};

const WasteQuantityEntry = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
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
    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            setIsLoading(false);
            setIsError(true);
          }
        })
        .then((data) => {
          if (data !== undefined) {
            setEstimate(data.wasteQuantity.value.type === 'EstimateData');
            setQuantityType(data.wasteQuantity.value.quantityType || null);

            if (data.wasteQuantity.value.quantityType === 'Weight')
              setWeight(data.wasteQuantity.value.value);
            if (data.wasteQuantity.value.quantityType === 'Volume')
              setVolume(data.wasteQuantity.value.value);

            if (data.wasteDescription.wasteCode.type === 'NotApplicable') {
              setBulkWaste(false);
              setQuantityType('Weight');
            }

            setIsLoading(false);
            setIsError(false);
          }
        });
    }
  }, [router.isReady, id]);

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
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

        const updatedData: PutWasteQuantityRequest = {
          status: 'Complete',
          value: {
            type: estimate ? 'EstimateData' : 'ActualData',
            quantityType: quantityType,
            value: parseFloat(quantityType === 'Weight' ? weight : volume),
          },
        };

        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-quantity`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedData),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                router.push({
                  pathname: `${process.env.NX_EXPORT_URL}/submit-an-export-tasklist`,
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

export default WasteQuantityEntry;
