// in your node script before running whatever is causing the warnings
process.traceDeprecation = true;

import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { ToastProvider } from 'react-toast-notifications';
import { Web3Store } from '@context/Web3Context';
import GraphProvider from '@libs/Graph';
import { Notification } from '@components/General/Notification';
import { TransactionStore } from '@context/TransactionContext';

const App = ({ Component, pageProps }: AppProps) => {  // eslint-disable-line
    return (
        <div>
            <Head>
                {/** Meta tags */}
                <title>Tracer | Perpetual Swaps </title>
                <meta
                    name="description"
                    content="Build and trade with Tracer’s Perpetual Swaps and gain leveraged exposure to any market in the world. "
                />
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link rel="shortcut icon" type="image/svg" href="/favicon.svg" />
                <meta name="keywords" content="Tracer, DeFi, Bitcoin, Crypto, Exchange, Governance, DAO, Protocol" />
                <meta name="robots" content="index, follow" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="language" content="English" />

                {/** Color for Chrome tabs (Android only) */}
                <meta name="theme-color" content="#03065E" />
            </Head>
            <ToastProvider components={{ Toast: Notification }}>
                <GraphProvider graphUri={process.env.NEXT_PUBLIC_GRAPH_URI ?? ''}>
                    <Web3Store>
                        <TransactionStore>
                            <Component {...pageProps} />
                        </TransactionStore>
                    </Web3Store>
                </GraphProvider>
            </ToastProvider>
        </div>
    );
};

export default App;
