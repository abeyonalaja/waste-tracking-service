import type { DCIDSession } from 'pages/api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';

const useApiConfig = () => {
  const apiConfig: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const { data } = useSession();
  const userSessionData: DCIDSession = data;
  apiConfig.Authorization = `Bearer ${userSessionData?.token}`;
  return apiConfig;
};

export default useApiConfig;
