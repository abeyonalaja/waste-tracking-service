import { getToken } from 'next-auth/jwt';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export const getApiConfig = async (context) => {
  await getServerSession(context.req, context.res, authOptions);
  const token = await getToken({ req: context.req });
  const apiConfig: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.id_token}`,
  };
  return {
    props: {
      apiConfig,
    },
  };
};
