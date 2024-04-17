import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { getTranslations } from 'next-intl/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Instructions } from '@wts/app-uk-waste-movements/feature-multiples/server';
import { Page } from '@wts/ui/shared-ui/server';
import { UploadForm } from '@wts/app-uk-waste-movements/feature-multiples';

export const metadata: Metadata = {
  title: 'Creating multiple waste movements',
  description: 'Creating multiple waste movements',
};

export default async function UploadPage() {
  const page = await getTranslations('multiples.uploadPage');
  const form = await getTranslations('multiples.uploadForm');
  const session = await getServerSession(options);
  const token = session?.token;

  const strings = {
    heading: form('heading'),
    hint: form('hint'),
    button: form('button'),
    errorLabel: form('errorLabel'),
    summaryLabel: form('summaryLabel'),
  };

  return (
    <Page beforeChildren={<GovUK.BackLink href="/" />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <UploadForm token={token!} strings={strings}>
            <GovUK.Heading size={'l'} level={1}>
              {page('title')}
            </GovUK.Heading>
            <Instructions />
          </UploadForm>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
