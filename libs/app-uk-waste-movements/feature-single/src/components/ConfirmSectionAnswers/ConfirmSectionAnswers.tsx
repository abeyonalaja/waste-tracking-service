'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as GovUK from '@wts/ui/govuk-react-ui';

interface FormStrings {
  legendText: string;
  radioOne: string;
  radioTwo: string;
  button: string;
  errorSummaryTitle: string;
  validationError: string;
}

interface ConfirmSectionAnswersProps {
  token: string;
  endpoint?: string;
  nextPage: string;
  formStrings: FormStrings;
  children: React.ReactNode;
}

export function ConfirmSectionAnswers({
  token,
  endpoint,
  nextPage,
  formStrings,
  children,
}: ConfirmSectionAnswersProps): React.ReactNode {
  const router = useRouter();
  const [selection, setSelection] = useState<'yes' | 'no'>();
  const [showError, setShowError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelection(e.target.value as 'yes' | 'no');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setButtonDisabled(true);

    if (!selection) {
      setShowError(true);
      setButtonDisabled(false);
      window.scrollTo(0, 0);
      return;
    }

    let response: Response;
    try {
      const body = JSON.stringify({
        isConfirmed: selection === 'yes',
      });

      response = await fetch(`${endpoint}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        console.error('Failed to PUT collection address', response);
        return router.push('/error');
      }
      return router.push(nextPage);
    } catch (error) {
      console.error('Failed to PUT collection address', error);
    }
  }

  return (
    <>
      {showError && (
        <GovUK.ErrorSummary
          headingErrorText={formStrings.errorSummaryTitle}
          errors={[
            {
              text: formStrings.validationError,
              href: '#selection',
            },
          ]}
        />
      )}
      {children}
      <form onSubmit={handleSubmit}>
        <GovUK.FormGroup error={showError} id="selection">
          {showError && (
            <GovUK.ErrorMessage>
              {formStrings.validationError}
            </GovUK.ErrorMessage>
          )}
          <GovUK.Radios
            value={selection}
            onChange={handleChange}
            legendText={
              <GovUK.Heading size={'m'} level={2}>
                {formStrings.legendText}
              </GovUK.Heading>
            }
            name="confirmAnswers"
            options={[
              { value: 'yes', text: formStrings.radioOne },
              { value: 'no', text: formStrings.radioTwo },
            ]}
          />
        </GovUK.FormGroup>
        <GovUK.Button type="submit" disabled={buttonDisabled}>
          {formStrings.button}
        </GovUK.Button>
      </form>
    </>
  );
}
