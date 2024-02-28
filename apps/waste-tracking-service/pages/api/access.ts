import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const token = await getToken({ req });
    const invitationToken = req.query.invitation;
    if (token && invitationToken) {
      const fetchData = async () => {
        try {
          fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/privatebeta/users?invitationToken=${invitationToken}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token.id_token}`,
              },
            }
          ).then((response) => {
            if (response.ok) {
              res.redirect(307, '/export/?context=granted');
            } else {
              res.redirect(307, '/?context=error');
            }
          });
        } catch (e) {
          console.error(e);
        }
      };
      await fetchData();
    } else {
      res.redirect(307, '/?context=unauthorized');
    }
  } else {
    res.status(401);
  }
}
