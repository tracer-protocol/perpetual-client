import React, { useContext, useEffect } from 'react';
import { OrderContext, TracerContext, Web3Context } from 'context';
import { MarketSelect, AccountPanel } from './TradingPanel';
import { PlaceOrder } from './TradingPanel/TradingInput';
import styled from 'styled-components';
import TradingView from './RightPanel';

const TradingPanel = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    height: 87vh;
    position: relative;
    border-left: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-bottom: 1px solid #0c3586;
`;

const RightPanel = styled.div`
    width: 75%;
    display: flex;
    height: 87vh;
    border-bottom: 1px solid #0c3586;
`;

const Overlay = styled.div`
    position: absolute;
    background: black;
    transition: opacity 0.3s ease-in-out 0.1s;
    opacity: 0;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -9999;

    &.display {
        z-index: 2;
        opacity: 0.5;
    }
`;

const Advanced: React.FC = styled(({ className }) => {
    const { account } = useContext(Web3Context);
    const { selectedTracer } = useContext(TracerContext);
    const { order, orderDispatch = () => console.error('Order dispatch not set') } = useContext(OrderContext);

    useEffect(() => {
        if (orderDispatch) {
            orderDispatch({ type: 'setLock', value: true });
            orderDispatch({ type: 'setAdvanced', value: true });
        } else {
            console.error('Order dispatch undefined');
        }
    }, []);

    return (
        <div className={`container ${className}`}>
            <TradingPanel>
                <MarketSelect account={account ?? ''} />
                <PlaceOrder selectedTracer={selectedTracer} account={account ?? ''} />
                <AccountPanel selectedTracer={selectedTracer} account={account ?? ''} order={order} />
            </TradingPanel>
            <RightPanel>
                <TradingView selectedTracer={selectedTracer} />
            </RightPanel>
            <Overlay id="trading-overlay" />
        </div>
    );
})`
    display: flex;
    height: 100%;
`;

export default Advanced;
