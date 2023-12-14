import { getToken } from 'next-auth/jwt';

export const getApiConfig = async (context) => {
  const token = await getToken({ req: context.req });
  const apiConfig: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.id_token}`,
  };

  console.log(context.host);

  return {
    props: {
      apiConfig,
      googleTagManagerID: 'G-SKK1DY4NVV',
    },
  };
};
