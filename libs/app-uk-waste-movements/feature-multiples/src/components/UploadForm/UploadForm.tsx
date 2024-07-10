'use client';

import { useState } from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useRouter } from '@wts/ui/navigation';
import { TotalErrorSummary } from '../TotalErrorSummary';

interface UploadFormProps {
  strings: {
    heading: string;
    hint: string;
    button: string;
    errorLabel: string;
    summaryLabel: string;
    missingFileError: string;
    exceedsFileSizeError: string;
    invalidFileTypeError: string;
  };
  totalErrorSummaryStrings?: {
    heading: string;
    prompt: string;
    linkText: string;
  };
  validationError?: string;
  showHint?: boolean;
  totalErrorCount?: number;
  token: string | null | undefined;
  children: React.ReactNode;
}

export function UploadForm({
  strings,
  totalErrorSummaryStrings,
  validationError,
  showHint = true,
  totalErrorCount = 0,
  token,
  children,
}: UploadFormProps): React.ReactNode {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errors, setErrors] = useState(() =>
    validationError ? [{ text: validationError, href: '#file-upload' }] : null,
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setButtonDisabled(true);
    setErrors(null);

    if (file === null) {
      setButtonDisabled(false);
      window.scrollTo(0, 0);
      setErrors([{ text: strings.missingFileError, href: '#file-upload' }]);
      return;
    }

    if (file.size >= 15 * 1024 * 1024) {
      setButtonDisabled(false);
      window.scrollTo(0, 0);
      setErrors([{ text: strings.exceedsFileSizeError, href: '#file-upload' }]);
      return;
    }

    if (file.type !== 'text/csv') {
      setButtonDisabled(false);
      window.scrollTo(0, 0);
      setErrors([{ text: strings.invalidFileTypeError, href: '#file-upload' }]);
      return;
    }

    const formData = new FormData();
    formData.append('input', file);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let response: Response;

    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm-batches`,
        {
          method: 'POST',
          body: formData,
          headers,
        },
      );
    } catch (error) {
      console.error(error);
      return router.push(`/404`);
    }

    if (response.status === 201) {
      const data = await response.json();
      const hasCorrectedErrors =
        totalErrorCount > 0
          ? '&hasCorrectedErrors=true'
          : '&hasCorrectedErrors=false';
      router.push(
        `/multiples/${data.id}?filename=${file.name}${hasCorrectedErrors}`,
      );
    } else {
      router.push(`/404`);
    }
  }

  return (
    <>
      {!errors && totalErrorCount > 0 && totalErrorSummaryStrings && (
        <TotalErrorSummary
          strings={totalErrorSummaryStrings}
          href="#error-tabs"
        />
      )}

      {errors && (
        <GovUK.ErrorSummary
          headingErrorText={strings.summaryLabel}
          errors={errors}
        />
      )}
      {children}
      {showHint && <GovUK.SectionBreak size="l" />}
      <form onSubmit={handleSubmit}>
        <GovUK.Heading level={2} size="m">
          <label htmlFor="file-upload">{strings.heading}</label>
        </GovUK.Heading>
        {showHint && <GovUK.Hint>{strings.hint}</GovUK.Hint>}
        <GovUK.FileUpload
          id="file-upload"
          name="csvUpload"
          accept=".csv"
          errorLabel={strings.errorLabel}
          errorMessage={errors && errors[0]['text']}
          onChange={handleFileChange}
        />
        <GovUK.Button disabled={buttonDisabled}>{strings.button}</GovUK.Button>
      </form>
    </>
  );
}
