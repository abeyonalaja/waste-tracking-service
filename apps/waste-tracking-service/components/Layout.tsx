import React from 'react';
import { SubmissionContextProvider } from '../contexts/submissionContext';
import { useCookies } from 'react-cookie';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function Layout({ children }) {
  const [cookies] = useCookies(['cookieConsent']);
  const analyticsEnabled =
    cookies.cookieConsent?.analytics &&
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT;

  return (
    <SubmissionContextProvider>
      {analyticsEnabled && (
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT}
        />
      )}

      {children}
    </SubmissionContextProvider>
  );
}
