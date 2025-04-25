import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  function BooleanFromString(bool) {
    const str = String(bool);
    return str === 'true';
  }
  const environmentVariables = {
    GOOGLE_ANALYTICS_ACCOUNT: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT
      ? process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT
      : undefined,
    MULTIPLES_ENABLED: process.env.NEXT_PUBLIC_MULTIPLES_ENABLED
      ? BooleanFromString(process.env.NEXT_PUBLIC_MULTIPLES_ENABLED)
      : false,
    LANGUAGES_ENABLED: process.env.NEXT_PUBLIC_LANGUAGES_ENABLED
      ? BooleanFromString(process.env.NEXT_PUBLIC_LANGUAGES_ENABLED)
      : false,
    SERVICE_CHARGE_ENABLED: process.env.SERVICE_CHARGE_ENABLED,
    GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL
      ? process.env.NEXT_PUBLIC_GATEWAY_URL
      : undefined,
    COOKIE_CONSENT_NAME: process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME
      ? process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME
      : undefined,
    APPINSIGHTS_CONNECTION_STRING:
      process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING,
  };

  return res.status(200).json(environmentVariables);
}
