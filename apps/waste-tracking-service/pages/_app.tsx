import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import './styles.css';
import 'i18n/config';
import { CookiesProvider } from 'react-cookie';
import { useGoogleTagManager } from '../utils/GoogleTagManager';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  useGoogleTagManager(pageProps.googleTagManagerID);
  return getLayout(
    <SessionProvider session={session}>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </SessionProvider>
  );
}
