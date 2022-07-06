import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { StoreProvider } from 'store/index';
import Layout from 'components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider initialValue={{ user: {} }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

export default MyApp;
