'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { AutoComplete } from '@wts/ui/shared-ui';
import type { SICCode } from '@wts/api/reference-data';

export interface AddStrings {
  title: string;
  label: string;
  hiddenError: string;
  selectionErrorMessage: string;
  errorMessageEmpty: string;
  errorMessageDuplicate: string;
  yesRadio: string;
  noRadio: string;
  saveAndContinue: string;
  saveAndReturn: string;
  errorSummary: string;
}

interface AddProps {
  id: string;
  token: string;
  apiUrl: string;
  addedCodes: string[];
  children: React.ReactNode;
  strings: AddStrings;
}

export function Add({
  id,
  token,
  apiUrl,
  addedCodes,
  children,
  strings,
}: AddProps): React.ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [codeToAdd, setCodeToAdd] = useState<SICCode>();
  const [codeError, setCodeError] = useState('');
  const [selection, setSelection] = useState('');
  const [selectionError, setSelectionError] = useState('');

  const referenceDataQuery = useQuery({
    queryKey: ['referenceSicCodes'],
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 60,

    queryFn: async () => {
      const response = await fetch(`${apiUrl}/reference-data/sic-codes`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (codeToAdd: string) => {
      const response = await fetch(`${apiUrl}/ukwm/drafts/${id}/sic-code`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sicCode: codeToAdd,
        }),
      });
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sicCodes', id] });
    },
    onError: (error) => {
      console.error('An error occured whilst adding SIC code: ', error);
      router.push('/error');
    },
  });

  function handleRadioChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelection(e.target.value);
  }

  async function handleSubmit(
    e: React.FormEvent,
    submitType: 'continueToNextPage' | 'returnToTaskList',
  ) {
    e.preventDefault();

    if (addedCodes.length === 0) {
      if (!selection && !codeToAdd && submitType === 'continueToNextPage') {
        setCodeError(strings.errorMessageEmpty);
        window.scrollTo(0, 0);
        return;
      }

      if (submitType === 'returnToTaskList') {
        return router.push(`/single/${id}`);
      }

      addMutation.mutate(codeToAdd?.code as string);
      return;
    }

    if (selection === 'no' && searchParams.get('check')) {
      return router.push(`/single/${id}/producer/check-your-answers`);
    }

    if (selection === 'no' && submitType === 'returnToTaskList') {
      return router.push(`/single/${id}`);
    }

    if (selection === 'no' && submitType === 'continueToNextPage') {
      return router.push(`/single/${id}/producer/collection-details/reuse`);
    }

    if (!selection && submitType === 'continueToNextPage') {
      setSelectionError(strings.selectionErrorMessage);
      window.scrollTo(0, 0);
      return;
    }

    if (
      selection === 'yes' &&
      !codeToAdd &&
      (submitType === 'continueToNextPage' || submitType === 'returnToTaskList')
    ) {
      setSelectionError('');
      setCodeError(strings.errorMessageEmpty);
      window.scrollTo(0, 0);
      return;
    }

    if (selection === 'yes' && addedCodes.includes(codeToAdd?.code as string)) {
      setSelectionError('');
      setCodeError(strings.errorMessageDuplicate);
      window.scrollTo(0, 0);
      return;
    }

    addMutation.mutate(codeToAdd?.code as string);

    if (submitType === 'returnToTaskList') {
      return router.push(`/single/${id}`);
    }
  }

  if (addedCodes.length === 0) {
    return (
      <>
        {codeError && (
          <GovUK.ErrorSummary
            headingErrorText={strings.errorSummary}
            errors={[{ text: codeError, href: '#sic-code' }]}
          />
        )}

        {children}
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
            handleSubmit(e, 'continueToNextPage')
          }
        >
          <div
            className={`govuk-form-group ${codeError && `govuk-form-group--error`}`}
          >
            <label className="govuk-label" htmlFor="sic-code">
              {strings.label}
            </label>
            {codeError && (
              <p id="contact-by-email-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">
                  {strings.hiddenError}
                </span>
                {codeError}
              </p>
            )}
            <AutoComplete
              id="sic-code"
              value={codeToAdd}
              options={referenceDataQuery.data}
              confirm={setCodeToAdd}
            />
          </div>
          <GovUK.ButtonGroup>
            <GovUK.Button type="submit">{strings.saveAndContinue}</GovUK.Button>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleSubmit(e, 'returnToTaskList')
              }
              className="govuk-button govuk-button--secondary"
            >
              {strings.saveAndReturn}
            </button>
          </GovUK.ButtonGroup>
        </form>
      </>
    );
  }

  return (
    <>
      {selectionError && (
        <GovUK.ErrorSummary
          headingErrorText={strings.errorSummary}
          errors={[{ text: selectionError, href: '#selection-yes' }]}
        />
      )}

      {codeError && (
        <GovUK.ErrorSummary
          headingErrorText={strings.errorSummary}
          errors={[{ text: codeError, href: '#sic-code' }]}
        />
      )}

      {children}
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          handleSubmit(e, 'continueToNextPage')
        }
      >
        <div
          className={`govuk-form-group ${selectionError && `govuk-form-group--error`}`}
        >
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h2 className="govuk-fieldset__heading">{strings.title}</h2>
            </legend>
            {selectionError && (
              <p id="selection-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">
                  {strings.hiddenError}
                </span>
                {selectionError}
              </p>
            )}
            <div className="govuk-radios" data-module="govuk-radios">
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="selection-yes"
                  name="selection-yes"
                  type="radio"
                  value="yes"
                  checked={selection === 'yes'}
                  onChange={handleRadioChange}
                  data-aria-controls="conditional-selection-yes"
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor="selection-yes"
                >
                  {strings.yesRadio}
                </label>
              </div>
              <div
                className={`govuk-radios__conditional ${selection !== 'yes' && 'govuk-radios__conditional--hidden'}`}
                id="conditional-selection-yes"
              >
                <div
                  className={`govuk-form-group ${codeError && `govuk-form-group--error`}`}
                >
                  <label className="govuk-label" htmlFor="sic-code">
                    {strings.label}
                  </label>

                  {codeError && (
                    <p id="sic-code-error" className="govuk-error-message">
                      <span className="govuk-visually-hidden">
                        {strings.hiddenError}
                      </span>
                      {codeError}
                    </p>
                  )}
                  <AutoComplete
                    id="sic-code"
                    value={codeToAdd}
                    options={referenceDataQuery.data}
                    confirm={setCodeToAdd}
                  />
                </div>
              </div>
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="selection-no"
                  name="selection-no"
                  type="radio"
                  value="no"
                  onChange={handleRadioChange}
                  checked={selection === 'no'}
                  data-aria-controls="conditional-selection-no"
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor="selection-no"
                >
                  {strings.noRadio}
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        <GovUK.ButtonGroup>
          <GovUK.Button type="submit">{strings.saveAndContinue}</GovUK.Button>
          {!searchParams.get('check') && (
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleSubmit(e, 'returnToTaskList')
              }
              className="govuk-button govuk-button--secondary"
            >
              {strings.saveAndReturn}
            </button>
          )}
        </GovUK.ButtonGroup>
      </form>
    </>
  );
}
