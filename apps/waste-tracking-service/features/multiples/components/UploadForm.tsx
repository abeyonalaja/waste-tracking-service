import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { isNotEmpty } from 'utils/validators';
import { Button, FileUpload, FormGroup, H2 } from 'govuk-react';
import { ErrorSummary } from 'components';
import { ValidationErrorsType } from '../types';
import axios, { AxiosError } from 'axios';
import useApiConfig from 'utils/useApiConfig';
import { UploadErrorResponse } from '../types';
import styled from 'styled-components';
import { BLACK, YELLOW } from 'govuk-colours';

const StyledInput = styled(FileUpload)`
  > input:focus {
    outline: 3px solid ${YELLOW};
    color: ${BLACK};
    box-shadow: inset 0 0 0 4px ${BLACK};
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

interface UploadFormProps {
  setShowNotificationBanner?: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}
export function UploadForm({
  setShowNotificationBanner,
  children,
}: UploadFormProps) {
  const router = useRouter();
  const apiConfig = useApiConfig();
  const { t } = useTranslation();
  const [file, setFile] = useState<File>(null);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrorsType>(
      router.query.columnsError
        ? { file: 'Csv record inconsistent columns' }
        : {}
    );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  function validateFile(file: File | null | undefined) {
    if (file === null || file === undefined || file.type !== 'text/csv') {
      window.scrollTo(0, 0);
      return 'Upload a CSV file';
    }
  }

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/batches`;
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: apiConfig.Authorization,
      };
      return axios.post(url, formData, { headers });
    },

    onSuccess: async (data) => {
      router.push(`/export/multiples/${data.data.id}?filename=${file.name}`);
    },
    onError: async (error: AxiosError<UploadErrorResponse>) => {
      if (setShowNotificationBanner) {
        setShowNotificationBanner(false);
      }
      setValidationErrors({ file: error.response.data.message });
      setFile(null);
    },
  });

  async function handleSubmitUpload(e: FormEvent) {
    e.preventDefault();
    const newErrors = {
      file: validateFile(file),
    };
    if (isNotEmpty(newErrors)) {
      if (setShowNotificationBanner) {
        setShowNotificationBanner(false);
      }
      setValidationErrors(newErrors);
      setFile(null);
      window.scrollTo(0, 0);
    } else {
      setValidationErrors(null);
      const formData = new FormData();
      formData.append('input', file);
      mutation.mutate(formData);
    }
  }

  return (
    <>
      {validationErrors && !!Object.keys(validationErrors).length && (
        <ErrorSummary
          heading={t('errorSummary.title')}
          errors={Object.keys(validationErrors).map((key) => ({
            targetName: key,
            text: validationErrors[key],
          }))}
        />
      )}
      {children}
      <form onSubmit={handleSubmitUpload}>
        <FormGroup>
          <StyledInput
            acceptedFormats=".csv"
            name="csvUpload"
            onChange={handleFileChange}
            meta={{
              error: validationErrors?.file,
              touched: !!validationErrors?.file,
            }}
          >
            <H2 size="MEDIUM">
              {router.query.errors
                ? t('multiples.errorSummaryPage.uploadForm.titleSecond')
                : t('multiples.errorSummaryPage.uploadForm.title')}
            </H2>
          </StyledInput>
        </FormGroup>
        <Button disabled={mutation.status === 'pending'} id="upload-button">
          {t('multiples.guidance.upload.button')}
        </Button>
      </form>
    </>
  );
}
