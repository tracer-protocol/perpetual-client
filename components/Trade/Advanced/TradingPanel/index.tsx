import React, { useContext, useState } from 'react';
import { OrderContext, TracerContext } from 'context';
import { useAdvancedTradingMarkets } from '@hooks/TracerHooks';
import { AdvancedOrderButton, SlideSelect } from '@components/Buttons';
import { MatchingEngine, Option } from '@components/Buttons/SlideSelect';
import { SearchBar } from '@components/Nav';
import { Section } from '@components/SummaryInfo';
import { SearchableTable } from '@components/Tables/SearchableTable';
import { DefaultSlider } from '@components/Trade/LeverageSlider';
import InputSelects from './Inputs';
import { Tracer } from '@components/libs';
import { UserBalance } from '@components/types';
import { PostTradeDetails } from '@components/components/SummaryInfo/PositionDetails';
import { MarginButton } from '@components/components/Buttons/MarginButtons';

export const MarketSelect: React.FC = () => {
    const { setTracerId } = useContext(TracerContext);
    const markets = useAdvancedTradingMarkets();
    const [filter, setFilter] = useState('');

    const tableClasses = 'h-32 overflow-scroll overscroll-none w-full ';
    const headings = ['Trace', 'Last Price', 'Price'];
    return (
        <div className="advanced-card shadow-gray-100">
            <div className="title flex">
                <div className="w-1/2">
                    <h4>Select a market</h4>
                </div>
                <SearchBar cClasses={'h-5 w-full m-auto'} filter={filter} setFilter={setFilter} />
            </div>
            <div className="body flex w-full text-xs">
                <SearchableTable
                    handleRowClick={setTracerId}
                    cClasses={tableClasses}
                    compact={true}
                    headings={headings}
                    rows={markets}
                    filter={filter}
                />
            </div>
        </div>
    );
};

export const WalletConnect: React.FC<{ balances: UserBalance | undefined; account: string }> = ({
    balances,
    account,
}) => {
    const sButton = 'button-grow rounded border-blue-100 p-1 text-center text-sm';

    return account === '' ? (
        <div className="advanced-card shadow-gray-100">
            <h4 className="title">Connect your Ethereum Wallet</h4>
            <div className="flex">
                <div className={`sButton`}>Connect</div>
            </div>
        </div>
    ) : (
        <div className="advanced-card shadow-gray-100">
            <h4 className="title">Your available margin</h4>
            <div className="body">
                <div className="border-b-2 border-gray-100">
                    <Section label="Balance">{balances?.base ?? 0}</Section>
                    {/* <Section label="Collateralisation ratio">{5}%</Section> */}
                </div>
                <div className="flex pt-2">
                    <div className="w-2/6 mr-auto">
                        <MarginButton type="Deposit" />
                    </div>
                    <div className="w-2/6 ml-auto">
                        <MarginButton type="Withdraw" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TradingInput: React.FC<{ selectedTracer: Tracer | undefined }> = ({ selectedTracer }) => {
    const { order, exposure } = useContext(OrderContext);

    return (
        <div className="advanced-card h-full overflow-scroll">
            <div className="body text-xs">
                {/* Matching engine select */}
                <MatchingEngineSelect selected={order?.matchingEngine ?? 0} />

                {/* Position select */}
                <div className="p-4">
                    <PositionSelect selected={order?.position ?? 0} />
                </div>

                {/* Position select */}
                <div className="p-4">
                    <OrderTypeSelect selected={order?.orderType ?? 0} />
                </div>

                {/* Quanity and Price Inputs */}
                <InputSelects
                    amount={order?.rMargin ?? 0}
                    price={order?.price || 0}
                    tracerId={selectedTracer?.marketId ?? ''}
                />

                {/* Dont display these if it is a limit order*/}
                {order?.orderType !== 1 ? (
                    <>
                        {/* Slippage select */}
                        {/* <Slippage /> */}
                        {/* Leverage select */}
                        <Leverage leverage={order?.leverage ?? 1} />
                    </>
                ) : (
                    <></>
                )}

                <PostTradeDetails 
                    fairPrice={(selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0)}
                    balances={selectedTracer?.balances ?? { 
                        quote: 0, base: 0, totalLeveragedValue: 0, lastUpdatedGasPrice: 0, tokenBalance: 0
                    }}
                    exposure={exposure ?? 0}
                    position={order?.position ?? 0}
                    maxLeverage={selectedTracer?.maxLeverage ?? 1}
                />
                

                {/* Place Order */}
                <div className="py-1">
                    <AdvancedOrderButton balances={selectedTracer?.balances} />
                </div>
            </div>
        </div>
    );
};

type SProps = {
    selected: number;
};

const MatchingEngineSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    const cClasses = 'flex m-auto text-xs border-2 border-gray-100 rounded-full ';
    const bClasses = 'flex w-1/2 rounded-full cursor-pointer justify-center ';
    return (
        <SlideSelect
            cClasses={cClasses}
            bClasses={bClasses}
            value={selected}
            onClick={(index, _e) => {
                orderDispatch
                    ? orderDispatch({ type: 'setMatchingEngine', value: index })
                    : console.error('Order dispatch function not set');
            }}
        >
            <MatchingEngine title="AMM" subTitle="On-chain" />
            <MatchingEngine title="ORDER BOOK" subTitle="Off-chain" />
        </SlideSelect>
    );
};

const PositionSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    const colour = `${selected === 0 ? 'red' : 'green'}`; // red short
    return (
        <SlideSelect
            sClasses={`border-b-4 border-${colour}-200 text-${colour}-200 font-bold shadow-lg shadow-gray-100 `}
            bClasses={'flex w-1/2 cursor-pointer justify-center '}
            cClasses={'flex w-3/4 m-auto '}
            uClasses={'border-b-4 border-gray-100 text-gray-100 '}
            onClick={(index, _e) =>
                orderDispatch
                    ? orderDispatch({ type: 'setPosition', value: index })
                    : console.error('Order dispatch function not set')
            }
            value={selected}
        >
            <Option>SELL/SHORT</Option>
            <Option>BUY/LONG</Option>
        </SlideSelect>
    );
};

const OrderTypeSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SlideSelect
            sClasses={'border-b-4 border-blue-100 text-blue-100 opacity-50 font-bold shadow-lg shadow-gray-100 '}
            uClasses={'border-b-4 border-gray-100 text-gray-100 '}
            cClasses={'flex w-3/4 m-auto '}
            bClasses={'flex w-1/2 cursor-pointer justify-center '}
            onClick={(index, _e) =>
                orderDispatch
                    ? orderDispatch({ type: 'setOrderType', value: index })
                    : console.error('Order dispatch function not set')
            }
            value={selected}
        >
            <Option>MARKET</Option>
            <Option>LIMIT</Option>
            <Option>SPOT</Option>
        </SlideSelect>
    );
};

type LProps = {
    leverage: number;
};

const Leverage: React.FC<LProps> = ({ leverage }: LProps) => {
    return (
        <div className="m-3 text-blue-100 flex">
            <a className="w-1/4">Leverage</a>
            <div className="w-3/4 p-2">
                <DefaultSlider leverage={leverage} />
            </div>
        </div>
    );
};
