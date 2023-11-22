import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import './styles.css';
import 'i18n/config';
import { useGoogleTagManager } from '../utils/GoogleTagManager';

type AppPropsWithLayout = AppProps & {
  Component;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  useGoogleTagManager();
  return getLayout(<Component {...pageProps} />);
}
