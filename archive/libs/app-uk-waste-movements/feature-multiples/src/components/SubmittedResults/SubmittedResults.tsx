import { SubmittedTable } from '../SubmittedTable';
import { Pagination } from '@wts/ui/shared-ui';
import { UkwmPagedSubmissionData } from '@wts/api/waste-tracking-gateway';
import { getSubmissions } from '../../utils';

interface SubmittedResultsProps {
  token: string;
  hostname: string;
  id: string;
  searchParams: {
    page: number;
    day: number;
    month: number;
    year: number;
    ewcCode: string;
    producerName: string;
    wasteMovementId: string;
    collectionDate: string;
  };
}

export async function SubmittedResults({
  token,
  hostname,
  id,
  searchParams,
}: SubmittedResultsProps): Promise<React.ReactElement> {
  const response = await getSubmissions(hostname, id, token, searchParams);
  const submissions: UkwmPagedSubmissionData = await response.json();

  return (
    <>
      <SubmittedTable submissions={submissions.values} />
      <Pagination
        currentPage={submissions.page}
        totalPages={submissions.totalPages}
      />
    </>
  );
}
