'use client';

import { useState } from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useRouter } from '@wts/ui/navigation';

interface UploadFormProps {
  strings: {
    heading: string;
    hint: string;
    button: string;
    errorLabel: string;
    summaryLabel: string;
  };
  validationError?: string;
  token: string;
  children: React.ReactNode;
}

export function UploadForm({
  strings,
  validationError,
  token,
  children,
}: UploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
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
    setErrors(null);

    if (validateFile(file)) {
      setFile(null);
      setErrors([{ text: validateFile(file)!, href: '#file-upload' }]);
      return;
    }

    const formData = new FormData();
    formData.append('input', file!);

    const response = await fetch(
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

    if (response.status === 201) {
      const data = await response.json();
      router.push(`/multiples/${data.id}?filename=${file!.name}`);
    } else {
      // TODO handle error
      console.log('error');
    }
  }

  return (
    <>
      {errors && (
        <GovUK.ErrorSummary
          headingErrorText={strings.summaryLabel}
          errors={errors}
        />
      )}
      {children}
      <GovUK.SectionBreak size="l" />
      <form onSubmit={handleSubmit}>
        <GovUK.Heading level={2} size="m">
          {strings.heading}
        </GovUK.Heading>
        <GovUK.Hint>{strings.hint}</GovUK.Hint>
        <GovUK.FileUpload
          id="file-upload"
          name="csvUpload"
          accept=".csv"
          errorLabel={strings.errorLabel}
          errorMessage={errors && errors[0]['text']}
          onChange={handleFileChange}
        />
        <GovUK.Button>{strings.button}</GovUK.Button>
      </form>
    </>
  );
}
