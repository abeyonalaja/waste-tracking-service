import * as GovUK from '@wts/ui/govuk-react-ui';
import { useLocale } from 'next-intl';
import {
  ukwm as ukwmValidation,
  common as commonValidation,
} from '@wts/util/shared-validation';
import { ContentStrings, FormValues, ViewType } from './types';
import { FormErrors } from '../../types';
import { useState } from 'react';
import { Page } from '@wts/ui/shared-ui/server';
import { useRouter } from 'next/navigation';
import { createErrorSummaryErrors, formHasErrors } from '../../util';
import { useSearchParams } from 'next/navigation';

interface ManualProps {
  id: string;
  token: string | null | undefined;
  manualContent?: React.ReactNode;
  formValues: FormValues;
  updateFormValues: (formValues: FormValues) => void;
  updateView: (view: ViewType) => void;
  content: ContentStrings;
  mode?: 'edit' | 'create';
  apiPartial: string;
  section: ukwmValidation.Section;
}

export function Manual({
  id,
  token,
  manualContent,
  formValues,
  updateFormValues,
  updateView,
  content,
  mode,
  apiPartial,
  section,
}: ManualProps): JSX.Element {
  const locale = useLocale() as commonValidation.Locale;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    updateFormValues({ ...formValues, [name]: value });
  };

  const handleSecondaryButton = async (event: React.MouseEvent) => {
    await handleSubmit(event, true);
  };

  const handleSubmit = async (
    event: React.FormEvent,
    returnToDraft = false,
  ): Promise<void> => {
    event.preventDefault();
    const errors: FormErrors = {};
    const buildingNameValidationResult = ukwmValidation.uiSharedValidation(
      formValues.buildingNameOrNumber,
      ukwmValidation.validationRules.validateBuildingNameOrNumber,
      '#buildingNameOrNumber',
      section,
      locale,
      'ui',
    );
    const addressLine1ValidationResult = ukwmValidation.uiSharedValidation(
      formValues.addressLine1,
      ukwmValidation.validationRules.validateAddressLine1,
      '#addressLine1',
      section,
      locale,
    );
    const addressLine2ValidationResult = ukwmValidation.uiSharedValidation(
      formValues.addressLine2,
      ukwmValidation.validationRules.validateAddressLine2,
      '#addressLine2',
      section,
      locale,
    );
    const townCityValidationResult = ukwmValidation.uiSharedValidation(
      formValues.townCity,
      ukwmValidation.validationRules.validateTownOrCity,
      '#townCity',
      section,
      locale,
    );
    const postcodeValidationResult = ukwmValidation.uiSharedValidation(
      formValues.postcode,
      ukwmValidation.validationRules.validatePostcode,
      '#postcode',
      section,
      locale,
    );
    const countryValidationResult = ukwmValidation.uiSharedValidation(
      formValues.country,
      ukwmValidation.validationRules.validateCountry,
      '#country',
      section,
      locale,
    );

    if (!buildingNameValidationResult.valid)
      errors.buildingNameOrNumber = buildingNameValidationResult;
    if (
      !addressLine1ValidationResult.valid &&
      (!returnToDraft || formValues.addressLine1)
    )
      errors.addressLine1 = addressLine1ValidationResult;
    if (
      !addressLine2ValidationResult.valid &&
      (!returnToDraft || formValues.addressLine2)
    )
      errors.addressLine2 = addressLine2ValidationResult;
    if (
      !townCityValidationResult.valid &&
      (!returnToDraft || formValues.townCity)
    )
      errors.townCity = townCityValidationResult;
    if (!postcodeValidationResult.valid && formValues.postcode)
      errors.postcode = postcodeValidationResult;
    if (
      !countryValidationResult.valid &&
      (!returnToDraft || formValues.country)
    )
      errors.country = countryValidationResult;

    if (formHasErrors(errors)) {
      setFormErrors(errors);
      window.scrollTo(0, 0);
    } else {
      setFormErrors({});
      formValues.addressSelection = JSON.stringify({
        buildingNameOrNumber: formValues.buildingNameOrNumber || '',
        addressLine1: formValues.addressLine1,
        addressLine2: formValues.addressLine2 || '',
        townCity: formValues.townCity,
        postcode: formValues.postcode,
        country: formValues.country,
      });
      updateFormValues(formValues);
      if (returnToDraft) {
        await handleSave();
      } else {
        updateView('confirm');
      }
    }
  };

  const handleSave = async () => {
    let response: Response;
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm/drafts/${id}${apiPartial}?saveAsDraft=true`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: formValues.addressSelection,
        },
      );
      if (response.ok) {
        router.push(`/single/${id}`);
      }
    } catch (error) {
      console.error(error);
      router.push('/error');
    }
  };

  const countryOptions = [
    { text: 'England', value: 'England' },
    { text: 'Scotland', value: 'Scotland' },
    { text: 'Wales', value: 'Wales' },
    { text: 'Northern Ireland', value: 'Northern Ireland' },
  ];

  const handleBackLink = (event: React.MouseEvent) => {
    event.preventDefault();
    updateFormValues({ ...formValues, postcode: '' });
    if (mode === 'edit') router.push(`/single/${id}`);
    updateView('search');
  };

  if (mode === 'create') {
    const defaultFormValues: FormValues = {
      postcode: '',
      buildingNameOrNumber: '',
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      country: '',
      addressSelection: '',
    };
    updateFormValues(defaultFormValues);
  }

  return (
    <Page beforeChildren={<GovUK.BackLink onClick={handleBackLink} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          {formHasErrors(formErrors) && (
            <GovUK.ErrorSummary
              headingErrorText="There is a problem"
              errors={createErrorSummaryErrors(formErrors)}
            />
          )}
          {manualContent}
          <form onSubmit={handleSubmit}>
            <GovUK.Input
              id="buildingNameOrNumber"
              name="buildingNameOrNumber"
              label={content.buildingNameLabel}
              hint={content.buildingNameHint}
              onChange={handleChange}
              value={formValues.buildingNameOrNumber}
              error={formErrors.buildingNameOrNumber?.errors?.[0]?.message}
            />
            <GovUK.Input
              id="addressLine1"
              name="addressLine1"
              label={content.addressLine1Label}
              hint={content.addressLine1Hint}
              inputAutoComplete="address-line1"
              onChange={handleChange}
              value={formValues.addressLine1}
              error={formErrors.addressLine1?.errors?.[0]?.message}
            />
            <GovUK.Input
              id="addressLine2"
              name="addressLine2"
              label={content.addressLine2Label}
              hint={content.addressLine2Hint}
              onChange={handleChange}
              value={formValues.addressLine2}
              error={formErrors.addressLine2?.errors?.[0]?.message}
            />
            <GovUK.Input
              id="townCity"
              name="townCity"
              label={content.townCityLabel}
              inputAutoComplete="address-line2"
              onChange={handleChange}
              value={formValues.townCity}
              error={formErrors.townCity?.errors?.[0]?.message}
            />
            <GovUK.Input
              id="postcode"
              name="postcode"
              label={content.postcodeLabel}
              inputAdditionalClassName="govuk-input--width-10"
              inputAutoComplete="postal-code"
              onChange={handleChange}
              value={formValues.postcode}
              error={formErrors.postcode?.errors?.[0]?.message}
            />
            <GovUK.Radios
              name="country"
              options={countryOptions}
              small
              legendText={content.countryLabel}
              onChange={handleChange}
              value={formValues.country}
              error={formErrors.country?.errors?.[0]?.message}
            />
            <GovUK.ButtonGroup>
              <GovUK.Button text={content.buttonSave} />

              {!searchParams.get('check') && (
                <GovUK.Button
                  secondary
                  text={content.buttonSecondary}
                  onClick={(e: React.MouseEvent) => handleSecondaryButton(e)}
                />
              )}
            </GovUK.ButtonGroup>
          </form>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
