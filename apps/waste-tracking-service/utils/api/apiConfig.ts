import { getToken } from 'next-auth/jwt';

export const getApiConfig = async (context) => {
  const token = await getToken({ req: context.req });
  const apiConfig: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.id_token}`,
  };
  return { props: { apiConfig } };
};
