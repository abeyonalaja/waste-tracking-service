import { JWT } from 'next-auth/jwt';

export const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  let tokenEndpoint;
  const fetchData = async (): Promise<void> => {
    const response = await fetch(process.env.DCID_WELLKNOWN || '', {
      cache: 'force-cache',
      method: 'get',
    });
    const dcidConfig = await response.json();
    tokenEndpoint = dcidConfig.token_endpoint;
  };
  await fetchData();
  if (tokenEndpoint) {
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:
          `grant_type=refresh_token` +
          `&client_secret=${process.env.DCID_CLIENT_SECRET}` +
          `&redirect_uri=${process.env.DCID_REDIRECT}` +
          `&refresh_token=${token.refreshToken as string}` +
          `&client_id=${process.env.DCID_CLIENT_ID}`,
      });
      const refreshedToken = await response.json();
      return {
        ...token,
        id_token: refreshedToken.id_token,
        idTokenExpires: Date.now() + refreshedToken.id_token_expires_in * 1000,
        refreshToken: refreshedToken.refresh_token,
      };
    } catch (error) {
      throw new Error('Endpoint error');
    }
  } else {
    throw new Error('Token endpoint not found');
  }
};
