export async function getSubmissionStatus(
  submissionId: string,
  token: string
): Promise<Response> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm-batches/${submissionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}
