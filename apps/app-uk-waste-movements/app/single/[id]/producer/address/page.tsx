import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Producer details',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProducerAddressPage({
  params,
}: PageProps): React.ReactNode {
  return (
    <Page beforeChildren={<b>Back</b>}>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>{params.id}</GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
