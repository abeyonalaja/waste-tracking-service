import React from 'react';
import { SubmissionContextProvider } from '../contexts/submissionContext';
import { useGoogleTagManager } from '../utils/GoogleTagManager';

export default function Layout({ children }) {
  useGoogleTagManager();
  return <SubmissionContextProvider>{children}</SubmissionContextProvider>;
}
