import React, { useContext } from 'react';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import { DownOutlined } from '@ant-design/icons';
import { OrderContext, TracerContext } from '../../context';
import { OrderState } from '@context/OrderContext';

import { useMarketPairs } from '../../hooks';
import { MarginDeposit } from '../Buttons';

export const WalletBalance: React.FC<{ marginBalance: number }> = ({ marginBalance }: { marginBalance: number }) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <div className="px-3 text-blue-100 font-normal flex">
            <p className="mt-auto mb-auto">
                {marginBalance < 0 ? `Fetching balance...` : `Acc. Margin Balance: ${marginBalance}`}
            </p>
            <span className="mt-auto mb-auto ml-auto w-full flex justify-end">
                {marginBalance <= 0 ? (
                    <MarginDeposit />
                ) : (
                    // max rMargin will be walletBalance - 10%
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            orderDispatch
                                ? orderDispatch({ type: 'setRMargin', value: marginBalance })
                                : console.error('Order dispatch not set');
                        }}
                        className="secondary-button"
                    >
                        Max
                    </button>
                )}
            </span>
        </div>
    );
};

type TSProps = {
    className?: string;
    inputSize?: string;
};

const TracerSelect: React.FC<TSProps> = ({ className, inputSize }: TSProps) => {
    const { exposure, tradePrice, order, orderDispatch } = useContext(OrderContext);
    const { selectedTracer } = useContext(TracerContext);
    const { rMargin, market, collateral, price } = order as OrderState;
    const marketPairs = useMarketPairs();

    const collaterals = (
        <Menu
            onClick={({ key }) =>
                orderDispatch
                    ? orderDispatch({ type: 'setCollateral', value: key.toString() })
                    : console.error('Order dispatch undefined')
            }
        >
            {Object.keys(marketPairs)?.map((option) => {
                return <Menu.Item key={option}>{option}</Menu.Item>;
            })}
        </Menu>
    );
    const markets = (
        <Menu
            onClick={({ key }) =>
                orderDispatch
                    ? orderDispatch({ type: 'setMarket', value: key.toString() })
                    : console.error('Order dispatch undefined')
            }
        >
            {marketPairs[collateral]?.map((option) => {
                return <Menu.Item key={option}>{option}</Menu.Item>;
            })}
        </Menu>
    );

    //get market address -> using tracer factory helper function
    //pass in address and initialise Tracer -> get all open orders of the address
    const selectContainer = 'w-full p-3 mr-5 flex';
    const title = 'w-full p-3 flex text-blue-100 font-bold';
    return (
        <div className={'flex ' + className}>
            {/* MARGIN DEPOSIT */}
            <div className="w-1/2 flex flex-col">
                <div className={title}>MARGIN USE</div>
                <div className={selectContainer}>
                    <input
                        className={
                            'appearance-none border-b-2 border-gray-100 w-full py-2 text-black leading-tight focus:border-none focus:outline-none focus:shadow-none ' +
                            inputSize
                        }
                        id="username"
                        type="number"
                        placeholder="0.0"
                        onChange={(e) => {
                            e.preventDefault();
                            orderDispatch
                                ? orderDispatch({ type: 'setRMargin', value: parseFloat(e.target.value) })
                                : console.error('Order dispatch not set');
                        }}
                        value={rMargin > 0 ? rMargin : ''}
                    />

                    <Dropdown overlay={collaterals} trigger={['click']}>
                        <a className="border-b-2 border-gray-100 mt-auto flex text-gray-200">
                            {collateral} <DownOutlined className="m-auto px-2" />
                        </a>
                    </Dropdown>
                </div>
                <WalletBalance marginBalance={selectedTracer?.balances.base ?? 0} />
            </div>

            {/* MARKET EXPOSURE */}
            <div className="w-1/2 flex flex-col">
                <div className={title}>MARKET EXPOSURE</div>
                <div className={selectContainer}>
                    <div
                        className={
                            'appearance-none border-b-2 border-gray-100 w-full py-2 text-gray-100 leading-tight focus:border-none focus:outline-none focus:shadow-none ' +
                            inputSize
                        }
                    >
                        {exposure ? exposure : '0.0'}
                    </div>
                    <Dropdown overlay={markets} trigger={['click']}>
                        <a className="border-b-2 border-gray-100 mt-auto flex text-gray-200">
                            {market} <DownOutlined className="m-auto px-2" />
                        </a>
                    </Dropdown>
                </div>
                <div className="px-3 flex h-full">
                    <p className="mb-auto mt-auto">
                        {tradePrice ? `Trade Price: ${tradePrice}` : `Market Price: ${price}`}{' '}
                        {`${market}/${collateral}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TracerSelect;
