export async function getSubmission(
  hostname: string,
  multiplesId: string,
  submissionId: string,
  token: string
): Promise<Response> {
  let protocol = 'https';

  if (hostname.indexOf('localhost') === 0) {
    hostname = 'localhost:3000';
    protocol = 'http';
  }

  const apiUrl = `${protocol}://${hostname}/api`;
  return await fetch(`${apiUrl}/ukwm/drafts/${submissionId}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
