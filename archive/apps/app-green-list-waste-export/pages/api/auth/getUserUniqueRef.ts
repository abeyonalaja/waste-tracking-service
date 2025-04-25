import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const token = await getToken({ req: req });
  res.status(200).json({ ref: token.uniqueReference });
}
