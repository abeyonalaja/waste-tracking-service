import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import './styles.css';
import 'i18n/config';
import { CookiesProvider } from 'react-cookie';
import { useGoogleAnalytics } from '../utils/GoogleAnalytics';

type AppPropsWithLayout = AppProps & {
  Component;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  useGoogleAnalytics();
  return getLayout(
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}
