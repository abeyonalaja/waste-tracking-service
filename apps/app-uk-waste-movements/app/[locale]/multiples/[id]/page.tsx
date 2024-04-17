import { Metadata } from 'next';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { getServerSession } from 'next-auth';
import { options } from '../../../api/auth/[...nextauth]/options';
import { getTranslations } from 'next-intl/server';
import { redirect } from '@wts/ui/navigation';
import { Page, BackLink } from '@wts/ui/shared-ui/server';
import { Instructions } from '@wts/app-uk-waste-movements/feature-multiples/server';
import {
  UploadForm,
  StatusChecker,
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
  const page = await getTranslations('multiples');
  const session = await getServerSession(options);
  const token = session?.token;
  const uploadFormStrings = {
    heading: page('uploadForm.heading'),
    hint: page('uploadForm.hint'),
    button: page('uploadForm.button'),
    errorLabel: page('uploadForm.errorLabel'),
    summaryLabel: page('uploadForm.summaryLabel'),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm-batches/${params.id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 401) {
    redirect('/404');
  }

  const upload = await response.json();

  if (upload.state.status === 'Processing') {
    return (
      <Page>
        <GovUK.GridRow>
          <GovUK.GridCol size="full">
            <StatusChecker
              label={page('processingPage.label')}
              filename={searchParams.filename}
            />
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  if (upload.state.status === 'FailedCsvValidation') {
    return (
      <Page beforeChildren={<BackLink href="/" />}>
        <GovUK.GridRow>
          <GovUK.GridCol size="two-thirds">
            <UploadForm
              token={token!}
              strings={uploadFormStrings}
              validationError={upload.state.error}
            >
              <GovUK.Heading size={'l'} level={1}>
                {page('uploadPage.title')}
              </GovUK.Heading>
              <Instructions />
            </UploadForm>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  if (upload.state.status === 'FailedValidation') {
    return (
      <Page beforeChildren={<BackLink href="/" />}>
        <p>Failed Validation of CSV fields page to go here</p>
      </Page>
    );
  }

  if (upload.state.status === 'PassedValidation') {
    return (
      <Page beforeChildren={<BackLink href="/" />}>
        <p>Passed Validation of CSV fields page to go here</p>
      </Page>
    );
  }

  if (upload.state.status === 'Submitted') {
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
