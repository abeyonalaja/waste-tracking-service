import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import * as GovUK from '@wts/ui/govuk-react-ui';

export interface RemoveStrings {
  backLink: string;
  caption: string;
  title: string;
  yesRadio: string;
  noRadio: string;
  saveAndContinue: string;
  saveAndReturn: string;
  errorMessage: string;
  errorSummary: string;
}

interface RemoveProps {
  id: string;
  code: {
    code: string;
    description: string;
  };
  token: string;
  apiUrl: string;
  strings: RemoveStrings;
  setCodeToRemove: React.Dispatch<React.SetStateAction<string>>;
}

export function Remove({
  id,
  code,
  token,
  apiUrl,
  strings,
  setCodeToRemove,
}: RemoveProps): React.ReactNode {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selection, setSelection] = useState<'yes' | 'no'>();
  const [showError, setShowError] = useState(false);

  const removeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${apiUrl}/ukwm/drafts/${id}/sic-code/${code.code}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sicCodes', id] });
      setCodeToRemove('');
      return;
    },
    onError: (error) => {
      console.error('An error occured whilst removing SIC code: ', error);
      router.push('/error');
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelection(e.target.value as 'yes' | 'no');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selection === undefined) {
      window.scrollTo(0, 0);
      setShowError(true);
      return;
    }

    if (selection === 'no') {
      window.scrollTo(0, 0);
      setCodeToRemove('');
    }
    if (selection === 'yes') {
      removeMutation.mutate();
    }
  }

  return (
    <div>
      {showError && (
        <GovUK.ErrorSummary
          headingErrorText={strings.errorSummary}
          errors={[
            { text: strings.errorMessage, href: '#remove-code-radio-1' },
          ]}
        />
      )}
      <GovUK.Caption>{strings.caption}</GovUK.Caption>
      <GovUK.Heading id="confirm-removal">{strings.title}</GovUK.Heading>
      <p>
        <span className="govuk-!-font-weight-bold">{code.code}</span>{' '}
        {code.description}
      </p>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <GovUK.FormGroup error={showError} id="remove-code">
          {showError && (
            <GovUK.ErrorMessage>{strings.errorMessage}</GovUK.ErrorMessage>
          )}
          <GovUK.Radios
            name="remove-code"
            ariaLabelledBy="confirm-removal"
            value={selection}
            onChange={handleChange}
            options={[
              { text: strings.yesRadio, value: 'yes' },
              { text: strings.noRadio, value: 'no' },
            ]}
          />
        </GovUK.FormGroup>
        <GovUK.ButtonGroup>
          <GovUK.Button type="submit">{strings.saveAndContinue}</GovUK.Button>
        </GovUK.ButtonGroup>
      </form>
    </div>
  );
}
