import React, { useState, useContext } from 'react';
import LightWeightChart from '@components/Charts/LightWeightChart';
import { OrderContext, TracerContext } from 'context';
import LeverageSlider from '@components/Trade/LeverageSlider';
import TracerSelect from '@components/Trade/TracerSelect';

import { Section } from '@components/SummaryInfo';
import { OrderSummaryButtons, OrderSubmit, SlideSelect } from '@components/Buttons';
import { UserBalance } from '@components/types';
import Tracer from '@libs/Tracer';
import { calcBorrowed, calcLeverage, calcLiquidationPrice, calcNotionalValue, calcWithdrawable, toApproxCurrency, totalMargin } from '@components/libs/utils';
import { PostTradeDetails } from '@components/components/SummaryInfo/PositionDetails';

const Positions: React.FC<{ className: string }> = ({ className }: { className: string }) => {
    const { order, orderDispatch } = useContext(OrderContext);

    return (
        <div className={'flex w-full px-5 ' + className}>
            <SlideSelect
                onClick={(index, _e) =>
                    orderDispatch
                        ? orderDispatch({ type: 'setPosition', value: index })
                        : console.error('Order dispatch function not set')
                }
                value={order?.position ?? 0}
            >
                <a className="m-auto">SHORT</a>
                <a className="m-auto">LONG</a>
            </SlideSelect>
        </div>
    );
};

const OrderSummary:React.FC<{ selectedTracer: Tracer | undefined }> = ({ selectedTracer }) => {
    const { order, exposure } = useContext(OrderContext);

    return (
        <div>
            <Positions className="pt-5 pb-5" />
            <TracerSelect className="px-5 pb-5" inputSize={'text-lg'} />
            <LeverageSlider leverage={order?.leverage ?? 1} />
            <div className="px-5 mt-2 p-5 border-t-2 border-gray-100 text-sm">
                <div className="text-blue-100 font-bold">Order Summary</div>
                <PostTradeDetails 
                    fairPrice={(selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0)}
                    balances={selectedTracer?.balances ?? { 
                        quote: 0, base: 0, totalLeveragedValue: 0, lastUpdatedGasPrice: 0, tokenBalance: 0
                    }}
                    exposure={exposure ?? 0}
                    position={order?.position ?? 0}
                    maxLeverage={selectedTracer?.maxLeverage ?? 1}
                />
            </div>
        </div>
    );
};

const BasicPlaceOrder: React.FC<{ setSummary: (bool: boolean) => void }> = ({
    setSummary,
}: {
    setSummary: (bool: boolean) => void;
}) => {
    const { order } = useContext(OrderContext);
    return (
        <div className="px-24">
            <Positions className="pt-12 pb-16" />
            <TracerSelect className="px-5 pb-16" inputSize={'text-5xl'} />
            <LeverageSlider className="pb-12" leverage={order?.leverage ?? 1}/>
            <OrderSubmit setSummary={setSummary} />
        </div>
    );
};

const BasicOrderSummary: React.FC = () => {
    const { selectedTracer } = useContext(TracerContext);
    return (
        <React.Fragment>
            <div className="flex w-full  border-b-2 border-gray-100">
                <div className="mx-auto text-blue-100 font-bold">
                    <h2>PLACE ORDER</h2>
                </div>
            </div>
            <div className="flex w-full">
                <div className="w-1/2 border-r-2 border-gray-100">
                    <OrderSummary selectedTracer={selectedTracer}/>
                </div>
                <div className="w-1/2 flex flex-col">
                    <div className="h-full border-b-2 border-gray-100">
                        <LightWeightChart />
                    </div>
                    <OrderSummaryButtons balances={selectedTracer?.balances as UserBalance} />
                </div>
            </div>
        </React.Fragment>
    );
};

const Basic: React.FC = () => {
    const [summary, setSummary] = useState(false);
    return (
        <div className="container m-auto h-full flex ">
            <div className="m-auto w-3/4 rounded-lg shadow-2xl bg-white shadow-gray-100">
                {summary ? <BasicOrderSummary /> : <BasicPlaceOrder setSummary={setSummary} />}
            </div>
        </div>
    );
};

export default Basic;

// Collateral -> Required deposit
// For basic required collateral is fixed based on amount and leverage

// Leveral slider should not move automatically
// changing leverage slider will change the required deposit

// Market -> Amount
// Current market value displayed under market
