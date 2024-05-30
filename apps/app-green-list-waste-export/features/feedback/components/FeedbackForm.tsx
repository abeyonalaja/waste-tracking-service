import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import useApiConfig from 'utils/useApiConfig';
import styled from 'styled-components';
import { CharacterCountHint } from 'components';
import {
  Heading,
  MultiChoice,
  Fieldset,
  Radio,
  TextArea,
  Button,
  ErrorSummary,
} from 'govuk-react';

interface SendFeedbackRequest {
  rating?: number;
  feedback?: string;
}

interface FeedbackFormProps {
  children: React.ReactNode;
}

export default function FeedbackForm({ children }: FeedbackFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const { register, handleSubmit, watch, formState } =
    useForm<SendFeedbackRequest>({
      reValidateMode: 'onSubmit',
    });

  function validateFeedback(value?: string): string | undefined {
    return value.length > 1200 ? t('feedback.textValidation') : undefined;
  }

  async function onSubmit(
    data: SendFeedbackRequest,
  ): Promise<SubmitHandler<SendFeedbackRequest>> {
    // Bypasses API from being called when user has not entered any feedback to prevent blank db rows
    if (!data.rating && !data.feedback) {
      router.replace({ query: { success: true } });
      return;
    }
    mutation.mutate(data);
    return null;
  }

  const mutation = useMutation({
    mutationFn: async ({ rating, feedback }: SendFeedbackRequest) => {
      const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/feedback`;

      const body = {
        serviceName: 'glw',
        surveyData: {} as SendFeedbackRequest,
      };
      if (rating) {
        body.surveyData.rating = Number(rating);
      }
      if (feedback) {
        body.surveyData.feedback = feedback;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: apiConfig.Authorization,
      };

      return axios.post(url, JSON.stringify(body), { headers });
    },

    onError: async () => {
      router.replace({ query: { success: false } });
    },
    onSuccess: async () => {
      router.replace({ query: { success: true } });
    },
  });

  const errorsToShow = Object.keys(formState.errors);

  return (
    <>
      {!!errorsToShow?.length && (
        <ErrorSummary
          heading="Error summary"
          description="Address the following issues"
          errors={errorsToShow.map((key) => ({
            targetName: key,
            text: formState.errors[key].message,
          }))}
        />
      )}
      {children}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Heading as="h2" size="M">
          {t('feedbackForm.title')}
        </Heading>
        <Fieldset>
          <Fieldset.Legend size="S">
            {t('feedbackForm.rating.title')}
          </Fieldset.Legend>
          <MultiChoice label="" mb={4}>
            <Radio value={5} type="radio" {...register('rating')}>
              {t('feedbackForm.rating-5')}
            </Radio>
            <Radio value={4} type="radio" {...register('rating')}>
              {t('feedbackForm.rating-4')}
            </Radio>
            <Radio value={3} type="radio" {...register('rating')}>
              {t('feedbackForm.rating-3')}
            </Radio>
            <Radio value={2} type="radio" {...register('rating')}>
              {t('feedbackForm.rating-2')}
            </Radio>
            <Radio value={1} type="radio" {...register('rating')}>
              {t('feedbackForm.rating-1')}
            </Radio>
          </MultiChoice>
        </Fieldset>
        <StyledTextArea
          hint={t('feedbackForm.improvement.hint')}
          meta={{
            error: formState.errors?.feedback?.message,
            touched: !!formState.errors?.feedback,
          }}
          input={{
            'aria-describedby': 'feedback-remaining-characters-hint',
            ...register('feedback', { validate: validateFeedback }),
          }}
        >
          {t('feedbackForm.improvement.label')}
        </StyledTextArea>
        <CharacterCountHint
          currentCount={watch('feedback')?.length || 0}
          maxCount={1200}
          id="feedback-remaining-characters-hint"
        />
        <Button disabled={mutation.isPending} type="submit">
          {t('feedbackForm.submitButton')}
        </Button>
      </form>
    </>
  );
}

const StyledTextArea = styled(TextArea)`
  span:nth-child(1) {
    font-size: 16px;
    font-weight: 700;

    @media (min-width: 40.0625em) {
      font-size: 19px;
    }
  }
`;
