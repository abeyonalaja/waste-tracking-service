'use client';
import { useState } from 'react';
import {
  ukwm as ukwmValidation,
  common as commonValidation,
} from '@wts/util/shared-validation';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { FormErrors } from '../../types/types';
import { createErrorSummaryErrors, formHasErrors } from '../../util';
import * as GovUK from '@wts/ui/govuk-react-ui';

interface UniqueReferenceFormProps {
  uniqueReference?: string;
  token: string;
  formStrings: {
    errorSummaryHeading: string;
    inputLabel: string;
    buttonLabel: string;
  };
  children: React.ReactNode;
}

export function UniqueReferenceForm({
  uniqueReference,
  token,
  formStrings,
  children,
}: UniqueReferenceFormProps): React.ReactNode {
  const router = useRouter();
  const locale = useLocale() as commonValidation.Locale;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formValues, setFormValues] = useState<{ uniqueReference: string }>({
    uniqueReference: uniqueReference ? uniqueReference : '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setButtonDisabled(true);
    const errors: FormErrors = {};

    const referenceValidationResult = ukwmValidation.uiValidation(
      formValues.uniqueReference,
      ukwmValidation.validationRules.validateReference,
      '#unique-reference',
      locale,
      'ui',
    );

    if (!referenceValidationResult.valid) {
      errors.uniqueReference = referenceValidationResult;
    }

    if (formHasErrors(errors)) {
      setFormErrors(errors);
      setButtonDisabled(false);
      window.scrollTo(0, 0);
      return;
    } else {
      setFormErrors({});
    }

    let response: Response;
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm/drafts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reference: formValues.uniqueReference,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        router.push(`/single/${data.id}`);
      }
    } catch (error) {
      console.error(error);
      router.push('/error');
    }
  }

  return (
    <>
      {formHasErrors(formErrors) && (
        <GovUK.ErrorSummary
          headingErrorText={formStrings.errorSummaryHeading}
          errors={createErrorSummaryErrors(formErrors)}
        ></GovUK.ErrorSummary>
      )}
      {children}
      <form onSubmit={handleSubmit}>
        <GovUK.Input
          id="unique-reference"
          name="uniqueReference"
          label={formStrings.inputLabel}
          value={formValues.uniqueReference}
          onChange={handleChange}
          error={
            formErrors.uniqueReference && 'errors' in formErrors.uniqueReference
              ? formErrors.uniqueReference.errors[0].message
              : undefined
          }
        />
        <button
          disabled={buttonDisabled}
          type="submit"
          className="govuk-button"
        >
          {formStrings.buttonLabel}
        </button>
      </form>
    </>
  );
}
