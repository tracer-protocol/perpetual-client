import React, { useContext, useEffect, useState } from 'react';
import { OrderContext, TracerContext, Web3Context } from 'context';
import { MarketSelect, AccountPanel } from './TradingPanel';
import { ModifyOrder, PlaceOrder } from './TradingPanel/TradingInput';
import styled from 'styled-components';
import TradingView from './RightPanel';
import { MARKET } from '@context/OrderContext';

const TradingPanel = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    height: 92vh;
    position: relative;
    border-left: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
`;

const RightPanel = styled.div`
    width: 75%;
    display: flex;
    height: 92vh;
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
    const { order, orderDispatch } = useContext(OrderContext);
    const [isAdjust] = useState(false);

    useEffect(() => {
        if (orderDispatch) {
            orderDispatch({ type: 'setLock', value: true });
            orderDispatch({ type: 'setAdvanced', value: true });
        } else {
            console.error('Order dispatch undefined');
        }
    }, []);

    useEffect(() => {
        if (isAdjust) {
            if (orderDispatch) {
                orderDispatch({ type: 'setOrderType', value: MARKET });
            } else {
                console.error('Order dispatch undefined');
            }
        }
    }, [isAdjust]);

    return (
        <div className={`container ${className}`}>
            <TradingPanel>
                <MarketSelect account={account ?? ''} />
                {isAdjust ? (
                    <ModifyOrder selectedTracer={selectedTracer} account={account ?? ''} />
                ) : (
                    <PlaceOrder selectedTracer={selectedTracer} account={account ?? ''} />
                )}
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
    max-height: 92vh;
`;

export default Advanced;
