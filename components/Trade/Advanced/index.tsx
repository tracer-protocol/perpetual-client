import React, { useContext, useEffect } from 'react';
import { OrderContext, TracerContext, Web3Context } from 'context';
import { MarketSelect, TradingInput, AccountPanel } from './TradingPanel';
import styled from 'styled-components';
import TradingView from './TradingView';

const LeftPanel = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    position: relative;
`;

const RightPanel = styled.div`
    width: 75%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
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

const Advanced: React.FC = () => {
    const { account } = useContext(Web3Context);
    const { selectedTracer } = useContext(TracerContext);
    const { orderDispatch } = useContext(OrderContext);

    useEffect(() => {
        if (orderDispatch) {
            orderDispatch({ type: 'setLock', value: true });
            orderDispatch({ type: 'setAdvanced', value: true });
        } else {
            console.error('Order dispatch undefined');
        }
    }, []);

    return (
        <div className="container flex h-full">
            <LeftPanel>
                <MarketSelect account={account ?? ''} />
                <TradingInput selectedTracer={selectedTracer} account={account ?? ''} />
                <AccountPanel selectedTracer={selectedTracer} account={account ?? ''} />
            </LeftPanel>
            <RightPanel>
                <TradingView selectedTracer={selectedTracer} />
            </RightPanel>
            <Overlay id="trading-overlay" />
        </div>
    );
};

export default Advanced;
