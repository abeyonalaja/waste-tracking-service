'use client';

import { useState } from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';

interface UploadFormProps {
  strings: {
    heading: string;
    hint: string;
    button: string;
  };
  children: React.ReactNode;
}

export function UploadForm({ strings, children }: UploadFormProps) {
  const [file, setFile] = useState<File>();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(file?.name);
  }

  return (
    <>
      {/* <p> --- Validation Errors to go here --- </p> */}
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
          onChange={handleFileChange}
        />
        <GovUK.Button>{strings.button}</GovUK.Button>
      </form>
    </>
  );
}
