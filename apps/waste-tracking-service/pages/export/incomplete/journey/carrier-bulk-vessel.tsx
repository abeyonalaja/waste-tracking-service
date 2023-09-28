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
  SubmissionNotFound,
  Loading,
} from 'components';
import { GetCarriersResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import { isNotEmpty, validateIMO } from 'utils/validators';

const SmallHeading = styled(GovUK.Caption)`
  margin-bottom: 0;
`;
const AddressInput = styled(GovUK.InputField)`
  max-width: 66ex;
  margin-bottom: 20px;
`;

const BulkVessel = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [carrierId, setCarrierId] = useState(undefined);
  const [data, setData] = useState<GetCarriersResponse>(null);
  const [imo, setImo] = useState<string>('');
  const [errors, setErrors] = useState<{
    imo?: string;
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
            setImo(targetData.transportDetails?.imo);

            setIsLoading(false);
            setIsError(false);
          }
        });
    }
  }, [router.isReady, id, carrierId]);

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
        imo: validateIMO(imo),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);

        let body;
        const newData = {
          transportDetails: {
            type: 'BulkVessel',
            imo: imo,
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
    [carrierId, data, id, imo, router]
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
        <title>{t('exportJourney.wasteCarrier.bulkVessel.title')}</title>
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
                {' '}
                <SmallHeading size="L">
                  {t('exportJourney.wasteCarrierDetails.title')}
                </SmallHeading>
                <GovUK.Heading size={'LARGE'}>
                  {t('exportJourney.wasteCarrier.bulkVessel.title')}
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
                        name: 'imo',
                        id: 'imo',
                        value: imo,
                        maxLength: 250,
                        onChange: (e) => setImo(e.target.value),
                      }}
                      meta={{
                        error: errors?.imo,
                        touched: !!errors?.imo,
                      }}
                    >
                      {t('exportJourney.wasteCarrier.bulkVessel.imo')}
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
export default BulkVessel;
