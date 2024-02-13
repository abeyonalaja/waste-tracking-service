import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  AppLink,
  ErrorSummary,
  Paragraph,
  NotificationBanner,
  SaveReturnButton,
} from 'components';
import { UploadForm } from './UploadForm';
import styled from 'styled-components';
import { RED } from 'govuk-colours';
import {
  ValidationErrorsType,
  SetUploadId,
  SetIsSecondForm,
  SetValidationErrors,
  SetValidationResult,
} from '../types';

const BackLinkWrap = styled.div`
  margin-top: -30px;
  margin-bottom: 30px;
`;

const ErrorBanner = styled('div')`
  padding: 20px 20px 0;
  border: 5px solid ${RED};
  margin-bottom: 30px;
`;

type ValidationError = {
  rowNumber: number;
  errorAmount: number;
  errorDescriptions: string[];
};

type ValidationErrorsProps = {
  errors: ValidationError[] | null;
  setValidationResult: SetValidationResult;
  setUploadId: SetUploadId;
  setIsSecondForm: SetIsSecondForm;
  validationErrors: ValidationErrorsType;
  setValidationErrors: SetValidationErrors;
};

export function ValidationErrors({
  errors,
  setValidationResult,
  setUploadId,
  setIsSecondForm,
  validationErrors,
  setValidationErrors,
}: ValidationErrorsProps) {
  const { t } = useTranslation();
  const [showRow, setShowRow] = useState<number | null>(null);

  return (
    <>
      {!showRow && (
        <>
          <div id="upload-page-error-summary-view">
            <BackLinkWrap>
              <GovUK.BackLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setUploadId(null);
                  setValidationResult(null);
                }}
              >
                {t('Back')}
              </GovUK.BackLink>
            </BackLinkWrap>
            {validationErrors && !!Object.keys(validationErrors).length && (
              <ErrorSummary
                heading={t('errorSummary.title')}
                errors={Object.keys(validationErrors).map((key) => ({
                  targetName: key,
                  text: validationErrors[key],
                }))}
              />
            )}
            <NotificationBanner
              type="important"
              id="error-banner-important"
              headingText={t('multiples.errorSummaryPage.importantMessage', {
                count: errors.reduce(
                  (accumulator, currentError) =>
                    accumulator + currentError.errorDescriptions.length,
                  0
                ),
              })}
            />
            <GovUK.Heading size="L">
              {t('multiples.errorSummaryPage.heading')}
            </GovUK.Heading>
            <GovUK.Paragraph>
              {t('multiples.errorSummaryPage.leadParagraph')}
            </GovUK.Paragraph>
            <Paragraph>
              {t('multiples.errorSummaryPage.linkParagraphStart')}
              <AppLink
                href={'/export/multiples/guidance/how-to-create-annex7-csv'}
                target="_blank"
              >
                {t('multiples.errorSummaryPage.linkGuidanceText')}
              </AppLink>{' '}
              {t('multiples.errorSummaryPage.linkParagraphEnd')}
            </Paragraph>
            <GovUK.H3>
              {t('multiples.errorSummaryPage.errorSummary.title')}
            </GovUK.H3>
            <GovUK.Paragraph>
              {t('multiples.errorSummaryPage.errorSummary.startParagraph')}
            </GovUK.Paragraph>
            <GovUK.Table
              caption={null}
              head={
                <GovUK.Table.Row>
                  <GovUK.Table.CellHeader setWidth="one-quarter" scope="col">
                    {t(
                      'multiples.errorSummaryPage.errorSummaryTableHeader.row'
                    )}
                  </GovUK.Table.CellHeader>
                  <GovUK.Table.CellHeader setWidth="one-half" scope="col">
                    {t(
                      'multiples.errorSummaryPage.errorSummaryTableHeader.error'
                    )}
                  </GovUK.Table.CellHeader>
                  <GovUK.Table.CellHeader setWidth="one-quarter" scope="col">
                    {t(
                      'multiples.errorSummaryPage.errorSummaryTableHeader.action'
                    )}
                  </GovUK.Table.CellHeader>
                </GovUK.Table.Row>
              }
            >
              {errors.map((row, index) => (
                <GovUK.Table.Row key={`error-summary-row-${index}`}>
                  <GovUK.Table.Cell>
                    <strong>{row.rowNumber}</strong>
                  </GovUK.Table.Cell>
                  <GovUK.Table.Cell>
                    {row.errorAmount}{' '}
                    {t(
                      'multiples.errorSummaryPage.errorSummaryTableHeader.errorCount',
                      { count: row.errorAmount }
                    )}
                  </GovUK.Table.Cell>
                  <GovUK.Table.Cell>
                    <AppLink
                      href="#"
                      id={`action-view-error-`}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowRow(index + 1);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {t(
                        'multiples.errorSummaryPage.errorSummaryTable.actionLink'
                      )}
                    </AppLink>
                  </GovUK.Table.Cell>
                </GovUK.Table.Row>
              ))}
            </GovUK.Table>
            <GovUK.Paragraph>
              {t('multiples.errorSummaryPage.errorSummary.endParagraph')}
            </GovUK.Paragraph>
            <UploadForm
              setUploadId={setUploadId}
              setFilename={setValidationResult}
              isSecondForm={false}
              setIsSecondForm={setIsSecondForm}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
            />
          </div>
        </>
      )}
      {showRow && (
        <div id="upload-page-error-row-view">
          <BackLinkWrap>
            <GovUK.BackLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowRow(null);
              }}
            >
              {t('Back')}
            </GovUK.BackLink>
          </BackLinkWrap>
          <ErrorBanner>
            <GovUK.H2 size="MEDIUM">
              {t('multiples.errorSummaryPage.errorList.title', {
                count: errors[showRow - 1].errorAmount,
              })}
            </GovUK.H2>
            <Paragraph>
              {t('multiples.errorSummaryPage.errorList.heading')}{' '}
              <AppLink href={'/export/multiples/guidance'} target="_blank">
                {t('multiples.errorSummaryPage.linkGuidanceText')}
              </AppLink>{' '}
            </Paragraph>
          </ErrorBanner>
          <GovUK.Heading size="L">
            {t('multiples.errorSummaryPage.errorList.rowCorrection', {
              rowNumber: errors[showRow - 1].rowNumber,
            })}
          </GovUK.Heading>

          <GovUK.Paragraph>
            {t('multiples.errorSummaryPage.errorList.rowCorrection.para')}
          </GovUK.Paragraph>

          <GovUK.Table
            caption={null}
            head={
              <GovUK.Table.Row>
                <GovUK.Table.CellHeader scope="col">
                  {t('multiples.errorSummaryPage.errorListTable.heading')}
                </GovUK.Table.CellHeader>
              </GovUK.Table.Row>
            }
          >
            {errors[showRow - 1].errorDescriptions.map((error, index) => (
              <GovUK.Table.Row key={`error-row-${index}`}>
                <GovUK.Table.Cell id={`error-${index}`}>
                  {error}
                </GovUK.Table.Cell>
              </GovUK.Table.Row>
            ))}
          </GovUK.Table>

          <SaveReturnButton
            href="#"
            id="back-to-summary-table-button"
            onClick={(e) => {
              e.preventDefault();
              setShowRow(null);
              window.scrollTo(0, 0);
            }}
          >
            {t('multiples.errorSummaryPage.errorListTable.button')}
          </SaveReturnButton>
        </div>
      )}
    </>
  );
}
