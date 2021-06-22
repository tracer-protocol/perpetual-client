// prevent creating full trace
process.traceDeprecation = true;

import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { ToastProvider } from 'react-toast-notifications';
import { Web3Store } from '@context/Web3Context';
import GraphProvider from '@libs/Graph';
import { Notification } from '@components/General/Notification';
import { TransactionStore } from '@context/TransactionContext';
import { FactoryStore } from '@context/FactoryContext';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const USERSNAP_GLOBAL_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_GLOBAL_API_KEY;
const USERSNAP_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_API_KEY;

const theme = {
    primary: "mediumseagreen",
    secondary: "mediumseagreen"
};

const GlobalStyles = createGlobalStyle`
  html {
        --font-size-small: 1rem;
        --font-size-medium: 1.25rem;
        --color-background: #000240;
        --color-text: #fff;
        --color-primary: #3da8f5;
        --color-accent: #002886;
      
        background-color: var(--color-background);
        color: var(--color-text);
  }
`;

const App = ({ Component, pageProps }: AppProps) => { // eslint-disable-line
    useEffect(() => {
        // @ts-ignore
        window.onUsersnapCXLoad = function (api) {
            // @ts-ignore
            window.Usersnap = api;
            api.init();
            api.show(USERSNAP_API_KEY);
        };
    }, []);
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
                <meta name="theme-color" content="#000240" />

                <script
                    async
                    src={`https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad`}
                />
            </Head>
            <ToastProvider components={{ Toast: Notification }}>
                {/* <ThemeProvider theme={theme}> */}
                    <Web3Store>
                        <GraphProvider>
                            <FactoryStore>
                                <TransactionStore>
                                    <GlobalStyles />
                                    <Component {...pageProps} />
                                </TransactionStore>
                            </FactoryStore>
                        </GraphProvider>
                    </Web3Store>
                {/* </ThemeProvider> */}
            </ToastProvider>
        </div>
    );
};

export default App;
