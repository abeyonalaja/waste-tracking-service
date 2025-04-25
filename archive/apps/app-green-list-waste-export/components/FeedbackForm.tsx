import { useFormContext, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CharacterCountHint } from 'components';
import {
  Heading,
  MultiChoice,
  Fieldset,
  Radio,
  TextArea,
  Button,
} from 'govuk-react';

const StyledTextArea = styled(TextArea)`
  span:nth-child(1) {
    font-size: 16px;
    font-weight: 700;

    @media (min-width: 40.0625em) {
      font-size: 19px;
    }
  }
`;

interface SendFeedbackRequest {
  rating?: number;
  feedback?: string;
}
interface FeedbackFormProps {
  onSubmit: (
    data: SendFeedbackRequest,
  ) => Promise<SubmitHandler<SendFeedbackRequest>>;
  validateFeedback: (feedback: string) => string | undefined;
  isPending: boolean;
}

export function FeedbackForm({
  onSubmit,
  validateFeedback,
  isPending,
}: FeedbackFormProps): React.ReactNode {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, formState } =
    useFormContext<SendFeedbackRequest>();

  return (
    <>
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
        <Button disabled={isPending} type="submit">
          {t('feedbackForm.submitButton')}
        </Button>
      </form>
    </>
  );
}
