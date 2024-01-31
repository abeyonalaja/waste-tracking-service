import React, { FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from 'utils/api/apiClient';
import {
  AppLink,
  Footer,
  Header,
  Loading,
  NotificationBanner,
  Paragraph,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
} from 'components';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import Head from 'next/head';
import { isNotEmpty } from 'utils/validators';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import UploadUI_Content from './_content/upload-content';
import UploadUI_Interuption from './_content/guidance-interuption';
import { RED } from 'govuk-colours';

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

const ErrorBanner = styled('div')`
  padding: 20px 20px 0;
  border: 5px solid ${RED};
  margin-bottom: 30px;
`;

const BreadCrumbs = ({ id }) => {
  const { t } = useTranslation();
  if (id) {
    return;
  } else {
    return (
      <>
        <BreadcrumbWrap>
          <GovUK.Breadcrumbs>
            <GovUK.Breadcrumbs.Link href="/">
              {t('app.parentTitle')}
            </GovUK.Breadcrumbs.Link>
            <GovUK.Breadcrumbs.Link href="/export">
              {t('app.title')}
            </GovUK.Breadcrumbs.Link>
            {t('multiples.guidance.heading')}
          </GovUK.Breadcrumbs>
        </BreadcrumbWrap>
      </>
    );
  }
};

const Upload = () => {
  const { t } = useTranslation();
  const [id, setId] = useState<string>(null);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>(null);
  const [isSecondForm, setIsSecondForm] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies(['GLWMultipleGuidanceViewed']);
  const [validationErrors, setValidationErrors] = useState<{
    file?: string;
  }>({});

  useEffect(() => {
    if (!cookies.GLWMultipleGuidanceViewed) {
      setShowCard(true);
      setCookie('GLWMultipleGuidanceViewed', 'true', {
        maxAge: 2592000,
      });
    }
  }, [cookies]);

  return (
    <>
      <Head>
        <title>{t('multiples.guidance.heading')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs id={id} />}
      >
        {!id && (
          <>
            {showCard && <UploadUI_Interuption />}
            {!showCard && (
              <GovUK.GridRow>
                <GovUK.GridCol setWidth="two-thirds">
                  <>
                    {validationErrors &&
                      !!Object.keys(validationErrors).length && (
                        <GovUK.ErrorSummary
                          heading={t('errorSummary.title')}
                          errors={Object.keys(validationErrors).map((key) => ({
                            targetName: key,
                            text: validationErrors[key],
                          }))}
                        />
                      )}
                    <UploadUI_Content />
                    <UploadUI_Form
                      assignId={setId}
                      updateFilename={setFilename}
                      isSecondForm={false}
                      setIsSecondForm={setIsSecondForm}
                      validationErrors={validationErrors}
                      setValidationErrors={setValidationErrors}
                    />
                  </>
                </GovUK.GridCol>
              </GovUK.GridRow>
            )}
          </>
        )}
        {id && (
          <UploadUI_Process
            id={id}
            assignId={setId}
            filename={filename}
            isSecondForm={isSecondForm}
            setIsSecondForm={setIsSecondForm}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        )}
      </GovUK.Page>
    </>
  );
};

export default Upload;
Upload.auth = true;

const UploadUI_Form = ({
  assignId,
  updateFilename,
  isSecondForm,
  setIsSecondForm,
  validationErrors,
  setValidationErrors,
}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);

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
      assignId(null);
      setValidationErrors(null);
      const formData = new FormData();
      formData.append('input', file);
      const response = await mutation.mutateAsync(formData);

      if (response?.status === 201) {
        updateFilename(file.name);
        assignId(response.data.id);
        setIsSecondForm(isSecondForm);
      } else {
        setValidationErrors({ file: response.data.message });
        setFile(null);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitUpload}>
        <GovUK.FormGroup>
          <GovUK.FileUpload
            acceptedFormats=".csv"
            name="csvUpload"
            onChange={handleFileChange}
            meta={{
              error: validationErrors?.file,
              touched: !!validationErrors?.file,
            }}
          >
            <GovUK.H2 size="MEDIUM">
              {isSecondForm
                ? t('multiples.errorSummaryPage.uploadForm.titleSecond')
                : t('multiples.errorSummaryPage.uploadForm.title')}
            </GovUK.H2>
          </GovUK.FileUpload>
        </GovUK.FormGroup>
        <GovUK.Button
          disabled={mutation.status === 'pending'}
          id="upload-button"
        >
          {t('multiples.guidance.upload.button')}
        </GovUK.Button>
      </form>
    </>
  );
};

const UploadUI_Process = ({
  id,
  assignId,
  filename,
  isSecondForm,
  setIsSecondForm,
  validationErrors,
  setValidationErrors,
}) => {
  const { t } = useTranslation();
  const [result, setResult] = useState<string>(null);

  const getUploadStatus = () => {
    return apiClient({
      url: `/batches/${id}`,
    });
  };

  const reFetchUntil = (q) => {
    const uploadStatus = q.state.data?.data.state.status || null;
    if (uploadStatus === 'Submitted' || uploadStatus === 'FailedValidation') {
      setResult(uploadStatus);
      return false;
    }
    return 4000;
  };

  const { data } = useQuery({
    queryKey: ['csvUploadStatus', id],
    queryFn: getUploadStatus,
    enabled: !!id,
    refetchInterval: (q) => reFetchUntil(q),
  });

  return (
    <>
      {!result && (
        <>
          <BackLinkWrap>
            <GovUK.BackLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                assignId(null);
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
      )}
      {result === 'FailedValidation' && (
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            <UploadUI_ErrorSummary
              data={data}
              updateResult={setResult}
              updateId={assignId}
              setIsSecondForm={setIsSecondForm}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
            />
          </GovUK.GridCol>
        </GovUK.GridRow>
      )}
      {result === 'Submitted' && (
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            <UploadUI_Success
              data={data}
              updateResult={setResult}
              updateId={assignId}
              isSecondForm={isSecondForm}
            />
          </GovUK.GridCol>
        </GovUK.GridRow>
      )}
    </>
  );
};

const UploadUI_Success = ({
  data,
  updateResult,
  updateId,
  isSecondForm = false,
}) => {
  const { t } = useTranslation();
  return (
    <div id="upload-page-success">
      <BackLinkWrap>
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            updateId(null);
            updateResult(null);
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BackLinkWrap>
      <NotificationBanner
        type="success"
        id="success-banner-csv-upload"
        headingText={t(
          isSecondForm
            ? 'multiples.success.heading.afterCorrection'
            : 'multiples.success.heading',
          {
            count: data?.data.state?.submissions.length || 0,
          }
        )}
      />
      <Paragraph>{t('multiples.success.intro')}</Paragraph>
      <ButtonGroup>
        <GovUK.Button>{t('multiples.success.submitButton')}</GovUK.Button>
        <SaveReturnButton
          onClick={(e) => {
            e.preventDefault();
            updateId(null);
            updateResult(null);
          }}
        >
          {t('cancelButton')}
        </SaveReturnButton>
      </ButtonGroup>
    </div>
  );
};

const UploadUI_ErrorSummary = ({
  data,
  updateResult,
  updateId,
  setIsSecondForm,
  validationErrors,
  setValidationErrors,
}) => {
  const { t } = useTranslation();
  const [showRow, setShowRow] = useState<number | null>(null);
  const errors = data.data.state.errors || [];

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
                  updateId(null);
                  updateResult(null);
                }}
              >
                {t('Back')}
              </GovUK.BackLink>
            </BackLinkWrap>
            {validationErrors && !!Object.keys(validationErrors).length && (
              <GovUK.ErrorSummary
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
                n: errors.length,
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
            <UploadUI_Form
              assignId={updateId}
              updateFilename={updateResult}
              isSecondForm={true}
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
};
