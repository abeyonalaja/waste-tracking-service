import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import useApiConfig from 'utils/useApiConfig';
import styled from 'styled-components';
import {
  Page,
  BackLink,
  GridRow,
  GridCol,
  Heading,
  ErrorSummary,
} from 'govuk-react';
import {
  BreadcrumbWrap,
  Footer,
  Header,
  FeedbackForm,
  NotificationBanner,
  AppLink,
} from 'components';

type SendFeedbackRequest = {
  rating?: number;
  feedback?: string;
};

const StyledSpan = styled.span`
  display: block;
  margin-bottom: 10px;
`;

function BreadCrumbs() {
  const router = useRouter();
  const [newWindow, setNewWindow] = useState<boolean>(false);

  // Removes back link if feedback page is opened in new window/tab
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history?.length === 1) {
      setNewWindow(true);
    }
  }, []);

  if (!newWindow) {
    return (
      <BreadcrumbWrap>
        <BackLink
          href="#"
          onClick={() => {
            router.back();
          }}
        ></BackLink>
      </BreadcrumbWrap>
    );
  }

  return null;
}

export default function Feedback() {
  const formMethods = useForm<SendFeedbackRequest>({
    reValidateMode: 'onSubmit',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);
  const { t } = useTranslation();
  const apiConfig = useApiConfig();

  async function onSubmit(
    data: SendFeedbackRequest
  ): Promise<SubmitHandler<SendFeedbackRequest>> {
    // Bypasses API from being called when user has not entered any feedback to prevent blank db rows
    if (!data.rating && !data.feedback) {
      setSubmitted(true);
      return;
    }
    mutation.mutate(data);
    return null;
  }

  const mutation = useMutation({
    mutationFn: async ({ rating, feedback }: SendFeedbackRequest) => {
      const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/feedback`;

      const body: SendFeedbackRequest = {};
      if (rating) {
        body.rating = Number(rating);
      }
      if (feedback) {
        body.feedback = feedback;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: apiConfig.Authorization,
      };

      return axios.post(url, JSON.stringify(body), { headers });
    },

    onError: async () => {
      setApiError(true);
    },
    onSuccess: async () => {
      setSubmitted(true);
    },
  });

  function validateFeedback(value?: string): string | undefined {
    return value.length > 1200 ? t('feedback.textValidation') : undefined;
  }

  const errorsToShow = Object.keys(formMethods.formState.errors);

  return (
    <>
      <Head>
        <title>{t('feedback.title')}</title>
      </Head>
      <Page
        id="content"
        header={<Header showPhaseBanner={false} />}
        beforeChildren={<BreadCrumbs />}
        footer={<Footer />}
      >
        <GridRow>
          <GridCol setWidth="two-thirds">
            {!!errorsToShow?.length && (
              <ErrorSummary
                heading="Error summary"
                description="Address the following issues"
                errors={errorsToShow.map((key) => ({
                  targetName: key,
                  text: formMethods.formState.errors[key].message,
                }))}
              />
            )}
            <Heading size="LARGE">{t('feedback.title')}</Heading>
            {!submitted! && !apiError && (
              <FormProvider {...formMethods}>
                <FeedbackForm
                  onSubmit={onSubmit}
                  validateFeedback={validateFeedback}
                  isPending={mutation.isPending}
                />
              </FormProvider>
            )}
            {submitted && (
              <NotificationBanner
                type="success"
                headingText={t('feedback.success.bannerHeading')}
              >
                <AppLink colour={'green'} href="/export" target="_self">
                  {t('feedback.returnLink')}
                </AppLink>
              </NotificationBanner>
            )}
            {apiError && (
              <NotificationBanner
                type="important"
                headingText={t('feedback.error.bannerHeading')}
              >
                <StyledSpan>{t('feedback.error.bannerContent')}</StyledSpan>
                <AppLink href="/export" target="_self">
                  {t('feedback.returnLink')}
                </AppLink>
              </NotificationBanner>
            )}
          </GridCol>
        </GridRow>
      </Page>
    </>
  );
}

Feedback.auth = true;
