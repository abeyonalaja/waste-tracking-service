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

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
  searchParams: {
    filename: string;
    hasCorrectedErrors?: string;
  };
}

export default async function CancelPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const session: Session | null = await getServerSession(options);
  const token = session?.token;

  return (
    <Page beforeChildren={<BackLink href="./" />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <ValidationCancel
            submissionId={params.id}
            filename={searchParams.filename}
            token={token}
          />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
