import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const environmentVariables = {
    GOOGLE_ANALYTICS_ACCOUNT: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT
      ? process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT
      : undefined,
    MULTIPLES_ENABLED: process.env.NEXT_PUBLIC_MULTIPLES_ENABLED
      ? Boolean(process.env.NEXT_PUBLIC_MULTIPLES_ENABLED)
      : undefined,
    LANGUAGES_ENABLED: process.env.NEXT_PUBLIC_LANGUAGES_ENABLED
      ? Boolean(process.env.NEXT_PUBLIC_LANGUAGES_ENABLED)
      : undefined,
    GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL
      ? process.env.NEXT_PUBLIC_GATEWAY_URL
      : undefined,
    COOKIE_CONSENT_NAME: process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME
      ? process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME
      : undefined,
  };

  return res.status(200).json(environmentVariables);
}
