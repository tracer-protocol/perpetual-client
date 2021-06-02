import React, { useState, useContext, useEffect } from 'react';
import { OrderContext, TracerContext, Web3Context } from 'context';
import LightWeightChart from '@components/Charts/LightWeightChart';
import Timer from '@components/Timer';
import OrderBook from '@components/OrderBook/OrderBook';
import { MarketSelect, TradingInput, AccountPanel } from './TradingPanel';
import Tracer from '@libs/Tracer';
import { AccountSummary } from './AccountDetails';
import { InsuranceInfo } from './RightPanel/InsuranceInfo';
import SubNav from '@components/Nav/SubNav';
import { Box } from '@components/General';
import styled from 'styled-components';
import RecentTrades from './RightPanel/RecentTrades';
import { useCandles, useMostRecentMatched } from '@libs/Graph/hooks/Tracer';
import { CandleData } from 'types/TracerTypes';
import { OMEContext } from '@context/OMEContext';

const GraphWrap = styled.div`
    height: 500px;
    width: calc(100% - 40px);
    margin-bottom: 20px;
    padding: 20px;
`;

const Graphs = () => {
    const [tab, setTab] = useState(0);
    const tabs = ['Price', 'Depth', 'Funding', 'Insurance'];
    const { candles } = useCandles();
    return (
        <div className="3/4">
            <SubNav tabs={tabs} setTab={setTab} selected={tab} />
            <GraphWrap>
                <LightWeightChart candleData={candles as CandleData} />
            </GraphWrap>
        </div>
    );
};

const OrderBookContainer = styled.div`
    border-top: 1px solid #002886;
    padding: 10px;

    h3 {
        letter-spacing: -0.4px;
        color: #ffffff;
        text-transform: capitalize;
        font-size: 20px;
        margin-bottom: 5px;
    }
`;

const TradingView: React.FC<{ selectedTracer: Tracer | undefined }> = ({ selectedTracer }) => {
    const { omeState } = useContext(OMEContext);
    const { mostRecentTrades } = useMostRecentMatched(selectedTracer?.address ?? '');

    return (
        <div>
            <div className="flex">
                <Box className="w-3/4 flex flex-col p-0">
                    <Graphs />
                    <AccountSummary selectedTracer={selectedTracer} />
                </Box>
                <Box className="w-1/4 flex flex-col p-0">
                    <InsuranceInfo />
                    <OrderBookContainer>
                        <h3>Order Book</h3>
                        {omeState?.orders?.askOrders?.length || omeState?.orders?.bidOrders?.length ? (
                            <>
                                <Timer />
                                <OrderBook askOrders={omeState.orders.askOrders} bidOrders={omeState.orders.bidOrders} />
                            </>
                        ) : (
                            <p>No open orders</p>
                        )}
                    </OrderBookContainer>
                    <RecentTrades trades={mostRecentTrades} />
                </Box>
            </div>
        </div>
    );
};

const LeftPanel = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
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
        <div className="flex h-full">
            <LeftPanel>
                <MarketSelect />
                <AccountPanel selectedTracer={selectedTracer} account={account ?? ''} />
                <TradingInput selectedTracer={selectedTracer} account={account ?? ''} />
            </LeftPanel>
            <RightPanel>
                <TradingView selectedTracer={selectedTracer} />
            </RightPanel>
            <Overlay id="trading-overlay" />
        </div>
    );
};

export default Advanced;
