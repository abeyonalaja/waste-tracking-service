export async function getSubmissions(
  hostname: string,
  submissionId: string,
  token: string | null | undefined,
  searchParams: {
    page: number;
    day: number;
    month: number;
    year: number;
    ewcCode: string;
    producerName: string;
    wasteMovementId: string;
    collectionDate: string;
  },
): Promise<Response> {
  let protocol = 'https';

  if (hostname.indexOf('localhost') === 0) {
    hostname = 'localhost:3000';
    protocol = 'http';
  }

  const apiUrl = `${protocol}://${hostname}/api`;

  return await fetch(
    `${apiUrl}/ukwm-batches/${submissionId}/submissions?page=${searchParams.page || 1}&collectionDate=${searchParams.collectionDate}&ewcCode=${searchParams.ewcCode || ''}&producerName=${searchParams.producerName || ''}&wasteMovementId=${searchParams.wasteMovementId || ''}`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
