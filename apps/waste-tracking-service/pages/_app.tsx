import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import { SubmissionContextProvider } from '../contexts/submissionContext';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Green list waste overview</title>
      </Head>
      <SubmissionContextProvider>
        <Component {...pageProps} />
      </SubmissionContextProvider>
    </>
  );
}

export default CustomApp;
