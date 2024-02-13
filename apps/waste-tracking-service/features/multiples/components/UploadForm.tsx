import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import apiClient from 'utils/api/apiClient';
import { isNotEmpty } from 'utils/validators';
import { Button, FileUpload, FormGroup, H2 } from 'govuk-react';

import {
  SetUploadId,
  SetIsSecondForm,
  SetValidationErrors,
  SetFileName,
  ValidationErrorsType,
} from '../types';

type UploadFormProps = {
  setUploadId: SetUploadId;
  setFilename: SetFileName;
  isSecondForm: boolean;
  setIsSecondForm: SetIsSecondForm;
  validationErrors: ValidationErrorsType;
  setValidationErrors: SetValidationErrors;
};

export function UploadForm({
  setUploadId,
  setFilename,
  isSecondForm,
  setIsSecondForm,
  validationErrors,
  setValidationErrors,
}: UploadFormProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File>(null);

  const putFile = (formData) => {
    return apiClient({
      url: '/batches',
      method: 'post',
      data: formData,
    });
  };

  const mutation = useMutation({
    mutationFn: putFile,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const validateFile = (file) => {
    if (file === null || file === undefined) {
      return 'Select a file to upload';
    }
    if (file.type !== 'text/csv') {
      return 'Only upload a CSV file';
    }
  };

  const errorMessageContent = (error) => {
    if (error === 'CSV_RECORD_INCONSISTENT_COLUMNS')
      return 'The format of the CSV file is not correct';
    if (error.search('Payload') > -1)
      return 'The CSV file should be less than 10M in size';
    return error;
  };

  const handleSubmitUpload = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = {
      file: validateFile(file),
    };
    if (isNotEmpty(newErrors)) {
      setValidationErrors(newErrors);
      setFile(null);
      window.scrollTo(0, 0);
    } else {
      setUploadId(null);
      setValidationErrors(null);
      const formData = new FormData();
      formData.append('input', file);
      const response = await mutation.mutateAsync(formData);

      if (response?.status === 201) {
        setFilename(file.name);
        setUploadId(response.data.id);
        setIsSecondForm(isSecondForm);
      } else {
        setFile(null);
        setValidationErrors({
          file: errorMessageContent(response.data.message),
        });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitUpload}>
        <FormGroup>
          <FileUpload
            acceptedFormats=".csv"
            name="csvUpload"
            onChange={handleFileChange}
            meta={{
              error: validationErrors?.file,
              touched: !!validationErrors?.file,
            }}
          >
            <H2 size="MEDIUM">
              {isSecondForm
                ? t('multiples.errorSummaryPage.uploadForm.titleSecond')
                : t('multiples.errorSummaryPage.uploadForm.title')}
            </H2>
          </FileUpload>
        </FormGroup>
        <Button disabled={mutation.status === 'pending'} id="upload-button">
          {t('multiples.guidance.upload.button')}
        </Button>
      </form>
    </>
  );
}
