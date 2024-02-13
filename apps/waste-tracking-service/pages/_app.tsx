import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import PDFLayout from 'components/PDFLayout';
import './styles.css';
import 'i18n/config';
import { CookiesProvider } from 'react-cookie';
import { useSession } from 'next-auth/react';
import { useIdle } from '@uidotdev/usehooks';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  if (Component.layout === 'PDF') {
    return (
      <PDFLayout>
        <Component {...pageProps} />
      </PDFLayout>
    );
  } else {
    return (
      <Layout>
        <SessionProvider session={session} refetchInterval={60}>
          <CookiesProvider>
            <QueryClientProvider client={queryClient}>
              {Component.auth ? (
                <AuthWrapper>
                  <Component {...pageProps} />
                </AuthWrapper>
              ) : (
                <Component {...pageProps} />
              )}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </CookiesProvider>
        </SessionProvider>
      </Layout>
    );
  }
}

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const { status } = useSession({ required: true });
  const idle = useIdle(1000 * 60 * 15);

  if (idle) {
    router.push({
      pathname: '/auth/signout',
      query: { callbackUrl: router.asPath },
    });
  }

  if (status === 'loading') {
    return <></>;
  }
  return children;
};
