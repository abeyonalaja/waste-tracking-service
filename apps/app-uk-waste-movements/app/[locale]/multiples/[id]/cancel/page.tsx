import { Metadata } from 'next';
import { BackLink, Page } from '@wts/ui/shared-ui/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { ValidationCancel } from '@wts/app-uk-waste-movements/feature-multiples/server';
import { getServerSession, Session } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'Creating multiple waste movements',
  description: 'Creating multiple waste movements',
};

export default async function CancelPage({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const session: Session | null = await getServerSession(options);
  const token = session?.token;

  return (
    <Page beforeChildren={<BackLink href="./" />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <ValidationCancel submissionId={params.id} token={token} />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
