import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  const fetchData = async () => {
    const response = await fetch(process.env.DCID_WELLKNOWN, {
      cache: 'force-cache',
      method: 'get',
    });
    const dcidConfig = await response.json();
    res.status(200).json({ url: dcidConfig.end_session_endpoint });
  };
  fetchData();
  res.status(403);
}
