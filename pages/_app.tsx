// prevent creating full trace
process.traceDeprecation = true;

import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { ToastProvider } from 'react-toast-notifications';
import GraphProvider from '@libs/Graph';
import { Notification } from '@components/General/Notification';
import { TransactionStore } from '@context/TransactionContext';
import { FactoryStore } from '@context/FactoryContext';
import GlobalStyles from 'styles/GlobalStyles';
import styled from 'styled-components';
import { Web3Store } from '@context/Web3Context/Web3Context';

const USERSNAP_GLOBAL_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_GLOBAL_API_KEY;
const USERSNAP_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_API_KEY;

const Desktop = styled.div`
    display: block;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const Mobile = styled.div`
    display: none;
    padding-top: 10vh;
    padding-left: 10vw;
    height: 100%;
    background: var(--color-background);
    color: var(--color-text);
    @media (max-width: 1024px) {
        display: block;
    }
    > h1 {
        font-size: 55px;
        font-weight: lighter;
    }
`;

const App = ({ Component, pageProps }: AppProps) => {
    // eslint-disable-line
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
            <GlobalStyles />
            <Desktop>
                <ToastProvider components={{ Toast: Notification }}>
                    {/* <ThemeProvider theme={theme}> */}
                    <Web3Store
                        networkIds={[42, 421611]}
                        onboardConfig={{
                            hideBranding: true,
                            walletSelect: {
                                heading: 'Connect Wallet',
                                // agreement: {
                                //     version: '1.0',
                                //     termsUrl: 'https://google.com',
                                // },
                            },
                        }}
                    >
                        <GraphProvider>
                            <FactoryStore>
                                <TransactionStore>
                                    <Component {...pageProps} />
                                </TransactionStore>
                            </FactoryStore>
                        </GraphProvider>
                    </Web3Store>
                    {/* </ThemeProvider> */}
                </ToastProvider>
            </Desktop>
            <Mobile>
                <h1>Mobile coming soon.</h1>
                <p>
                    Alpha testing is available on desktop only. <br />
                    Switch to desktop to conduct testing.
                </p>
            </Mobile>
        </div>
    );
};

export default App;
