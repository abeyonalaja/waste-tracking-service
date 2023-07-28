import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import './styles.css';

type AppPropsWithLayout = AppProps & {
  Component;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  return getLayout(<Component {...pageProps} />);
}
