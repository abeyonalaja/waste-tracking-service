import { getServerSession } from 'next-auth';
import { options } from './../../../../api/auth/[...nextauth]/options';
import { getSubmission } from '@wts/app-uk-waste-movements/feature-multiples';
import { UkwmDraftSubmission } from '@wts/api/waste-tracking-gateway';
import { headers } from 'next/headers';
import { Submission } from '@wts/app-uk-waste-movements/feature-multiples/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { BackLink } from '@wts/ui/shared-ui';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

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
  const headerList = headers();
  const hostname = headerList.get('host') || '';
  const session = await getServerSession(options);
  const token = session?.token;

  if (typeof token !== 'string') {
    console.error('No token present');
    return redirect('/404');
  }

  const response = await getSubmission(
    hostname,
    params.id,
    process.env['NODE_ENV'] === 'production' ? params.submissionId : '123',
    token,
  );

  const submission: UkwmDraftSubmission = await response.json();

  return (
    <Page beforeChildren={<BackLink href={'../view'} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <Submission data={submission} />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
