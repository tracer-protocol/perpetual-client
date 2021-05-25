import React, { useContext, useEffect, useState } from 'react';
import { TracerContext, Web3Context } from 'context';
import LightWeightChart from '@components/Charts/LightWeightChart';
import Timer from '@components/Timer';
import OrderBook from '@components/OrderBook/OrderBook';
import { AccountPanel, MarketSelect, TradingInput } from './TradingPanel';
import { getOrders } from 'libs/Ome';
import Web3 from 'web3';
import Tracer from '@libs/Tracer';
import { PositionDetails } from '@components/SummaryInfo/PositionDetails';
import { InsuranceInfo } from './RightPanel/InsuranceInfo';
import SubNav from '@components/Nav/SubNav';
import { Box } from '@components/General';
import styled from 'styled-components';
import RecentTrades from './RightPanel/RecentTrades';

const GraphWrap = styled.div`
    height: 500px;
    width: calc(100% - 40px);
    margin-bottom: 20px;
    padding: 20px;
`;

const Graphs = () => {
    const [tab, setTab] = useState(0);
    const tabs = ['Price', 'Depth', 'Funding', 'Insurance'];
    return (
        <div className="3/4">
            <SubNav tabs={tabs} setTab={setTab} selected={tab} />
            <GraphWrap>
                <LightWeightChart />
            </GraphWrap>
        </div>
    );
};

const parseRes = (res: any, multiplier: number) => {
    const parseOrders = (orders: any) => {
        const sections = Object.values(orders);
        return sections.map((orders: any) =>
            orders.reduce(
                (prev: any, order: { amount: number; price: number }) => ({
                    price: order.price / multiplier, // price remains the same,
                    quantity: prev.quantity + parseFloat(Web3.utils.fromWei(order.amount.toString())),
                }),
                {
                    quantity: 0,
                },
            ),
        );
    };

    return {
        askOrders: parseOrders(res?.asks ?? {}),
        bidOrders: parseOrders(res?.bids ?? {}),
    };
};

const useOrders = (trigger: boolean, selectedTracer: Tracer | undefined) => {
    const market = selectedTracer?.address;
    const priceMultiplier = selectedTracer?.priceMultiplier ?? 1;
    const [response, setResponse] = useState<any>({
        askOrders: [],
        bidOrders: [],
    });
    useEffect(() => {
        const fetchData = async () => {
            const res = await getOrders(market as string);
            setResponse(parseRes(res, priceMultiplier));
        };
        let id: any;
        if (!!market) {
            fetchData();
            id = setInterval(() => fetchData(), 5000);
        }
        return () => clearInterval(id);
    }, [trigger, market]);
    return response;
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
    const orders = useOrders(true, selectedTracer);
    const testTrades = [
        {
            amount: 1,
            bid: false,
            price: 59852,
            time: '14:03',
        },
        {
            amount: 5,
            bid: true,
            price: 59852,
            time: '14:02',
        },
        {
            amount: 4,
            bid: false,
            price: 59852,
            time: '14:01',
        },
    ];
    return (
        <div>
            <div className="flex">
                <Box className="w-3/4 flex flex-col p-0">
                    <Graphs />
                    <TradingSummary selectedTracer={selectedTracer} />
                </Box>
                <Box className="w-1/4 flex flex-col p-0">
                    <InsuranceInfo />
                    <OrderBookContainer>
                        <h3>Order Book</h3>
                        {orders.askOrders?.length || orders.bidOrders?.length ? (
                            <>
                                <Timer />
                                <OrderBook askOrders={orders.askOrders} bidOrders={orders.bidOrders} />
                            </>
                        ) : (
                            <p>No open orders</p>
                        )}
                    </OrderBookContainer>
                    <RecentTrades trades={testTrades} />
                </Box>
            </div>
        </div>
    );
};

type TSProps = {
    selectedTracer: Tracer | undefined;
    className?: string;
};

const TradingSummary: React.FC<TSProps> = styled(({ selectedTracer, className }: TSProps) => {
    const [tab, setTab] = useState(0);
    const tabs = [`Position`, `Orders`, `Fills`];
    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <PositionDetails
                        balance={selectedTracer?.balances}
                        fairPrice={(selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 1)}
                        maxLeverage={selectedTracer?.maxLeverage ?? 1}
                    />
                );
            default:
                return;
        }
    };
    return (
        <div className={className}>
            <SubNav tabs={tabs} setTab={setTab} selected={tab} />
            {content()}
        </div>
    );
})`
    border-top: 1px solid #0c3586;
`;

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
