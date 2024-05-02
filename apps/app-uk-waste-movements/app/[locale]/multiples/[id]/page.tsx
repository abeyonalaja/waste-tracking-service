import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../../../api/auth/[...nextauth]/options';
import { getTranslations } from 'next-intl/server';
import { redirect } from '@wts/ui/navigation';
import { UkwmBulkSubmission } from '@wts/api/waste-tracking-gateway';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page, BackLink } from '@wts/ui/shared-ui/server';
import {
  Instructions,
  ErrorInstructions,
} from '@wts/app-uk-waste-movements/feature-multiples/server';
import {
  UploadForm,
  StatusChecker,
  getSubmissionStatus,
  calculateTotalErrors,
} from '@wts/app-uk-waste-movements/feature-multiples';

export const metadata: Metadata = {
  title: 'Creating multiple waste movements',
  description: 'Creating multiple waste movements',
};

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
  searchParams: {
    filename: string;
  };
}

export default async function StatusPage({ params, searchParams }: PageProps) {
  const t = await getTranslations('multiples');
  const session = await getServerSession(options);
  const token = session?.token;

  const uploadFormStrings = {
    heading: t('uploadForm.heading'),
    hint: t('uploadForm.hint'),
    button: t('uploadForm.button'),
    errorLabel: t('uploadForm.errorLabel'),
    summaryLabel: t('uploadForm.summaryLabel'),
  };

  const failedValidationdFormStrings = {
    heading: t('errors.uploadForm.heading'),
    hint: t('uploadForm.hint'),
    button: t('uploadForm.button'),
    errorLabel: t('uploadForm.errorLabel'),
    summaryLabel: t('uploadForm.summaryLabel'),
  };

  const response = await getSubmissionStatus(params.id, token!);

  if (response.status === 401) {
    redirect('/404');
  }

  const submission: UkwmBulkSubmission = await response.json();
  const { state } = submission;

  if (state.status === 'Processing') {
    return (
      <Page>
        <GovUK.GridRow>
          <GovUK.GridCol size="full">
            <StatusChecker
              label={t('processingPage.label')}
              filename={searchParams.filename}
            />
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  if (state.status === 'FailedCsvValidation') {
    return (
      <Page beforeChildren={<BackLink href="/" />}>
        <GovUK.GridRow>
          <GovUK.GridCol size="two-thirds">
            <UploadForm
              token={token!}
              strings={uploadFormStrings}
              validationError={state.error}
            >
              <GovUK.Heading size={'l'} level={1}>
                {t('uploadPage.title')}
              </GovUK.Heading>
              <Instructions />
            </UploadForm>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  if (state.status === 'FailedValidation') {
    const totalErrorCount = calculateTotalErrors(
      state.rowErrors,
      state.columnErrors
    );

    const totalErrorSummaryStrings = {
      heading: t('errors.totalErrorsSummary.heading', { totalErrorCount }),
      prompt: t('errors.totalErrorsSummary.prompt'),
      linkText: t('errors.totalErrorsSummary.linkText'),
    };

    return (
      <Page beforeChildren={<BackLink href="/multiples" />}>
        <GovUK.GridRow>
          <GovUK.GridCol size="two-thirds">
            <UploadForm
              token={token!}
              strings={failedValidationdFormStrings}
              totalErrorSummaryStrings={totalErrorSummaryStrings}
              showHint={false}
              totalErrorCount={totalErrorCount}
            >
              <GovUK.Heading size={'l'} level={1}>
                {t('errors.page.headingOne')}
              </GovUK.Heading>
              <ErrorInstructions />
              <GovUK.Heading size={'m'} level={2}>
                {t('errors.page.headingTwo')}
              </GovUK.Heading>
              <GovUK.Paragraph>{t('errors.page.paragraphOne')}</GovUK.Paragraph>
              <GovUK.Paragraph>{t('errors.page.paragraphTwo')}</GovUK.Paragraph>
            </UploadForm>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  if (state.status === 'PassedValidation') {
    return (
      <Page beforeChildren={<BackLink href="/" />}>
        <p>Passed Validation of CSV fields page to go here</p>
      </Page>
    );
  }

  if (state.status === 'Submitted') {
    return (
      <Page beforeChildren={<BackLink href="/" />}>
        <p>Submitted multiples page to go here</p>
      </Page>
    );
  }

  return (
    <Page beforeChildren={<BackLink href="/" />}>
      <p>Catch all route</p>
    </Page>
  );
}
