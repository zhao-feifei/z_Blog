import '../styles/globals.css';
import NextPage from 'next/app';
import { StoreProvider } from 'store/index';
import Layout from 'components/layout';
// import type { AppProps } from 'next/app';

interface IProps {
  initialValue: Record<any, any>;
  // eslint-disable-next-line no-undef
  Component: NextPage;
  pageProps: any;
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  console.log(ctx.req.cookies);
  const { userId, nickname, avatar } = ctx?.req.cookies || {};
  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
};

export default MyApp;
