import { headers } from 'next/headers';

export function generateApiUrl(): string {
  const headerList = headers();
  let hostname = headerList.get('host') || '';
  let protocol = 'https';

  if (hostname.indexOf('localhost') === 0) {
    hostname = 'localhost:3000';
    protocol = 'http';
  }
  return `${protocol}://${hostname}/api`;
}
