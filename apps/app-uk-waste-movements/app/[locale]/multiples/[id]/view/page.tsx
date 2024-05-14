import { getTranslations } from 'next-intl/server';
import {
  SubmittedTable,
  getSubmissionStatus,
} from '@wts/app-uk-waste-movements/feature-multiples';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import { UkwmBulkSubmission } from '@wts/api/waste-tracking-gateway';
import { redirect } from '@wts/ui/navigation';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { headers } from 'next/headers';

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
  searchParams: {
    page: number;
    order: string;
  };
}

export default async function ManagePage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement | undefined> {
  const t = await getTranslations('multiples.manage');
  const session = await getServerSession(options);
  const token = session?.token;
  const headerList = headers();
  const hostname = headerList.get('host') || '';
  const response = await getSubmissionStatus(hostname, params.id, token!);
  const submission: UkwmBulkSubmission = await response.json();
  const { state } = submission;

  const tableStrings = {
    headerOne: t('table.headerOne'),
    headerTwo: t('table.headerTwo'),
    headerThree: t('table.headerThree'),
    headerFour: t('table.headerFour'),
    headerFive: t('table.headerFive'),
    action: t('table.action'),
  };

  if (state.status !== 'Submitted' || !('submissions' in state)) {
    redirect('/multiples/[id]');
    return;
  }

  const totalPages = Math.ceil(state.submissions.length / 15);
  const pageNumber = Number(searchParams.page);

  if (pageNumber > totalPages || pageNumber < 1 || Number.isNaN(pageNumber)) {
    redirect(`/multiples/${params.id}/view?page=1`);
  }

  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Heading>
            {session?.companyName
              ? t('headingOne', { company: session.companyName })
              : 'Waste movement records'}
          </GovUK.Heading>
        </GovUK.GridCol>
      </GovUK.GridRow>
      <SubmittedTable
        submissions={state.submissions}
        tableStrings={tableStrings}
      />
    </>
  );
}
