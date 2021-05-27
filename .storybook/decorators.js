import { ToastProvider } from 'react-toast-notifications';
import { Web3Store } from '@context/Web3Context';
import { OrderStore } from '@context/OrderContext';
import { SelectedTracerStore } from '@context/TracerContext';
import GraphProvider from '@libs/Graph';
import { Notification } from '@components/Notifications/Notification';

export const withGlobalContext = (Story) => (
    <ToastProvider components={{ Toast: Notification }}>
        <GraphProvider graphUri={process.env.NEXT_PUBLIC_GRAPH_URI}>
            <Web3Store>
                <Story />
            </Web3Store>
        </GraphProvider>
    </ToastProvider>
);

export const withOrderContext = (Story) => (
    <SelectedTracerStore>
        <OrderStore>
            <Story />
        </OrderStore>
    </SelectedTracerStore>
);
