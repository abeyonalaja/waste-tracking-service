import Head from 'next/head';
import * as GovUK from 'govuk-react';
import {
  BreadcrumbWrap,
  ButtonGroup,
  ErrorSummary,
  Footer,
  Header,
  Loading,
  RadiosDivider,
  SaveReturnButton,
  SubmissionNotFound,
} from 'components';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { isNotEmpty, validateQuantityType } from 'utils/validators';
import {
  PutWasteQuantityRequest,
  Submission,
} from '@wts/api/waste-tracking-gateway';
import useApiConfig from 'utils/useApiConfig';
const Quantity = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string>();
  const [data, setData] = useState(null);
  const [bulkWaste, setBulkWaste] = useState<boolean>(true);
  const [quantityType, setQuantityType] = useState<
    'ActualData' | 'EstimateData' | 'NotApplicable'
  >();
  const [savedQuantityType, setSavedQuantityType] = useState<
    'ActualData' | 'EstimateData' | 'NotApplicable'
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const apiConfig = useApiConfig();
  const [weightOrVolume, setWeightOrVolume] = useState<'Weight' | 'Volume'>();
  const [savedWeightOrVolume, setSavedWeightOrVolume] = useState<
    'Weight' | 'Volume'
  >();

  const [errors, setErrors] = useState<{
    quantityTypeError?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id.toString());
    }
  }, [router.isReady, router.query.id]);

  const handleLinkSubmit = async (e) => {
    await handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();

      const newErrors = {
        quantityTypeError: validateQuantityType(quantityType),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors({});
        if (
          savedQuantityType !== quantityType ||
          savedWeightOrVolume !== weightOrVolume
        ) {
          const newData: PutWasteQuantityRequest = {
            status:
              data.status === 'NotStarted'
                ? 'Started'
                : data.status === 'Complete'
                ? 'Started'
                : data.status,
            value: {
              type: quantityType,
            },
          };

          if (quantityType === 'ActualData') {
            newData.value.actualData = { quantityType: weightOrVolume };
          }
          if (quantityType === 'EstimateData') {
            newData.value.estimateData = { quantityType: weightOrVolume };
          }

          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/waste-quantity`,
              {
                method: 'PUT',
                headers: apiConfig,
                body: JSON.stringify(newData),
              }
            )
              .then((response) => {
                if (response.ok) return response.json();
              })
              .then((data) => {
                if (data !== undefined) {
                  const path =
                    returnToDraft || quantityType === 'NotApplicable'
                      ? `/incomplete/tasklist`
                      : `/incomplete/about/quantity-entry`;
                  router.push({
                    pathname: path,
                    query: {
                      id,
                      weightOrVolume,
                      context: router.query.context,
                    },
                  });
                }
              });
          } catch (e) {
            console.error(e);
          }
        } else {
          const path =
            returnToDraft || quantityType === 'NotApplicable'
              ? `/incomplete/tasklist`
              : `/incomplete/about/quantity-entry`;
          router.push({
            pathname: path,
            query: { id, weightOrVolume, context: router.query.context },
          });
        }
      }
    },
    [id, weightOrVolume, quantityType, data]
  );

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const fetchData = async () => {
      if (id !== undefined) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`,
          {
            headers: apiConfig,
          }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              setIsLoading(false);
              setIsError(true);
            }
          })
          .then((data: Submission) => {
            if (data !== undefined) {
              setData(data.wasteQuantity);
              setIsLoading(false);
              setIsError(false);
              setQuantityType(
                data.wasteQuantity?.status === 'CannotStart' ||
                  data.wasteQuantity?.status === 'NotStarted'
                  ? undefined
                  : data.wasteQuantity?.value.type
              );
              setSavedQuantityType(
                data.wasteQuantity?.status === 'CannotStart' ||
                  data.wasteQuantity?.status === 'NotStarted'
                  ? undefined
                  : data.wasteQuantity?.value.type
              );
              // for the weightOrVolume variable, we check if the parent object has setted it, i.e. we have to populate
              // the radio buttons with the correct value
              if ('value' in data.wasteQuantity) {
                const actualOrEstimate = data.wasteQuantity.value?.type;
                switch (actualOrEstimate) {
                  case 'ActualData':
                    // if actualData array is not empty and the type is ActualData, i.e. we have
                    // entered actual data, we populate our variable with volume or weight based on the actual data
                    if (data.wasteQuantity?.value?.actualData !== undefined) {
                      setWeightOrVolume(
                        data.wasteQuantity?.value?.actualData?.quantityType
                      );
                      setSavedWeightOrVolume(
                        data.wasteQuantity?.value?.actualData?.quantityType
                      );
                    }
                    break;
                  case 'EstimateData':
                    // if estimateData array is not empty and the type is EstimateData, i.e. we have
                    // entered estimate data, we populate our variable with volume or weight based on the estimate data
                    if (data.wasteQuantity?.value?.estimateData !== undefined) {
                      setWeightOrVolume(
                        data.wasteQuantity?.value?.estimateData?.quantityType
                      );
                      setSavedWeightOrVolume(
                        data.wasteQuantity?.value?.estimateData?.quantityType
                      );
                    }
                    break;
                }
              }
              if (
                (data.wasteDescription?.status === 'Started' ||
                  data.wasteDescription?.status === 'Complete') &&
                data.wasteDescription?.wasteCode.type === 'NotApplicable'
              ) {
                setBulkWaste(false);
              }
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname:
                router.query.context === 'tasklist'
                  ? `/incomplete/tasklist`
                  : `/incomplete/about/description`,
              query: { id },
            });
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>
          {bulkWaste
            ? t('exportJourney.quantity.bulk.title')
            : t('exportJourney.quantity.small.title')}
        </title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
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
                <form onSubmit={handleSubmit}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.quantity.title')}
                    </GovUK.Fieldset.Legend>
                    <GovUK.Paragraph>
                      {t('exportJourney.quantity.paragraph')}
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
                        name="quantityTypeError"
                        id="quantityTypeYes"
                        checked={
                          quantityType === 'ActualData' &&
                          weightOrVolume === 'Weight'
                        }
                        onChange={() => {
                          setQuantityType('ActualData');
                          setWeightOrVolume('Weight');
                        }}
                        value="ActualData"
                      >
                        {bulkWaste
                          ? t('exportJourney.quantity.bulk.actualWeight')
                          : t('exportJourney.quantity.small.actualWeight')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="quantityType"
                        id="quantityTypeEstimate"
                        checked={
                          quantityType === 'EstimateData' &&
                          weightOrVolume === 'Weight'
                        }
                        onChange={() => {
                          setQuantityType('EstimateData');
                          setWeightOrVolume('Weight');
                        }}
                        value="EstimateData"
                      >
                        {bulkWaste
                          ? t('exportJourney.quantity.bulk.estimateWeight')
                          : t('exportJourney.quantity.small.estimateWeight')}
                      </GovUK.Radio>
                      {bulkWaste && (
                        <>
                          <GovUK.Radio
                            name="quantityType"
                            id="quantityTypeVolumeYes"
                            checked={
                              quantityType === 'ActualData' &&
                              weightOrVolume === 'Volume'
                            }
                            onChange={() => {
                              setQuantityType('ActualData');
                              setWeightOrVolume('Volume');
                            }}
                            value="ActualDataVolume"
                          >
                            {t('exportJourney.quantity.bulk.actualVolume')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            name="quantityType"
                            id="quantityTypeVolumeEstimate"
                            checked={
                              quantityType === 'EstimateData' &&
                              weightOrVolume === 'Volume'
                            }
                            onChange={() => {
                              setQuantityType('EstimateData');
                              setWeightOrVolume('Volume');
                            }}
                            value="EstimateDataVolume"
                          >
                            {t('exportJourney.quantity.bulk.estimateVolume')}
                          </GovUK.Radio>
                        </>
                      )}
                      <RadiosDivider>
                        {t('exportJourney.quantity.radioDivisor')}
                      </RadiosDivider>
                      <GovUK.Radio
                        name="quantityType"
                        id="quantityTypeNo"
                        checked={quantityType === 'NotApplicable'}
                        onChange={() => setQuantityType('NotApplicable')}
                        value="NotApplicable"
                      >
                        {t('exportJourney.quantity.dontKnow')}
                      </GovUK.Radio>
                    </GovUK.MultiChoice>
                  </GovUK.Fieldset>
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

export default Quantity;
Quantity.auth = true;
