export async function getUserPaymentStatus(
  hostname: string,
  token: string,
): Promise<Response> {
  let protocol = 'https';

  if (hostname.indexOf('localhost') === 0) {
    hostname = 'localhost:3000';
    protocol = 'http';
  }

  const apiUrl = `${protocol}://${hostname}/api`;

  const response = await fetch(`${apiUrl}/payments`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
