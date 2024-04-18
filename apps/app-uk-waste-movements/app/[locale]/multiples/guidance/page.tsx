import { Page } from '@wts/ui/shared-ui/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import {
  Content,
  Details,
  CSVSummary,
  UniqueReference,
  ProducerAndCollectionDetails,
  ReceiverDetails,
  EWC,
} from '@wts/app-uk-waste-movements/feature-multiples/server';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Waste movements in the UK: how to create multiple waste movements using a CSV file',
  description:
    'Use this guidance to help you complete a CSV template to upload multiple waste movements for the ‘Move waste in the UK’ service.',
};

export default function GuidancePage() {
  const page = useTranslations('multiples.guidancePage');

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Heading>{page('heading')}</GovUK.Heading>
          <GovUK.Hint>{page('hint')}</GovUK.Hint>
          <Content />
          <Details />
          <CSVSummary />
          <UniqueReference />
          <ProducerAndCollectionDetails />
          <ReceiverDetails />
          <EWC />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
