import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import './styles.css';
import 'i18n/config';
import { CookiesProvider } from 'react-cookie';
import { useGoogleTagManager } from '../utils/GoogleTagManager';
import { useSession } from 'next-auth/react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  useGoogleTagManager();
  return getLayout(
    <SessionProvider session={session} refetchInterval={60}>
      <CookiesProvider>
        {Component.auth ? (
          <AuthWrapper>
            <Component {...pageProps} />
          </AuthWrapper>
        ) : (
          <Component {...pageProps} />
        )}
      </CookiesProvider>
    </SessionProvider>
  );
}

const AuthWrapper = ({ children }) => {
  const { status } = useSession({ required: true });
  if (status === 'loading') {
    return <></>;
  }
  return children;
};
