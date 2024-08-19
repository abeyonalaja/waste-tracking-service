'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as GovUK from '@wts/ui/govuk-react-ui';

interface FormStrings {
  radioOne: string;
  radioTwo: string;
  radioThree: string;
  radioFour: string;
  buttonOne: string;
  buttonTwo: string;
  errorSummaryTitle: string;
  errorMessage: string;
}

type WasteSource =
  | 'Commerical'
  | 'Industrial'
  | 'Construction and demolition'
  | 'Household';

interface WasteSourceFormProps {
  id: string;
  token: string;
  wasteSource?: WasteSource;
  formStrings: FormStrings;
  children: React.ReactNode;
}

export function WasteSourceForm({
  id,
  token,
  wasteSource: wasteSourceProp,
  formStrings,
  children,
}: WasteSourceFormProps): React.ReactNode {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [wasteSource, setWasteSource] = useState<WasteSource | undefined>(
    wasteSourceProp,
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setWasteSource(event.target.value as WasteSource);
  }

  async function handleSubmit(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
    submitType: 'continueToNextPage' | 'returnToTaskList',
  ): Promise<void> {
    event.preventDefault();
    setButtonDisabled(true);

    if (!wasteSource && submitType === 'continueToNextPage') {
      setShowError(true);
      setButtonDisabled(false);
      window.scrollTo(0, 0);
      return;
    }

    if (!wasteSource && submitType === 'returnToTaskList') {
      return router.push(`/single/${id}`);
    }

    let response: Response;
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm/drafts/${id}/waste-source`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wasteSource: wasteSource,
          }),
        },
      );

      if (response.ok) {
        if (submitType === 'continueToNextPage') {
          // Checks to see if all other producer sections are complete to determine
          // if the user should be redirected to the check your answers page or task list
          const sectionResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm/drafts/${id}`,
            {
              method: 'GET',
              cache: 'no-store',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!sectionResponse.ok) {
            console.error('Error fetching draft');
            return router.push('/error');
          }

          const draft = await sectionResponse.json();

          // TODO: Add check for SIC code completeness once implemented
          const otherProducerSectionsAreComplete =
            draft.producerAndCollection.producer.contact.status ===
              'Complete' &&
            draft.producerAndCollection.producer.address.status ===
              'Complete' &&
            draft.producerAndCollection.wasteCollection.status === 'Complete' &&
            draft.producerAndCollection.wasteSource.status === 'Complete';

          if (otherProducerSectionsAreComplete) {
            window.location.assign(
              `/move-waste/single/${id}/producer/check-your-answers`,
            );
            return;
          } else {
            window.location.assign(`/move-waste/single/${id}`);
            return;
          }
        }
        return router.push(`/single/${id}`);
      }
    } catch (error) {
      console.error(error);
      router.push('/error');
    }
  }

  return (
    <>
      {showError && (
        <GovUK.ErrorSummary
          headingErrorText={formStrings.errorSummaryTitle}
          errors={[{ text: formStrings.errorMessage, href: '#waste-source' }]}
        />
      )}
      {children}
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          handleSubmit(e, 'continueToNextPage')
        }
      >
        <GovUK.FormGroup error={showError} id="waste-source">
          {showError && (
            <GovUK.ErrorMessage>{formStrings.errorMessage}</GovUK.ErrorMessage>
          )}
          <GovUK.Radios
            name="waste-source"
            value={wasteSource}
            onChange={handleChange}
            options={[
              { text: formStrings.radioOne, value: 'Commercial' },
              { text: formStrings.radioTwo, value: 'Industrial' },
              {
                text: formStrings.radioThree,
                value: 'Construction and demolition',
              },
              { text: formStrings.radioFour, value: 'Household' },
            ]}
          />
        </GovUK.FormGroup>
        <GovUK.ButtonGroup>
          <GovUK.Button type="submit" disabled={buttonDisabled}>
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
