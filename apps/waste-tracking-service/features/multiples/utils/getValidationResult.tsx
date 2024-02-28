import axios from 'axios';

async function getToken() {
  const fetchToken = await fetch('/api/auth/getDCIDToken');
  const token = await fetchToken.json();
  return token.token;
}

export async function getValidationResult(id: string) {
  const token = await getToken();
  const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/batches/${id}`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return axios.get(url, {
    headers,
  });
}
