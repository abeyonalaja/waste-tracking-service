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
import { isNotEmpty, validateQuantityType } from 'utils/validators';
import {
  PutWasteQuantityRequest,
  Submission,
} from '@wts/api/waste-tracking-gateway';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

const Quantity = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
  const [data, setData] = useState(null);
  const [bulkWaste, setBulkWaste] = useState<boolean>(true);
  const [quantityType, setQuantityType] = useState(null);
  const [savedQuantityType, setSavedQuantityType] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    quantityTypeError?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const handleLinkSubmit = async (e) => {
    await handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const newErrors = {
        quantityTypeError: validateQuantityType(quantityType, bulkWaste),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        if (savedQuantityType !== quantityType) {
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
                      ? `/export/incomplete/tasklist`
                      : `/export/incomplete/about/quantity-entry`;
                  router.push({
                    pathname: path,
                    query: { id },
                  });
                }
              });
          } catch (e) {
            console.error(e);
          }
        } else {
          const path =
            returnToDraft || quantityType === 'NotApplicable'
              ? `/export/incomplete/tasklist`
              : `/export/incomplete/about/quantity-entry`;
          router.push({
            pathname: path,
            query: { id },
          });
        }
      }
    },
    [id, quantityType, data]
  );

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const fetchData = async () => {
      if (id !== null) {
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
                  ? null
                  : data.wasteQuantity?.value.type
              );
              setSavedQuantityType(
                data.wasteQuantity?.status === 'CannotStart' ||
                  data.wasteQuantity?.status === 'NotStarted'
                  ? null
                  : data.wasteQuantity?.value.type
              );
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
              pathname: router.query.dashboard
                ? `/export/incomplete/tasklist`
                : `/export/incomplete/about/description`,
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
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
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
                <form onSubmit={handleSubmit}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {bulkWaste
                        ? t('exportJourney.quantity.bulk.title')
                        : t('exportJourney.quantity.small.title')}
                    </GovUK.Fieldset.Legend>
                    <GovUK.Paragraph>
                      {t('exportJourney.quantity.intro')}
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
                        checked={quantityType === 'ActualData'}
                        onChange={(e) => setQuantityType('ActualData')}
                        value="ActualData"
                      >
                        {t('exportJourney.quantity.radioYes')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="quantityType"
                        id="quantityTypeEstimate"
                        checked={quantityType === 'EstimateData'}
                        onChange={(e) => setQuantityType('EstimateData')}
                        value="EstimateData"
                      >
                        {t('exportJourney.quantity.radioEstimate')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="quantityType"
                        id="quantityTypeNo"
                        checked={quantityType === 'NotApplicable'}
                        onChange={(e) => setQuantityType('NotApplicable')}
                        value="NotApplicable"
                      >
                        {t('exportJourney.quantity.radioNo')}
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
