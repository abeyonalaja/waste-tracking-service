import Head from 'next/head';
import * as GovUK from 'govuk-react';
import {
  BreadcrumbWrap,
  CompleteFooter,
  CompleteHeader,
  ButtonGroup,
  SaveReturnButton,
  Paragraph,
  Loading,
  SubmissionNotFound,
} from 'components';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { isNotEmpty, validateActualDate } from 'utils/validators';
import { format, addBusinessDays } from 'date-fns';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

const CollectionDate = ({ apiConfig }: PageProps) => {
  interface Date {
    day: string;
    month: string;
    year: string;
  }
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
  const [data, setData] = useState(null);
  const [collectionDate, setCollectionDate] = useState<Date>();
  const [transactionId, setTransactionId] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    date?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
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
              if (data.collectionDate.value.type === 'ActualDate') {
                router.push({
                  pathname: `/export/estimated/update`,
                  query: { id },
                });
              }
              setData(data.collectionDate);
              setTransactionId(data.submissionDeclaration.values.transactionId);
              setIsLoading(false);
              setIsError(false);
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const get3WorkingDaysFromToday = () => {
    return format(addBusinessDays(new Date(), 3), 'dd MM yyyy');
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const newErrors = {
        date: validateActualDate(collectionDate),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);

        const body = {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            actualDate: { ...data?.value?.actualDate },
            estimateDate: { ...data?.value?.estimateDate },
          },
        };

        body.value.actualDate = collectionDate;

        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/collection-date`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify(body),
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
    },
    [collectionDate]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: `/export/estimated/update`,
              query: { id },
            });
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
        <title>{t('exportJourney.wasteCollectionDate.title')}</title>
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
                <form onSubmit={handleSubmit}>
                  <GovUK.Caption id="transaction-id">
                    {t('exportJourney.submittedView.title')}
                    {': '}
                    {transactionId}
                  </GovUK.Caption>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.updateActualDate.title')}
                    </GovUK.Fieldset.Legend>
                    <Paragraph>
                      <>
                        {t('exportJourney.updateActualDate.intro')}{' '}
                        {get3WorkingDaysFromToday()}
                      </>
                    </Paragraph>
                    <GovUK.DateField
                      errorText={errors?.date}
                      inputs={{
                        day: {
                          maxLength: 2,
                          id: 'wasteCollActualDay',
                        },
                        month: {
                          maxLength: 2,
                          id: 'wasteCollActualMonth',
                        },
                        year: {
                          maxLength: 4,
                          id: 'wasteCollActualYear',
                        },
                      }}
                      input={{
                        onChange: (date) =>
                          setCollectionDate({
                            ...collectionDate,
                            ...date,
                          }),
                      }}
                    >
                      {}
                    </GovUK.DateField>
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
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default CollectionDate;
