import React, { useContext, useState } from 'react';
import { AdvancedOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import { DefaultSlider } from '@components/Trade/LeverageSlider';
import { FactoryContext, OrderContext, TracerContext } from 'context';
import InputSelects from './Inputs';
import { Tracer } from 'libs';
import { Box, Button, Close, DateAndTime, Logo } from '@components/General';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { defaults } from '@libs/Tracer';
import PostTradeDetails from './PostTradeDetails';
import BigNumber from 'bignumber.js';
import { calcMinimumMargin, calcTotalMargin } from '@tracer-protocol/tracer-utils';
import { toApproxCurrency } from '@libs/utils';
import Error from '@components/Trade/Error';
import { UserBalance } from '@types/TracerTypes';
import { Table, TData, TRow } from '@components/General/Table';
import {
    getStatusColour,
    SecondaryCell,
    StatusIndicator,
    TableCell,
    TableHead,
    TableHeadEnd,
    TableRow,
} from '@components/Portfolio';

const Market = styled.div`
    letter-spacing: -0.4px;
    font-size: 20px;
    color: #fff;
    display: flex;
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

const SLogo = styled(Logo)`
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0.7rem;
`;

type PProps = {
    className?: string;
    close: () => any;
    display: boolean;
};

const Popup: React.FC<PProps> = styled(({ className }: PProps) => {
    const tracers = [
        {
            name: 'ETH',
            market: 'ETH',
            price: 3424.23,
            change: '0.03%',
            interest: '453.33 ETH',
        },
        {
            name: 'ETH',
            market: 'ETH',
            price: 3424.23,
            change: '0.03%',
            interest: '453.33 ETH',
        },
        {
            name: 'ETH',
            market: 'ETH',
            price: 3424.23,
            change: '0.03%',
            interest: '453.33 ETH',
        },
    ];

    const headings = ['', 'CURRENT PRICE', '24H CHANGE', 'OPEN INTEREST'];

    const tableHeadTheme = {
        borderRight: 'none',
        borderBottom: 'none',
    };

    const tableCellTheme = {
        borderRight: 'none',
        borderBottom: 'none',
    };

    return (
        <div className={className}>
            <table>
                <thead>
                    {headings.map((heading, i) => (
                        <TableHead key={`table-head-${i}`} theme={tableHeadTheme}>
                            {heading}
                        </TableHead>
                    ))}
                </thead>
                <tbody>
                    {tracers.map((tracer, i) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell theme={tableCellTheme}>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo className="w-full" ticker={tracer.name} />
                                    </div>
                                    <div className="my-auto ml-2">{tracer.market}</div>
                                </div>
                            </TableCell>
                            <TableCell theme={tableCellTheme}>{toApproxCurrency(tracer.price)}</TableCell>
                            <TableCell theme={tableCellTheme}>{tracer.change}</TableCell>
                            <TableCell theme={tableCellTheme}>{tracer.interest}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
        </div>
    );
})`
    transition: 0.3s;
    position: absolute;
    padding: 10px;
    top: 100%;
    left: 0;
    width: 100%;
    background: #011772;
    z-index: ${(props) => (props.display ? '10' : '-1')};
    opacity: ${(props) => (props.display ? '1' : '0')};
    height: ${(props) => (props.display ? '35vh' : '0')};

    .header {
        color: #fff;
        font-size: 1.2rem;
        display: flex;
        justify-content: space-between;
    }
`;

export const MarketSelect: React.FC = () => {
    const [popup, setPopup] = useState(false);
    const handleClick = (popup: boolean) => {
        setPopup(popup);
    };
    // const { tracers } = useContext(FactoryContext);
    // const { setTracerId, tracerId } = useContext(TracerContext);
    // const marketsList = (
    //     <Menu
    //         onClick={({ key }) =>
    //             setTracerId ? setTracerId(key as string) : console.error('Set tracer id function not set')
    //         }
    //     >
    //         {Object.keys(tracers ?? {})?.map((marketId) => {
    //             return <Menu.Item key={marketId}>{marketId}</Menu.Item>;
    //         })}
    //     </Menu>
    // );
    return (
        <Box className="relative">
            <Market>
                <SLogo ticker="ETH" />
                {/*{tracerId}*/}
            </Market>
            {popup ? (
                <Close className="ml-auto mr-2" onClick={() => setPopup(false)} />
            ) : (
                <Button className="ml-auto mr-2 px-3" onClick={(_e: any) => handleClick(true)}>
                    View markets
                </Button>
            )}
            <Popup display={popup} close={() => setPopup(false)} />
        </Box>
    );
};

type TIProps = {
    selectedTracer: Tracer | undefined;
    account: string;
    className?: string;
};

export const TradingInput: React.FC<TIProps> = styled(({ selectedTracer, className }: TIProps) => {
    const { order } = useContext(OrderContext);
    return (
        <Box className={`${className}`}>
            <div className="body text-xs">
                {/* Position select */}
                <div className="py-2">
                    <OrderTypeSelect selected={order?.orderType ?? 0} />
                </div>

                {/* Position select */}
                <div className="py-2">
                    <PositionSelect selected={order?.position ?? 0} />
                </div>

                {/* Quantity and Price Inputs */}
                <InputSelects amount={order?.amountToPay} price={order?.price} selectedTracer={selectedTracer} />

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
                    fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                    balances={selectedTracer?.balances ?? defaults.balances}
                    exposure={order?.amountToBuy ? new BigNumber(order.amountToBuy) : defaults.amountToBuy}
                    position={order?.position ?? 0}
                    maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                />

                {/* Place Order */}
                <div className="py-1">
                    <AdvancedOrderButton />
                </div>
            </div>
        </Box>
    );
})`
    transition: 0.8s;
    overflow: scroll;
    opacity: ${(props) => (props.account === '' ? 0 : 1)};
`;

type SProps = {
    selected: number;
};

const SSlideSelect = styled(SlideSelect)`
    height: 40px;
`;

const PositionSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SSlideSelect
            onClick={(index, _e) => {
                // when we go back to market order we need to ensure the price is locked
                if (orderDispatch) {
                    orderDispatch({ type: 'setPosition', value: index });
                } else {
                    console.error('Order dispatch function not set');
                }
            }}
            value={selected}
        >
            <Option>SHORT</Option>
            <Option>LONG</Option>
        </SSlideSelect>
    );
};

const OrderTypeSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SSlideSelect
            onClick={(index, _e) => {
                if (orderDispatch) {
                    orderDispatch({ type: 'setOrderType', value: index });
                    if (index === 0) {
                        orderDispatch({ type: 'setLock', value: true });
                    }
                } else {
                    console.error('Order dispatch function not set');
                }
            }}
            value={selected}
        >
            <Option>MARKET</Option>
            <Option>LIMIT</Option>
        </SSlideSelect>
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

export { AccountPanel } from './Account';
