import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Head>
                <title>Welcome to Tix.Dev!</title>
                <link rel='icon' type='image/x-icon' href='/favicon.ico' />
            </Head>
            <Header currentUser={currentUser} />
            <div className='container mt-3'>
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    let pageProps;
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(
            appContext.ctx,
            client,
            data.currentUser
        );
    }

    return {
        pageProps,
        ...data,
    };
};

export default AppComponent;
