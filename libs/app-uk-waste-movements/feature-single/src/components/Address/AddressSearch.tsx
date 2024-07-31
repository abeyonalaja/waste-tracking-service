'use client';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { ukwm as ukwmValidation } from '@wts/util/shared-validation';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { Address } from '@wts/api/address';

interface FormErrors {
  postcode?: ukwmValidation.uiValidationResult;
}

interface FormValues {
  postcode: string;
  building: string;
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((error) => error.valid === false);
}

interface AddressSearchProps {
  searchContent?: React.ReactNode;
  resultsContent?: React.ReactNode;
  noResultsContent?: React.ReactNode;
  token: string | null | undefined;
}

const defaultFormValues: FormValues = {
  postcode: '',
  building: '',
};

export function AddressSearch({
  searchContent,
  resultsContent,
  noResultsContent,
  token,
}: AddressSearchProps): JSX.Element {
  const locale = useLocale() as ukwmValidation.Locale;
  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const [view, setView] = useState<
    'search' | 'results' | 'noResults' | 'manual' | 'confirm'
  >('search');
  const [data, setData] = useState<[]>();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }
  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    const errors: FormErrors = {
      postcode: ukwmValidation.uiValidation(
        formValues.postcode,
        ukwmValidation.validationRules.validatePostcode,
        '#postcode',
        locale,
      ),
    };
    if (hasErrors(errors)) {
      setFormErrors(errors);
      window.scrollTo(0, 0);
      return;
    } else {
      setFormErrors({});
    }
    let response: Response;
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/addresses?postcode=${formValues.postcode}&buildingNameOrNumber=${formValues.building}`,
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
          setView('noResults');
        } else if (data.length === 1) {
          setView('confirm');
        } else {
          setView('results');
          const addresses = data.map((address: Address) => {
            return {
              text: `${address.addressLine1}, ${address.addressLine2}, ${address.townCity}, ${address.postcode}, ${address.country}`,
              value: JSON.stringify(address),
            };
          });
          setData(addresses);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  const errorsToDisplay = Object.values(formErrors).map((error) => {
    return {
      text: error.errors[0].message,
      href: error.href,
    };
  });
  return (
    <>
      {view === 'search' && (
        <>
          {hasErrors(formErrors) && (
            <GovUK.ErrorSummary
              headingErrorText="There is a problem"
              errors={errorsToDisplay}
            ></GovUK.ErrorSummary>
          )}
          {searchContent}
          <form onSubmit={handleSubmit}>
            <GovUK.Input
              id={'postcode'}
              name={'postcode'}
              label={'Search by postcode'}
              hint={'For example, AA3 1AB or M2 6LW'}
              inputAdditionalClassName={'govuk-input--width-10'}
              inputAutoComplete={'postal-code'}
              onChange={handleChange}
              error={
                formErrors.postcode && 'errors' in formErrors.postcode
                  ? formErrors.postcode.errors[0].message
                  : undefined
              }
            />
            <GovUK.Input
              id={'building'}
              name={'building'}
              label={'Building name or number (optional)'}
              hint={'For example, 15 or Heron House'}
              inputAdditionalClassName={'govuk-input--width-10'}
              onChange={handleChange}
            />
            <GovUK.Button text={'Search postcode'} />
            <GovUK.Paragraph>
              <Link
                href={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  setView('manual');
                }}
              >
                Or enter the address manually
              </Link>
            </GovUK.Paragraph>
            <GovUK.Button
              secondary={true}
              text={'Save and return'}
              href={'../'}
            />
          </form>
        </>
      )}
      {view === 'results' && (
        <>
          {resultsContent}
          <GovUK.Paragraph>
            {data?.length} addresses found for {formValues.postcode}.{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setFormValues(defaultFormValues);
                setView('search');
              }}
            >
              Search again
            </a>
          </GovUK.Paragraph>
          <GovUK.Radios name={'addressSearchResults'} options={data!} />
          <GovUK.ButtonGroup>
            <GovUK.Button text={'Save and continue'} />
            <GovUK.Button text={'Save and return'} secondary={true} />
          </GovUK.ButtonGroup>
          <GovUK.Paragraph>
            <Link href={'#'} onClick={() => setView('manual')}>
              Enter the address manually
            </Link>
          </GovUK.Paragraph>
        </>
      )}
      {view === 'noResults' && (
        <>
          {noResultsContent}
          <GovUK.Paragraph>
            We could not find an address that matches {formValues.postcode}
            {formValues.building ? ` and ${formValues.building}` : ''}. You can
            search again or enter the address manually.
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setFormValues(defaultFormValues);
                setView('search');
              }}
            >
              Search again
            </a>
          </GovUK.Paragraph>
          <GovUK.Paragraph mb={8}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setFormValues(defaultFormValues);
                setView('manual');
              }}
            >
              Enter the address manually
            </a>
          </GovUK.Paragraph>
          <GovUK.ButtonGroup>
            <GovUK.Button text={'Save and continue'} href={'../'} />
            <GovUK.Button
              secondary={true}
              text={'Save and return'}
              href={'../'}
            />
          </GovUK.ButtonGroup>
        </>
      )}
      {view === 'manual' && <>Manual form</>}
      {view === 'confirm' && <>Confirmation</>}
    </>
  );
}
