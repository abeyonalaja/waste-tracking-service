import * as GovUK from '@wts/ui/govuk-react-ui';
import { createErrorSummaryErrors, formHasErrors } from '../../util';
import { ukwm as ukwmValidation } from '@wts/util/shared-validation';
import {
  AddressSearchResult,
  ContentStrings,
  FormValues,
  ViewType,
} from './types';
import { FormErrors } from '../../types';
import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Page } from '@wts/ui/shared-ui/server';

interface ResultsProps {
  resultsContent: React.ReactNode;
  formValues: FormValues;
  addressData?: AddressSearchResult[];
  updateView: (view: ViewType) => void;
  updateFormValues: (formValues: FormValues) => void;
  content: ContentStrings;
}

export function Results({
  resultsContent,
  formValues,
  addressData,
  updateView,
  updateFormValues,
  content,
}: ResultsProps): JSX.Element {
  const locale = useLocale() as ukwmValidation.Locale;
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    updateFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const errors: FormErrors = {};

    const addressValidationResult = ukwmValidation.uiValidation(
      formValues.addressSelection,
      ukwmValidation.validationRules.validateAddressSelection,
      '#addressSelection',
      locale,
    );
    if (!addressValidationResult.valid) {
      errors.addressSelection = addressValidationResult;
    }
    if (formHasErrors(errors)) {
      setFormErrors(errors);
      window.scrollTo(0, 0);
      return;
    }
    setFormErrors({});
    updateView('confirm');
  };

  const handleBackLink = (event: React.MouseEvent) => {
    event.preventDefault();
    updateFormValues({
      ...formValues,
      postcode: '',
      addressSelection: '',
      buildingNameOrNumber: '',
    });
    updateView('search');
  };

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
          {resultsContent}
          {addressData && (
            <>
              <GovUK.Paragraph>
                {addressData.length} addresses found for {formValues.postcode}.{' '}
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    updateView('search');
                  }}
                >
                  {content.searchAgain}
                </Link>
              </GovUK.Paragraph>
              <form onSubmit={handleSubmit}>
                <GovUK.Radios
                  name="addressSelection"
                  options={addressData}
                  onChange={handleChange}
                  legendText={content.legend}
                  legendHidden={true}
                  error={formErrors.addressSelection?.errors?.[0]?.message}
                  value={formValues.addressSelection}
                />
                <GovUK.ButtonGroup>
                  <GovUK.Button text={content.buttonSave} />
                  <GovUK.Button text={content.buttonSecondary} secondary />
                </GovUK.ButtonGroup>
              </form>
            </>
          )}
          <GovUK.Paragraph>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                updateView('manual');
              }}
            >
              {content.manualLinkShort}
            </Link>
          </GovUK.Paragraph>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
