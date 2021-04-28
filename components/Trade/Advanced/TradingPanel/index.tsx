import React, { useContext } from 'react';
import { AdvancedOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import { DefaultSlider } from '@components/Trade/LeverageSlider';
import { PostTradeDetails } from '@components/SummaryInfo/PositionDetails';
import { FactoryContext, OrderContext, TracerContext } from 'context';
import InputSelects from './Inputs';
import { Tracer } from 'libs';
import { Box, Button } from '@components/General';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import { DownOutlined } from '@ant-design/icons';

import styled from 'styled-components';
import { calcMinimumMargin, toApproxCurrency, totalMargin } from '@components/libs/utils';
import { MarginButton } from '@components/components/Buttons/MarginButtons';

const Market = styled.div`
    letter-spacing: -0.4px;
    font-size: 20px;
    color: #fff;
`;

const Selector = styled.div`
    border-radius: 10px;
    border: 1px solid #3da8f5;
    color: #3da8f5;

    &:hover {
        cursor: pointer;
    }

    a {
        padding-left: 10px;
    }
`;

export const MarketSelect: React.FC = () => {
    const { tracers } = useContext(FactoryContext);
    const { setTracerId, tracerId } = useContext(TracerContext);
    const marketsList = (
        <Menu
            onClick={({ key }) =>
                setTracerId ? setTracerId(key as string) : console.error('Set tracer id function not set')
            }
        >
            {Object.keys(tracers ?? {})?.map((marketId) => {
                return <Menu.Item key={marketId}>{marketId}</Menu.Item>;
            })}
        </Menu>
    );
    return (
        <Box>
            <Market>
                <img />
                {tracerId}
            </Market>
            <div className="ml-auto">
                <Dropdown overlay={marketsList} trigger={['click']}>
                    <Selector>
                        <a>View Markets</a> <DownOutlined className="m-auto px-2" />
                    </Selector>
                </Dropdown>
            </div>
        </Box>
    );
};

const Item = styled.div`
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;

    span {
        width: 100%;
        display: flex;
        font-size: 16px;
        letter-spacing: -0.32px;
    }
    > span a:nth-child(2) {
        margin-left: auto;
        color: #21dd53;
    }
    h3 {
        letter-spacing: -0.32px;
        color: #3da8f5;
        text-transform: capitalize;
        margin-bottom: 5px;
    }
`;

const DepositButtons = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const WalletConnect: React.FC<{
    selectedTracer: Tracer | undefined;
    account: string;
}> = ({ selectedTracer, account }) => {
    const balances = selectedTracer?.balances;
    const fairPrice = (selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0);
    const maxLeverage = selectedTracer?.maxLeverage ?? 1;

    return account === '' ? (
        <Box>
            <h4 className="title">Connect your Ethereum Wallet</h4>
            <div className="flex">
                <div className={`sButton`}>Connect</div>
            </div>
        </Box>
    ) : (
        <Box className="flex-col">
            <Item>
                <h3>Total Margin</h3>
                <span>
                    <a>{toApproxCurrency(totalMargin(balances?.quote ?? 0, balances?.base ?? 0, fairPrice))}</a>
                    {/* <a>
                        {'>>>'} $2,498.72 USDC
                    </a> */}
                </span>
            </Item>
            <Item>
                <h3>Minimum Margin</h3>
                <span>
                    <a>
                        {toApproxCurrency(
                            calcMinimumMargin(balances?.quote ?? 0, balances?.base ?? 0, fairPrice, maxLeverage),
                        )}
                    </a>
                    {/* <a>
                        {'>>>'} $2,498.72 USDC
                    </a> */}
                </span>
            </Item>
            <DepositButtons>
                <MarginButton type="Deposit">
                    <Button className="primary">Deposit</Button>
                </MarginButton>
                <MarginButton type="Withdraw">
                    <Button>Withdraw</Button>
                </MarginButton>
            </DepositButtons>
        </Box>
    );
};

export const TradingInput: React.FC<{ selectedTracer: Tracer | undefined }> = ({ selectedTracer }) => {
    const { order, exposure } = useContext(OrderContext);

    return (
        <Box className="overflow-scroll">
            <div className="body text-xs">
                {/* Position select */}
                <div className="py-2">
                    <OrderTypeSelect selected={order?.orderType ?? 0} />
                </div>

                {/* Position select */}
                <div className="py-2">
                    <PositionSelect selected={order?.position ?? 0} />
                </div>

                {/* Quanity and Price Inputs */}
                <InputSelects amount={order?.rMargin ?? 0} price={order?.price || 0} selectedTracer={selectedTracer} />

                {/* Dont display these if it is a limit order*/}
                {order?.orderType !== 1 ? (
                    <>
                        {/* Leverage select */}
                        <Leverage leverage={order?.leverage ?? 1} />
                    </>
                ) : (
                    <></>
                )}

                <PostTradeDetails
                    fairPrice={(selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0)}
                    balances={
                        selectedTracer?.balances ?? {
                            quote: 0,
                            base: 0,
                            totalLeveragedValue: 0,
                            lastUpdatedGasPrice: 0,
                            tokenBalance: 0,
                        }
                    }
                    exposure={exposure ?? 0}
                    position={order?.position ?? 0}
                    maxLeverage={selectedTracer?.maxLeverage ?? 1}
                />

                {/* Place Order */}
                <div className="py-1">
                    <AdvancedOrderButton balances={selectedTracer?.balances} />
                </div>
            </div>
        </Box>
    );
};

type SProps = {
    selected: number;
};

const PositionSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SlideSelect
            onClick={(index, _e) =>
                orderDispatch
                    ? orderDispatch({ type: 'setPosition', value: index })
                    : console.error('Order dispatch function not set')
            }
            value={selected}
        >
            <Option>SHORT</Option>
            <Option>LONG</Option>
        </SlideSelect>
    );
};

const OrderTypeSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SlideSelect
            onClick={(index, _e) =>
                orderDispatch
                    ? orderDispatch({ type: 'setOrderType', value: index })
                    : console.error('Order dispatch function not set')
            }
            value={selected}
        >
            <Option>MARKET</Option>
            <Option>LIMIT</Option>
        </SlideSelect>
    );
};

type LProps = {
    leverage: number;
    className?: string;
};

const Leverage: React.FC<LProps> = styled(({ leverage, className }: LProps) => {
    return (
        <div className={`${className} m-3`}>
            <a className="label">Leverage</a>
            <div className="w-3/4 p-2">
                <DefaultSlider leverage={leverage} />
            </div>
        </div>
    );
})`
    display: flex;
    > .label {
        margin: auto 0;
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
        margin-bottom: 35px; // this is because ant has a margin-bottom 28px on the slider
        margin-right: auto;
    }
`;
