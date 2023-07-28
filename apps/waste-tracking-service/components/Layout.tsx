import React from 'react';
import { SubmissionContextProvider } from '../contexts/submissionContext';

export default function Layout({ children }) {
  return <SubmissionContextProvider>{children}</SubmissionContextProvider>;
}
