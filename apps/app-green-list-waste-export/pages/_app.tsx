import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import './styles.css';
import 'i18n/config';
import { CookiesProvider } from 'react-cookie';
import { useSession } from 'next-auth/react';
import { useIdle } from '@uidotdev/usehooks';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppInsightsProvider from 'contexts/AppInsightsProvider';
import { unstable_noStore as noStore } from 'next/cache';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  noStore();
  const connectionString = process.env['APPINSIGHTS_CONNECTION_STRING'];
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  return (
    <AppInsightsProvider connectionString={connectionString}>
      <Layout>
        <SessionProvider
          session={session}
          refetchInterval={60}
          basePath={
            process.env['NODE_ENV'] === 'production'
              ? '/export-annex-VII-waste/api/auth'
              : '/api/auth'
          }
        >
          <CookiesProvider>
            <QueryClientProvider client={queryClient}>
              {Component.auth ? (
                <AuthWrapper>
                  <Component {...pageProps} />
                </AuthWrapper>
              ) : (
                <Component {...pageProps} />
              )}
            </QueryClientProvider>
          </CookiesProvider>
        </SessionProvider>
      </Layout>
    </AppInsightsProvider>
  );
}

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const { status } = useSession({ required: true });
  const idle = useIdle(1000 * 60 * 15);

  if (idle) {
    router.push({
      pathname: `/auth/signout`,
      query: { callbackUrl: router.asPath },
    });
  }

  if (status === 'loading') {
    return <></>;
  }
  return children;
};
