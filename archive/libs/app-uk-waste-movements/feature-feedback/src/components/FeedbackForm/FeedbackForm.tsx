'use client';

import * as GovUK from '@wts/ui/govuk-react-ui';
import { CharacterCount } from '@wts/ui/shared-ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNewWindow } from '@wts/ui/shared-ui';

export interface formStrings {
  headingOne: string;
  headingTwo: string;
  ratingHeading: string;
  ratingLabelOne: string;
  ratingLabelTwo: string;
  ratingLabelThree: string;
  ratingLabelFour: string;
  ratingLabelFive: string;
  textAreaHeading: string;
  textAreaHint: string;
  hintBottomPartOne: string;
  hintBottomPartTwo: string;
  hintBottomExceeds: string;
  errorTextAreaHeading: string;
  errorTextAreaDescription: string;
  errorTextArea: string;
  submit: string;
}

interface FeedbackFormProps {
  strings: formStrings;
  token: string | undefined | null;
}

interface SendFeedbackRequest {
  feedback?: string;
  rating?: number;
}

interface Error {
  text: string;
  href: string;
}

export function FeedbackForm({
  strings,
  token,
}: FeedbackFormProps): JSX.Element {
  const isNewWindow = useNewWindow();
  const router = useRouter();
  const [isExceedingMaxLength, setIsExceedingMaxLength] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const methods = useForm({});
  const feedbackRadios = [
    { text: strings.ratingLabelOne, value: '5' },
    { text: strings.ratingLabelTwo, value: '4' },
    { text: strings.ratingLabelThree, value: '3' },
    { text: strings.ratingLabelFour, value: '2' },
    { text: strings.ratingLabelFive, value: '1' },
  ];
  function validateForm(feedbackTextArea: string | undefined): boolean {
    if (feedbackTextArea !== undefined && feedbackTextArea.length > 1200) {
      setIsExceedingMaxLength(true);
      setErrors([
        { text: strings.errorTextArea, href: '#feedbackTextAreaField' },
      ]);
      return false;
    }
    return true;
  }
  async function onSubmit(data: SendFeedbackRequest): Promise<void> {
    if (data.rating === undefined && data.feedback === '') {
      isNewWindow ? router.push('/') : router.back();
      return;
    }

    const isValidForm = validateForm(data.feedback);

    if (isValidForm) {
      const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/feedback`;
      const body = {
        serviceName: 'ukwm',
        surveyData: {} as SendFeedbackRequest,
      };
      if (data.feedback) {
        body.surveyData.feedback = data.feedback;
      }
      if (data.rating) {
        body.surveyData.rating = Number(data.rating);
      }
      if (!token) {
        router.replace('/feedback?success=false');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          console.error(response);
          router.replace('/feedback?success=false');
          return;
        }

        router.replace('/feedback?success=true');
      } catch (e) {
        router.replace('/feedback?success=false');
        console.error(e);
      }
    } else {
      return;
    }
  }

  return (
    <>
      {isExceedingMaxLength && (
        <GovUK.ErrorSummary
          headingErrorText={strings.errorTextAreaHeading}
          errors={errors}
        ></GovUK.ErrorSummary>
      )}
      <GovUK.Heading size={'l'} level={1}>
        {strings.headingOne}
      </GovUK.Heading>
      <GovUK.Heading size={'m'} level={2}>
        {strings.headingTwo}
      </GovUK.Heading>
      <FormProvider {...methods}>
        <form name="feedbackTextArea" onSubmit={methods.handleSubmit(onSubmit)}>
          <GovUK.Radios
            name="feedback"
            options={feedbackRadios}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              methods.setValue('rating', Number(e.target.value));
            }}
            value={String(methods.watch('rating'))}
            legendText={strings.ratingHeading}
            legendSize="s"
          />
          <CharacterCount
            id="feedbackTextAreaField"
            formName="feedback"
            maxCount={1200}
            heading={strings.textAreaHeading}
            headingSize={'s'}
            hint={strings.textAreaHint}
            showError={isExceedingMaxLength}
            errorText={strings.errorTextArea}
            charsLeftPartOne={strings.hintBottomPartOne}
            charsLeftPartTwo={strings.hintBottomPartTwo}
            charsLeftExceeds={strings.hintBottomExceeds}
          />
          <GovUK.Button>{strings.submit}</GovUK.Button>
        </form>
      </FormProvider>
    </>
  );
}
