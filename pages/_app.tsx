// in your node script before running whatever is causing the warnings
process.traceDeprecation = true;

import React from 'react';
import { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { ToastProvider } from 'react-toast-notifications';
import { Web3Store } from '@context/Web3Context';
import GraphProvider from '@libs/Graph';
import { Notification } from '@components/Notifications/Notification';
import { TransactionStore } from '@components/context/TransactionContext';

const App = ({ Component, pageProps }: AppProps) => {  // eslint-disable-line
    return (
        <div>
            {/* <Head>
            </Head> */}
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
