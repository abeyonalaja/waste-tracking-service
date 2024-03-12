import axios from 'axios';

const getToken = async () => {
  const fetchToken = await fetch('/api/auth/getDCIDToken');
  const token = await fetchToken.json();
  return token.token;
};

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
});

const apiClient = async ({ ...options }) => {
  const token = await getToken();
  client.defaults.headers.common.Authorization = `Bearer ${token}`;

  const onSuccess = (response) => response;
  const onError = (error) => {
    return error.response;
  };

  return client(options).then(onSuccess).catch(onError);
};

export default apiClient;
