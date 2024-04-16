import React, { useEffect, useState } from 'react';
import { SubmissionContextProvider } from '../contexts/submissionContext';
import { useCookies } from 'react-cookie';
import { GoogleAnalytics } from '@next/third-parties/google';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [cookies] = useCookies(['cookieConsent']);
  const [gaId, setGaId] = useState(null);
  const [featureFlags, setFeatureFlags] = useState(null);
  const analyticsEnabled = cookies.cookieConsent?.analytics && gaId;

  const baseUrl =
    process.env['NODE_ENV'] === 'production' ? '/export-annex-VII-waste' : '';

  const ff = {
    multiples: false,
    languages: false,
  };

  useEffect(() => {
    async function getEnvVars() {
      try {
        const res = await fetch(`${baseUrl}/api/env`);
        const data = await res.json();

        ff.multiples = data.MULTIPLES_ENABLED;
        ff.languages = data.LANGUAGES_ENABLED;

        setFeatureFlags(ff);
        setGaId(data.GOOGLE_ANALYTICS_ACCOUNT);
      } catch (err) {
        console.error(err);
      }
    }
    getEnvVars();
  }, []);

  return (
    <SubmissionContextProvider featureFlags={featureFlags}>
      {analyticsEnabled && <GoogleAnalytics gaId={gaId} />}
      {children}
    </SubmissionContextProvider>
  );
}
