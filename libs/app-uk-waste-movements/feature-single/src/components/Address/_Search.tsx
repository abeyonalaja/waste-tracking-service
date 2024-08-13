import * as GovUK from '@wts/ui/govuk-react-ui';
import { useState } from 'react';
import Link from 'next/link';
import { createErrorSummaryErrors, formHasErrors } from '../../util';
import type { Address } from '@wts/api/address';
import { ukwm as ukwmValidation } from '@wts/util/shared-validation';
import {
  AddressSearchResult,
  ContentStrings,
  FormValues,
  ViewType,
} from './types';
import { FormErrors } from '../../types';
import { Page } from '@wts/ui/shared-ui/server';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface SearchProps {
  token: string | null | undefined;
  searchContent?: React.ReactNode;
  formValues: FormValues;
  updateFormValues: (formValues: FormValues) => void;
  updateView: (view: ViewType) => void;
  updateAddressData?: (data: AddressSearchResult[]) => void;
  content: ContentStrings;
}

export function Search({
  token,
  searchContent,
  formValues,
  updateFormValues,
  updateView,
  updateAddressData,
  content,
}: SearchProps): JSX.Element {
  const router = useRouter();
  const locale = useLocale() as ukwmValidation.Locale;
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    updateFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const errors: FormErrors = {};
    const postcodeValidationResult = ukwmValidation.uiSharedValidation(
      formValues.postcode,
      ukwmValidation.validationRules.validatePostcode,
      '#postcode',
      'Producer',
      locale,
    );
    if (!postcodeValidationResult.valid) {
      errors.postcode = postcodeValidationResult;
    }
    if (formHasErrors(errors)) {
      setFormErrors(errors);
      window.scrollTo(0, 0);
      return;
    } else {
      setFormErrors({});
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/addresses?postcode=${formValues.postcode}&buildingNameOrNumber=${formValues.buildingNameOrNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          updateView('noResults');
        } else if (data.length === 1) {
          updateFormValues({
            ...formValues,
            addressSelection: JSON.stringify(data[0]),
          });
          updateAddressData?.([
            {
              text: `${data[0].addressLine1}, ${data[0].addressLine2}, ${data[0].townCity}, ${data[0].postcode}, ${data[0].country}`,
              value: JSON.stringify(data[0]),
            },
          ]);
          updateView('confirm');
        } else {
          updateView('results');
          const addresses = data.map((address: Address) => ({
            text: `${address.addressLine1}, ${address.addressLine2}, ${address.townCity}, ${address.postcode}, ${address.country}`,
            value: JSON.stringify({ ...address, buildingNameOrNumber: '' }),
          }));
          updateAddressData?.(addresses);
        }
      } else {
        router.push('/error');
      }
    } catch (error) {
      console.error(error);
      router.push('/error');
    }
  };

  return (
    <Page beforeChildren={<GovUK.BackLink href={'../'} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          {formHasErrors(formErrors) && (
            <GovUK.ErrorSummary
              headingErrorText="There is a problem"
              errors={createErrorSummaryErrors(formErrors)}
            />
          )}
          {searchContent}
          <form onSubmit={handleSubmit}>
            <GovUK.Input
              id="postcode"
              name="postcode"
              label={content.inputLabel}
              hint={content.inputHint}
              inputAdditionalClassName="govuk-input--width-10"
              inputAutoComplete="postal-code"
              onChange={handleChange}
              error={formErrors.postcode?.errors?.[0]?.message}
            />
            <GovUK.Input
              id="buildingNameOrNumber"
              name="buildingNameOrNumber"
              label={content.buildingNameLabel}
              hint={content.buildingNameHint}
              inputAdditionalClassName="govuk-input--width-10"
              onChange={handleChange}
            />
            <GovUK.Button text={content.button} />
            <GovUK.Paragraph>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  updateView('manual');
                }}
              >
                {content.manualLink}
              </Link>
            </GovUK.Paragraph>
            <GovUK.Button secondary text={content.buttonSecondary} href="../" />
          </form>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
