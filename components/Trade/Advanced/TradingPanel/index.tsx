import React, { useContext, useState, ChangeEvent } from 'react';
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
                    <Section label="Collateralisation ratio">{5}%</Section>
                </div>
                <div className="flex pt-2">
                    <div className="w-2/6 mr-auto">
                        <div className={`${sButton}`}>Deposit</div>
                    </div>
                    <div className="w-2/6 ml-auto">
                        <div className={`${sButton}`}>Withdraw</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TradingInput: React.FC<{ selectedTracer: Tracer | undefined }> = ({ selectedTracer }) => {
    const { order } = useContext(OrderContext);

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
                        <Slippage />
                        {/* Leverage select */}
                        <Leverage leverage={order?.leverage ?? 1} />
                    </>
                ) : (
                    <></>
                )}


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
    const colour = `${selected ? 'red' : 'green'}`;
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
            <Option>BUY/LONG</Option>
            <Option>SELL/SHORT</Option>
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

const Slippage: React.FC = () => {
    const [maxSlippage, setMaxSlippage] = useState(0);
    const [custom, setCustom] = useState('');
    const sButton = 'button-grow border-blue-100 h-8 mx-1 p-1 rounded ';
    const active = 'bg-blue-200 shadow-md shadow-grey-100';
    const sInput =
        'appearance-none flex max-w-full focus:border-none focus:outline-none focus:shadow-none text-md text-right ' +
        (maxSlippage === 2 ? 'bg-blue-200 w-4/6 ' : '');

    const handleClick = (id: number) => {
        setMaxSlippage(id);
    };

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value.replace('%', ''));
        if (!value) {
            setCustom('');
        } else if (value <= 5 && value > 0) {
            setCustom(e.target.value);
        } // else do nothing
    };

    return (
        <div className="p-3 flex text-blue-100 ">
            <a className="w-1/4 m-auto">Max Slippage</a>
            <div className="flex w-3/4 justify-end">
                <div key="0" onClick={(_e) => handleClick(0)} className={sButton + (maxSlippage === 0 ? active : '')}>
                    0.5%
                </div>
                <div onClick={(_e) => handleClick(1)} className={sButton + (maxSlippage === 1 ? active : '')}>
                    1.0%
                </div>
                <div
                    onClick={(_e) => handleClick(2)}
                    className={sButton + 'w-2/6 justify-end flex ' + (maxSlippage === 2 ? active : '')}
                >
                    <input
                        className={sInput}
                        id="username"
                        type="number"
                        placeholder="Custom"
                        onChange={handleInput}
                        value={custom && maxSlippage === 2 ? custom : ''}
                    />
                    <div>{custom && maxSlippage === 2 ? '%' : ''}</div>
                </div>
            </div>
        </div>
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
