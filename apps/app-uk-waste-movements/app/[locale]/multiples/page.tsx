import { useTranslations } from 'next-intl';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Instructions } from '@wts/app-uk-waste-movements/feature-multiples/server';
import { Page } from '@wts/ui/shared-ui/server';
import { UploadForm } from '@wts/app-uk-waste-movements/feature-multiples';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creating multiple waste movements',
  description: 'Creating multiple waste movements',
};

export default function UploadPage() {
  const page = useTranslations('multiples.uploadPage');
  const form = useTranslations('multiples.uploadForm');

  const strings = {
    heading: form('heading'),
    hint: form('hint'),
    button: form('button'),
  };

  return (
    <Page beforeChildren={<GovUK.BackLink href="/" />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Heading size={'l'} level={1}>
            {page('title')}
          </GovUK.Heading>
          <UploadForm strings={strings}>
            <Instructions />
          </UploadForm>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
