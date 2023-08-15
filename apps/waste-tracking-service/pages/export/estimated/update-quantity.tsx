import Head from 'next/head';
import * as GovUK from 'govuk-react';
import {
  AppLink,
  BreadcrumbWrap,
  ButtonGroup,
  CompleteFooter,
  CompleteHeader,
  Loading,
  Paragraph,
  SaveReturnButton,
  SubmissionNotFound,
} from 'components';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { InputWithSuffix } from 'components';
import {
  isNotEmpty,
  validateWeightOrVolume,
  validateQuantityValue,
} from 'utils/validators';
import { PutWasteQuantityRequest } from '@wts/api/waste-tracking-gateway';

const BreadCrumbs = ({ id }) => {
  const router = useRouter();
  return (
    <BreadcrumbWrap>
      <GovUK.BackLink
        href="#"
        onClick={() => {
          router.push({
            pathname: `/export/waste-quantity`,
            query: { id },
          });
        }}
      >
        Back
      </GovUK.BackLink>
    </BreadcrumbWrap>
  );
};

const QuantityEntry = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
  const [bulkWaste, setBulkWaste] = useState<boolean>(true);
  const [quantityType, setQuantityType] = useState(null);
  const [transactionId, setTransactionId] = useState('');
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
            setQuantityType(
              data.wasteQuantity.value.estimateData.quantityType || null
            );

            if (data.wasteQuantity.value.quantityType === 'Weight')
              setWeight(data.wasteQuantity.value.value);
            if (data.wasteQuantity.value.quantityType === 'Volume')
              setVolume(data.wasteQuantity.value.value);

            if (data.wasteDescription.wasteCode.type === 'NotApplicable') {
              setBulkWaste(false);
              setQuantityType('Weight');
            }

            setTransactionId(data.submissionDeclaration.values.transactionId);

            setIsLoading(false);
            setIsError(false);
          }
        });
    }
  }, [router.isReady, id]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const newErrors = {
        quantityTypeError: validateWeightOrVolume(quantityType),
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
            type: 'ActualData',
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
                  pathname: `/export/estimated/update`,
                  query: { id, success: 'true' },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
      e.preventDefault();
    },
    [id, quantityType, weight, volume, bulkWaste]
  );

  const changeQuantityType = (e, type) => {
    setErrors(null);
    setQuantityType(type);
    e.preventDefault();
  };

  return (
    <>
      <Head>
        <title>
          {bulkWaste
            ? t('exportJourney.quantityValue.Actual.title')
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
                <GovUK.Caption id="transaction-id">
                  {t('exportJourney.submittedView.title')}
                  {': '}
                  {transactionId}
                </GovUK.Caption>
                {bulkWaste && (
                  <form onSubmit={handleSubmit}>
                    <GovUK.Fieldset>
                      {quantityType === 'Weight' && (
                        <>
                          <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                            {t(
                              'exportJourney.updateActualQuantity.Weight.title'
                            )}
                          </GovUK.Fieldset.Legend>
                          <GovUK.Paragraph>
                            {t('exportJourney.quantityValue.intro')}
                          </GovUK.Paragraph>
                          <InputWithSuffix
                            id="valueWeight"
                            label={t('exportJourney.quantityValue.weightLabel')}
                            onChange={(e) => setWeight(e.target.value)}
                            value={weight}
                            errorMessage={errors?.quantityWeightError}
                            suffix={t('weight.tonnes')}
                            hint={t('exportJourney.quantityValue.inputHint')}
                          />
                          <Paragraph mb={8}>
                            <AppLink
                              href="#"
                              onClick={(e) => changeQuantityType(e, 'Volume')}
                            >
                              {t(
                                'exportJourney.updateActualQuantity.updateInCubic'
                              )}
                            </AppLink>
                          </Paragraph>
                        </>
                      )}
                      {quantityType === 'Volume' && (
                        <>
                          <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                            {t(
                              'exportJourney.updateActualQuantity.Volume.title'
                            )}
                          </GovUK.Fieldset.Legend>
                          <GovUK.Paragraph>
                            {t(
                              'exportJourney.updateActualQuantity.Volume.intro'
                            )}
                          </GovUK.Paragraph>
                          <InputWithSuffix
                            id="valueVolume"
                            label={t('exportJourney.quantityValue.volumeLabel')}
                            onChange={(e) => setVolume(e.target.value)}
                            value={volume}
                            errorMessage={errors?.quantityVolumeError}
                            suffix={t('volume.m3')}
                            hint={t('exportJourney.quantityValue.inputHint')}
                          />
                          <Paragraph mb={8}>
                            <AppLink
                              href="#"
                              onClick={(e) => changeQuantityType(e, 'Weight')}
                            >
                              {t(
                                'exportJourney.updateActualQuantity.updateInTonnes'
                              )}
                            </AppLink>
                          </Paragraph>
                        </>
                      )}
                    </GovUK.Fieldset>
                    <ButtonGroup>
                      <GovUK.Button id="updateButton">
                        {t('actions.update')}
                      </GovUK.Button>
                      <SaveReturnButton
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push({
                            pathname: `/export/estimated/update`,
                            query: { id },
                          });
                        }}
                      >
                        {t('returnToAnnex')}
                      </SaveReturnButton>
                    </ButtonGroup>
                  </form>
                )}
                {!bulkWaste && (
                  <>
                    <GovUK.Heading size="LARGE">
                      {t('exportJourney.quantityValueSmall.Actual.title')}
                    </GovUK.Heading>
                    <GovUK.Paragraph>
                      {t('exportJourney.quantityValueSmall.Actual.intro')}
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
                        <GovUK.Button id="updateButton">
                          {t('actions.update')}
                        </GovUK.Button>
                        <SaveReturnButton
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push({
                              pathname: `/export/estimated/update`,
                              query: { id },
                            });
                          }}
                        >
                          {t('returnToAnnex')}
                        </SaveReturnButton>
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
