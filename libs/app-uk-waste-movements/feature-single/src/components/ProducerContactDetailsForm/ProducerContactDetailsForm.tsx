'use client';

import { useState } from 'react';
import { ukwm as ukwmValidation } from '@wts/util/shared-validation';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { FormErrors } from '../../types/types';
import { createErrorSummaryErrors, formHasErrors } from '../../util';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { ukwm } from '@wts/util/shared-validation';

interface FormStrings {
  errorSummaryHeading: string;
  labelOne: string;
  labelTwo: string;
  hintOne: string;
  labelThree: string;
  labelFour: string;
  hintTwo: string;
  labelFive: string;
  buttonOne: string;
  buttonTwo: string;
}

interface InitialFormState {
  organisationName?: string;
  organisationContactPerson?: string;
  emailAddress?: string;
  phoneNumber?: string;
  faxNumber?: string;
}

interface ProducerContactDetailsFormProps {
  id: string;
  initialFormState: InitialFormState;
  token: string;
  formStrings: FormStrings;
  children: React.ReactNode;
  section: ukwm.Section;
}

export function ProducerContactDetailsForm({
  id,
  initialFormState,
  token,
  formStrings,
  children,
  section,
}: ProducerContactDetailsFormProps): React.ReactNode {
  const router = useRouter();
  const locale = useLocale() as ukwmValidation.Locale;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<InitialFormState>({
    organisationName: initialFormState.organisationName ?? '',
    organisationContactPerson: initialFormState.organisationContactPerson ?? '',
    emailAddress: initialFormState.emailAddress ?? '',
    phoneNumber: initialFormState.phoneNumber ?? '',
    faxNumber: initialFormState.faxNumber ?? '',
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  }
  async function handleSubmit(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
    submitType: 'continueToNextPage' | 'returnToTaskList',
  ): Promise<void> {
    event.preventDefault();
    setButtonDisabled(true);

    const errors: FormErrors = {};
    const organisationNameValidationResult = ukwmValidation.uiSharedValidation(
      formState?.organisationName,
      ukwmValidation.validationRules.validateOrganisationName,
      '#organisation-name',
      section,
      locale,
      'ui',
    );

    if (
      (!organisationNameValidationResult.valid &&
        submitType === 'continueToNextPage') ||
      (!organisationNameValidationResult.valid &&
        formState?.organisationName &&
        submitType === 'returnToTaskList')
    ) {
      errors.organisationName = organisationNameValidationResult;
    }

    const organisationContactPersonValidationResult =
      ukwmValidation.uiSharedValidation(
        formState?.organisationContactPerson,
        ukwmValidation.validationRules.validateFullName,
        '#organisation-contact-person',
        section,
        locale,
        'ui',
      );

    if (
      (!organisationContactPersonValidationResult.valid &&
        submitType === 'continueToNextPage') ||
      (!organisationContactPersonValidationResult.valid &&
        formState?.organisationContactPerson &&
        submitType === 'returnToTaskList')
    ) {
      errors.organisationContactPerson =
        organisationContactPersonValidationResult;
    }

    const emailAddressValidationResult = ukwmValidation.uiSharedValidation(
      formState?.emailAddress,
      ukwmValidation.validationRules.validateEmail,
      '#email-address',
      section,
      locale,
      'ui',
    );

    if (
      (!emailAddressValidationResult.valid &&
        submitType === 'continueToNextPage') ||
      (!emailAddressValidationResult.valid &&
        formState?.emailAddress &&
        submitType === 'returnToTaskList')
    ) {
      errors.emailAddress = emailAddressValidationResult;
    }

    const phoneNumberValidationResult = ukwmValidation.uiSharedValidation(
      formState?.phoneNumber,
      ukwmValidation.validationRules.validatePhone,
      '#phone-number',
      section,
      locale,
      'ui',
    );

    if (
      (!phoneNumberValidationResult.valid &&
        submitType === 'continueToNextPage') ||
      (!phoneNumberValidationResult.valid &&
        formState?.phoneNumber &&
        submitType === 'returnToTaskList')
    ) {
      errors.phoneNumber = phoneNumberValidationResult;
    }

    const faxNumberValidationResult = ukwmValidation.uiSharedValidation(
      formState?.faxNumber,
      ukwmValidation.validationRules.validateFax,
      '#fax-number',
      section,
      locale,
      'ui',
    );

    if (
      formState?.faxNumber &&
      !faxNumberValidationResult.valid &&
      'errors' in faxNumberValidationResult
    ) {
      errors.faxNumber = faxNumberValidationResult;
    }

    if (formHasErrors(errors)) {
      setFormErrors(errors);
      setButtonDisabled(false);
      window.scrollTo(0, 0);
      return;
    } else {
      setFormErrors({});
    }

    const body: { [key: string]: string } = {};

    if (formState.organisationName) {
      body.organisationName = formState.organisationName;
    }
    if (formState.organisationContactPerson) {
      body.name = formState.organisationContactPerson;
    }
    if (formState.emailAddress) {
      body.email = formState.emailAddress;
    }
    if (formState.phoneNumber) {
      body.phone = formState.phoneNumber;
    }
    if (formState.faxNumber) {
      body.fax = formState.faxNumber;
    }

    let response: Response;
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm/drafts/${id}/producer-contact?saveAsDraft=${submitType === 'returnToTaskList'}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        if (submitType === 'continueToNextPage') {
          return router.push(`/single/${id}/producer/sic-code`);
        } else {
          return router.push(`/single/${id}`);
        }
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
        />
      )}
      {children}
      <form
        noValidate
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          handleSubmit(e, 'continueToNextPage')
        }
      >
        <GovUK.Input
          id="organisation-name"
          name="organisationName"
          label={formStrings.labelOne}
          value={formState.organisationName}
          onChange={handleChange}
          spellCheck={false}
          error={
            formErrors.organisationName &&
            'errors' in formErrors.organisationName
              ? formErrors.organisationName.errors[0].message
              : undefined
          }
        />
        <GovUK.Input
          id="organisation-contact-person"
          name="organisationContactPerson"
          label={formStrings.labelTwo}
          hint={formStrings.hintOne}
          value={formState.organisationContactPerson}
          spellCheck={false}
          onChange={handleChange}
          error={
            formErrors.organisationContactPerson &&
            'errors' in formErrors.organisationContactPerson
              ? formErrors.organisationContactPerson.errors[0].message
              : undefined
          }
        />
        <GovUK.Input
          id="email-address"
          name="emailAddress"
          label={formStrings.labelThree}
          type="email"
          spellCheck={false}
          value={formState.emailAddress}
          onChange={handleChange}
          error={
            formErrors.emailAddress && 'errors' in formErrors.emailAddress
              ? formErrors.emailAddress.errors[0].message
              : undefined
          }
        />
        <GovUK.Input
          type="tel"
          id="phone-number"
          name="phoneNumber"
          label={formStrings.labelFour}
          inputAdditionalClassName="govuk-input--width-20"
          hint={formStrings.hintTwo}
          value={formState.phoneNumber}
          ariaDescribedBy={true}
          onChange={handleChange}
          error={
            formErrors.phoneNumber && 'errors' in formErrors.phoneNumber
              ? formErrors.phoneNumber.errors[0].message
              : undefined
          }
        />

        <GovUK.Input
          id="fax-number"
          name="faxNumber"
          label={formStrings.labelFive}
          inputAdditionalClassName="govuk-input--width-20"
          value={formState.faxNumber}
          onChange={handleChange}
          error={
            formErrors.faxNumber && 'errors' in formErrors.faxNumber
              ? formErrors.faxNumber.errors[0].message
              : undefined
          }
        />
        <GovUK.ButtonGroup>
          <GovUK.Button disabled={buttonDisabled} type="submit">
            {formStrings.buttonOne}
          </GovUK.Button>
          <button
            disabled={buttonDisabled}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleSubmit(e, 'returnToTaskList')
            }
            className="govuk-button govuk-button--secondary"
          >
            {formStrings.buttonTwo}
          </button>
        </GovUK.ButtonGroup>
      </form>
    </>
  );
}
