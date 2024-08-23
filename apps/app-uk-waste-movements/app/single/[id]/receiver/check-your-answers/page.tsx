import { Metadata } from 'next';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { BackLink, Page } from '@wts/ui/shared-ui/server';

export const metadata: Metadata = {
  title: 'Check your receiver details answers',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ReceiverCheckYourAnswersPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  return (
    <Page beforeChildren={<BackLink text="Back" href="#" routerBack={true} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Caption>Receiver caption here</GovUK.Caption>
          <GovUK.Heading size={'l'} level={1}>
            Receiver check your answers page
          </GovUK.Heading>
          <GovUK.Paragraph>For id: {params.id}</GovUK.Paragraph>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
