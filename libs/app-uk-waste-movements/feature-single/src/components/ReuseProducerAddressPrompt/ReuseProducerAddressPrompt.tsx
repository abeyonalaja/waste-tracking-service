'use client';

import { useState } from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useRouter } from 'next/navigation';

interface FormStrings {
  radioOne: string;
  radioTwo: string;
  buttonOne: string;
  buttonTwo: string;
  errorSummaryTitle: string;
  validationError: string;
}

interface ReuseProducerAddressPromptProps {
  id: string;
  formStrings: FormStrings;
  children: React.ReactNode;
}

export function ReuseProducerAddressPrompt({
  id,
  formStrings,
  children,
}: ReuseProducerAddressPromptProps): React.ReactNode {
  const router = useRouter();
  const [selection, setSelection] = useState<'yes' | 'no'>();
  const [showError, setShowError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelection(e.target.value as 'yes' | 'no');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setButtonDisabled(true);

    if (!selection) {
      setShowError(true);
      setButtonDisabled(false);
      window.scrollTo(0, 0);
      return;
    }

    if (selection === 'yes') {
      return router.push(
        `/single/${id}/producer/collection-details/reuse/confirm`,
      );
    }

    return router.push(`/single/${id}/producer/collection-details`);
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
            name="reuseProducerAddress"
            options={[
              { text: formStrings.radioOne, value: 'yes' },
              { text: formStrings.radioTwo, value: 'no' },
            ]}
            value={selection}
            onChange={handleChange}
          ></GovUK.Radios>
        </GovUK.FormGroup>
        <GovUK.ButtonGroup>
          <GovUK.Button type="submit" disabled={buttonDisabled}>
            {formStrings.buttonOne}
          </GovUK.Button>
          <GovUK.Button href={`/single/${id}`} secondary={true}>
            {formStrings.buttonTwo}
          </GovUK.Button>
        </GovUK.ButtonGroup>
      </form>
    </>
  );
}
