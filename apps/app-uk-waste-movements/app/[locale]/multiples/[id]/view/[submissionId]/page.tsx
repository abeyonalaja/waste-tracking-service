import { getServerSession, Session } from 'next-auth';
import { options } from '../../../../../api/auth/[...nextauth]/options';
import { getSubmission } from '@wts/app-uk-waste-movements/feature-multiples';
import { UkwmDraftSubmission } from '@wts/api/waste-tracking-gateway';
import { headers } from 'next/headers';
import { Submission } from '@wts/app-uk-waste-movements/feature-multiples/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { BackLink } from '@wts/ui/shared-ui';
import { Metadata } from 'next';

interface PageProps {
  params: {
    locale: string;
    id: string;
    submissionId: string;
  };
}

export const metadata: Metadata = {
  title: 'Waste movement record',
};

export default async function SingleRecord({
  params,
}: PageProps): Promise<JSX.Element> {
  const session: Session | null = await getServerSession(options);
  const token = session?.token;
  const headerList = headers();
  const hostname = headerList.get('host') || '';
  const response = await getSubmission(
    hostname,
    params.id,
    process.env['NODE_ENV'] === 'production' ? params.submissionId : '123',
    token!,
  );
  const submission: UkwmDraftSubmission = await response.json();
  return (
    <Page beforeChildren={<BackLink href={'../view?page=1'} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <Submission data={submission} />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
