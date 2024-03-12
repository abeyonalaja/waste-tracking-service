import { getToken } from 'next-auth/jwt';
export default async function handler(req, res) {
  const token = await getToken({ req: req });
  res.status(200).json({ ref: token.uniqueReference });
}
