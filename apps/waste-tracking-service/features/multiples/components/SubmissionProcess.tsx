import { useState } from 'react';
import { SubmissionDeclaration } from './SubmissionDeclaration';
import { CancelSubmissionPrompt } from './CancelSubmissionPrompt';
import { ValidationSuccess } from './ValidationSuccess';
import { SetUploadId, SetValidationResult, SetSubmitted } from '../types';

type UploadSuccessProps = {
  uploadCount: number;
  uploadId: string;
  setUploadId: SetUploadId;
  setValidationResult: SetValidationResult;
  isSecondForm?: boolean;
  setSubmitted: SetSubmitted;
};

export function SubmissionProcess({
  uploadCount,
  uploadId,
  setUploadId,
  setValidationResult,
  isSecondForm = false,
  setSubmitted,
}: UploadSuccessProps) {
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [showDeclaration, setShowDeclaration] = useState(false);

  if (showCancelPrompt) {
    return (
      <CancelSubmissionPrompt
        setShowCancel={setShowCancelPrompt}
        setShowDeclaration={setShowDeclaration}
        setUploadId={setUploadId}
        setValidationResult={setValidationResult}
      />
    );
  }

  if (showDeclaration) {
    return (
      <SubmissionDeclaration
        uploadId={uploadId}
        setShowDeclaration={setShowDeclaration}
        setSubmitted={setSubmitted}
        uploadCount={uploadCount}
      />
    );
  }

  return (
    <ValidationSuccess
      setShowCancelPrompt={setShowCancelPrompt}
      isSecondForm={isSecondForm}
      uploadCount={uploadCount}
      setShowDeclaration={setShowDeclaration}
    />
  );
}
