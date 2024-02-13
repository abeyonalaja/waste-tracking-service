import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from 'utils/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import * as GovUK from 'govuk-react';
import styled from 'styled-components';
import { Loading } from 'components';
import { ValidationErrors } from './ValidationErrors';
import { SubmissionProcess } from './SubmissionProcess';
import {
  ValidationErrorsType,
  SetUploadId,
  SetIsSecondForm,
  SetValidationErrors,
  SetSubmitted,
} from '../types';

const BackLinkWrap = styled.div`
  margin-top: -30px;
  margin-bottom: 30px;
`;

const LoadingWrap = styled.div`
  padding: 30px;
  text-align: center;
`;

const LoaderWrap = styled.div`
  margin: 20px auto;
  width: 120px;
`;

type UploadProcessProps = {
  uploadId: string;
  setUploadId: SetUploadId;
  filename: string;
  isSecondForm: boolean;
  setIsSecondForm: SetIsSecondForm;
  validationErrors: ValidationErrorsType;
  setValidationErrors: SetValidationErrors;
  setSubmitted: SetSubmitted;
};

export function ValidationProcess({
  uploadId,
  setUploadId,
  filename,
  isSecondForm,
  setIsSecondForm,
  validationErrors,
  setValidationErrors,
  setSubmitted,
}: UploadProcessProps) {
  const { t } = useTranslation();
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const getUploadStatus = () => {
    return apiClient({
      url: `/batches/${uploadId}`,
    });
  };

  const reFetchUntil = (q) => {
    const uploadStatus = q.state.data?.data.state.status || null;
    if (uploadStatus === 'Submitted' || uploadStatus === 'FailedValidation') {
      setValidationResult(uploadStatus);
      return false;
    }
    return 4000;
  };

  const { data } = useQuery({
    queryKey: ['csvUploadStatus', uploadId],
    queryFn: getUploadStatus,
    enabled: !!uploadId,
    refetchInterval: (q) => reFetchUntil(q),
  });

  // Shows loading state to user whilst the file is being processed on backend
  if (!validationResult) {
    return (
      <>
        <BackLinkWrap>
          <GovUK.BackLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setUploadId(null);
            }}
          >
            {t('Back')}
          </GovUK.BackLink>
        </BackLinkWrap>
        <LoadingWrap>
          <GovUK.Heading size={'L'}>Loading {filename}</GovUK.Heading>
          <LoaderWrap>
            <Loading size={'L'} />
          </LoaderWrap>
        </LoadingWrap>
      </>
    );
  }

  // Displays validation errors to user if file has failed backend validation
  if (validationResult === 'FailedValidation') {
    return (
      <GovUK.GridRow>
        <GovUK.GridCol setWidth="two-thirds">
          <ValidationErrors
            errors={data.data.state.errors}
            setValidationResult={setValidationResult}
            setUploadId={setUploadId}
            setIsSecondForm={setIsSecondForm}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        </GovUK.GridCol>
      </GovUK.GridRow>
    );
  }

  // Shows submission process to user if file has passed backend validation
  return (
    <GovUK.GridRow>
      <GovUK.GridCol setWidth="two-thirds">
        <SubmissionProcess
          uploadCount={data.data.state.submissions.length}
          uploadId={uploadId}
          setUploadId={setUploadId}
          setValidationResult={setValidationResult}
          isSecondForm={isSecondForm}
          setSubmitted={setSubmitted}
        />
      </GovUK.GridCol>
    </GovUK.GridRow>
  );
}
