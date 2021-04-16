import React, { useState, useContext, useEffect } from 'react';
import { TracerContext, Web3Context } from 'context';
import LightWeightChart from '@components/Charts/LightWeightChart';
import { SubNavBar } from '@components/Nav';

import Timer from '@components/Timer';
import OrderBook from '@components/OrderBook/OrderBook';
import { MarketSelect, TradingInput, WalletConnect } from './TradingPanel';
import { getOrders } from '@components/libs/Ome';
import Web3 from 'web3';
import Tracer from '@libs/Tracer';
import { PositionDetails } from '@components/components/SummaryInfo/PositionDetails';

const parseRes = (res: any, multiplier: number) => {
    const parseOrders = (orders: any) => {
        const sections = Object.values(orders);
        const flattenedOrders = sections.map((orders: any) =>
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
        return flattenedOrders;
    };

    return {
        askOrders: parseOrders(res?.asks ?? {}),
        bidOrders: parseOrders(res?.bids ?? {}),
    };
};

const useOrders = (trigger: boolean, selectedTracer: Tracer | undefined) => {
    const market = selectedTracer?.address;
    const priceMultiplier = selectedTracer?.priceMultiplier ?? 0;
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

const TradingView: React.FC<{ selectedTracer: Tracer | undefined }> = ({ selectedTracer }) => {
    const orders = useOrders(true, selectedTracer);
    return (
        <div className="advanced-card">
            <div className="bg-blue-200">
                <h4 className="px-3">{selectedTracer?.marketId}</h4>
            </div>
            <div className="flex h-screen/50">

                <div className="w-3/4">
                    <LightWeightChart />
                </div>
                <div className="w-1/4 border-l-2 border-gray-100 flex flex-col">
                    <h4 className="border-b-2 border-gray-100 px-3">Order Book</h4>
                    <Timer />
                    <OrderBook askOrders={orders.askOrders} bidOrders={orders.bidOrders} />
                </div>
            </div>
        </div>
    );
};

const TradingSummary: React.FC<{ selectedTracer: Tracer | undefined}> = ({ selectedTracer }) => {
    const [tab, setTab] = useState(0);
    const tabs = [`My ${selectedTracer?.marketId} Position`, `My ${selectedTracer?.marketId} Orders`, `My ${selectedTracer?.marketId} Fills`];
    const content = () =>  {
        switch (tab) {
            case 0:
                return (
                    <PositionDetails 
                        balance={selectedTracer?.balances} 
                        fairPrice={(selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0)}
                        maxLeverage={selectedTracer?.maxLeverage ?? 1}
                    />
                )
                
        }
    }
    return (
        <div className="advanced-card h-full flex">
            <div className="w-3/4">
                <SubNavBar position={'start'} tabs={tabs} setTab={setTab} selected={tab} background="blue-200" />
                {content()}
            </div>
            <div className="w-1/4 border-l-2 border-gray-100">
                <h4 className="border-b-2 border-gray-100 px-3">Recent Trades</h4>
            </div>
        </div>
    );
};

const Advanced: React.FC = () => {
    const { account } = useContext(Web3Context);
    const { selectedTracer } = useContext(TracerContext);
    return (
        <div className="flex h-full">
            <div className="w-1/4 flex flex-col max-h-screen/90">
                <MarketSelect />
                <WalletConnect balances={selectedTracer?.balances} account={account ?? ''} />
                <TradingInput selectedTracer={selectedTracer} />
            </div>
            <div className="w-3/4 flex flex-col max-h-screen/90">
                <TradingView selectedTracer={selectedTracer} />
                <TradingSummary selectedTracer={selectedTracer}/>
            </div>
        </div>
    );
};

export default Advanced;
