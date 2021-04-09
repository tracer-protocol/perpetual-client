// in your node script before running whatever is causing the warnings
process.traceDeprecation = true;

import React from 'react';
import { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { ToastProvider } from 'react-toast-notifications';
import { Web3Store } from '@context/Web3Context';
import ReduxStore from '@context/ReduxStore';
import GraphProvider from '@libs/Graph';
import { Notification } from '@components/Notifications/Notification';
import Transactions from '@components/components/Notifications/Transactions';

const App = ({ Component, pageProps }: AppProps) => {  // eslint-disable-line
    return (
        <div>
            {/* <Head>
            </Head> */}
            <ToastProvider components={{ Toast: Notification }}>
                <GraphProvider graphUri={process.env.NEXT_PUBLIC_GRAPH_URI ?? ''}>
                    <ReduxStore>
                        <Web3Store>
                            <Transactions />
                            <Component {...pageProps} />
                        </Web3Store>
                    </ReduxStore>
                </GraphProvider>
            </ToastProvider>
        </div>
    );
};

export default App;
