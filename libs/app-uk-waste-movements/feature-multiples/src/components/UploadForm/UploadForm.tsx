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
  };
  totalErrorSummaryStrings?: {
    heading: string;
    prompt: string;
    linkText: string;
  };
  validationError?: string;
  showHint?: boolean;
  totalErrorCount?: number;
  token: string;
  children: React.ReactNode;
}

export function UploadForm({
  strings,
  totalErrorSummaryStrings,
  validationError,
  showHint = true,
  totalErrorCount,
  token,
  children,
}: UploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errors, setErrors] = useState(() =>
    validationError ? [{ text: validationError, href: '#file-upload' }] : null
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  function validateFile(file: File | null | undefined): string | void {
    if (file === null || file === undefined || file.type !== 'text/csv') {
      window.scrollTo(0, 0);
      return 'Upload a CSV file';
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setButtonDisabled(true);
    setErrors(null);

    if (validateFile(file)) {
      setButtonDisabled(false);
      setFile(null);
      setErrors([{ text: validateFile(file)!, href: '#file-upload' }]);
      return;
    }

    const formData = new FormData();
    formData.append('input', file!);

    let response: Response;

    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm-batches`,
        {
          method: 'POST',
          body: formData,
          headers: {
            // Mock API only works with no defined content type
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // TODO: Get token from context
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
      router.push(`/404`);
    }

    if (response!.status === 201) {
      const data = await response!.json();
      router.push(`/multiples/${data.id}?filename=${file!.name}`);
    } else {
      router.push(`/404`);
    }
  }

  return (
    <>
      {!errors && totalErrorCount && (
        <TotalErrorSummary
          strings={totalErrorSummaryStrings!}
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
