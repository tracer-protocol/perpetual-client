// prevent creating full trace
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
import { FactoryStore } from '@context/FactoryContext';

const USERSNAP_GLOBAL_API_KEY = '2588e01d-f08f-41be-b127-1c036f878c0b';
const USERSNAP_API_KEY = '01bf5b32-7165-4485-a985-3624a96d21c3';

const App = ({ Component, pageProps }: AppProps) => { // eslint-disable-line
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
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              window.onUsersnapCXLoad = function(api) {
                // store the Usersnap global api on the window, if case you want to use it in other contexts
                window.Usersnap = api; 
                api.init();
                api.show('${USERSNAP_API_KEY}') 
            }         
            `,
                    }}
                />
            </Head>
            <ToastProvider components={{ Toast: Notification }}>
                <Web3Store>
                    <GraphProvider>
                        <FactoryStore>
                            <TransactionStore>
                                <Component {...pageProps} />
                            </TransactionStore>
                        </FactoryStore>
                    </GraphProvider>
                </Web3Store>
            </ToastProvider>
        </div>
    );
};

export default App;
