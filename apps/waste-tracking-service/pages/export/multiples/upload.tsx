import React, { useEffect, useState } from 'react';
import { ErrorSummary } from 'components';
import { useTranslation } from 'react-i18next';
import { GridCol, GridRow } from 'govuk-react';
import { useCookies } from 'react-cookie';
import {
  GuidanceInteruption,
  Instructions,
  PageLayout,
  UploadForm,
  ValidationProcess,
  ValidationErrorsType,
} from 'features/multiples';

function Upload() {
  const { t } = useTranslation();
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(['GLWMultipleGuidanceViewed']);
  const [showGuidance, setShowGuidance] = useState<boolean>(false);
  const [filename, setFilename] = useState<string | null>(null);
  const [isSecondForm, setIsSecondForm] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrorsType>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (!cookies.GLWMultipleGuidanceViewed) {
      setShowGuidance(true);
    }
  }, [cookies, setCookie]);

  function acknowledgeGuidance(): void {
    setCookie('GLWMultipleGuidanceViewed', 'true', {
      maxAge: 2592000,
    });
    setShowGuidance(false);
  }

  if (!uploadId) {
    return (
      <PageLayout uploadId={uploadId}>
        {showGuidance && (
          <GuidanceInteruption acknowledgeGuidance={acknowledgeGuidance} />
        )}
        {!showGuidance && (
          <GridRow>
            <GridCol setWidth="two-thirds">
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
                <Instructions />
                <UploadForm
                  setUploadId={setUploadId}
                  setFilename={setFilename}
                  isSecondForm={false}
                  setIsSecondForm={setIsSecondForm}
                  validationErrors={validationErrors}
                  setValidationErrors={setValidationErrors}
                />
              </>
            </GridCol>
          </GridRow>
        )}
      </PageLayout>
    );
  }

  if (!submitted) {
    return (
      <PageLayout uploadId={uploadId}>
        <ValidationProcess
          uploadId={uploadId}
          setUploadId={setUploadId}
          filename={filename}
          isSecondForm={isSecondForm}
          setIsSecondForm={setIsSecondForm}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          setSubmitted={setSubmitted}
        />
      </PageLayout>
    );
  }

  return (
    // To implement in User Story 219003
    <PageLayout uploadId={uploadId}>
      <p>I have submitted a multiple upload with id of {uploadId}</p>
    </PageLayout>
  );
}

export default Upload;
Upload.auth = true;
