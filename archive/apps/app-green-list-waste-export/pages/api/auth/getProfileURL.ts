import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  const domain = new URL(process.env.DCID_WELLKNOWN);
  res.status(200).json({ url: domain.origin });
}
