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
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps}/>
    } else {
      return (
         <Layout>
            <Component {...pageProps} />
          </Layout>
      );
    }
  };

  return (
    <StoreProvider initialValue={initialValue}>
         {renderLayout()}
    </StoreProvider>
  )
   
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  console.log(ctx?.req?.cookies);
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};
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
