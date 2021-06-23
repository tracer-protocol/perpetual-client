import React, { useContext } from 'react';
import { OrderContext } from 'context';
import { orderDefaults } from '@context/OrderContext';
import Tracer, { defaults } from '@libs/Tracer';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { Box } from '@components/General';
import { AdvancedOrderButton } from '@components/Buttons';
import Error from '@components/General/Error';
import { toApproxCurrency } from '@libs/utils';
import { Approx } from '@components/General';
import { Exposure, Price, Leverage } from './Inputs';
import { MarketTradeDetails, LimitTradeDetails } from './PostTradeDetails';
import { OrderTypeSelect, PositionSelect } from './Selects';

const SError = styled(Error)<{ account: string }>`
    position: relative;
    transform: translateY(-100%);
    display: ${(props) => (props.account === '' ? 'none' : 'block')};
    &.show {
        transform: translateY(0);
    }
`;

const Details = styled.span`
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: #005ea4;
    text-align: right;
    width: 100%;
    padding: 0 12px;
`;

type TIProps = {
    selectedTracer: Tracer | undefined;
    account: string;
    className?: string;
};

export default styled(({ selectedTracer, className, account }: TIProps) => {
    const { order, orderDispatch } = useContext(OrderContext);
    const { exposure, price, leverage } = order ?? orderDefaults.order;
    return (
        <>
            <Box className={`${className} ${account === '' ? 'hide' : ''} `}>
                {/* Position select */}
                <OrderTypeSelect selected={order?.orderType ?? 0} />

                {/* Position select */}
                <div className="m-5">
                    <PositionSelect selected={order?.position ?? 0} />
                </div>

                {/* Quantity and Price Inputs */}
                <Exposure
                    orderDispatch={orderDispatch}
                    className="pb-0"
                    selectedTracer={selectedTracer}
                    order={order ?? orderDefaults.order}
                />
                <Details>
                    {order?.leverage !== 1 && exposure && price ? (
                        <span>{`Leveraged at ${order?.leverage}x`}</span>
                    ) : null}
                    {exposure && price ? <Approx>{toApproxCurrency(exposure * price * leverage)}</Approx> : null}
                </Details>

                {/*Dont display price select if it is a market order*/}
                {order?.orderType !== 1 ? (
                    <>
                        {/* LIMIT ORDER */}
                        <Price
                            orderDispatch={orderDispatch}
                            selectedTracer={selectedTracer}
                            price={order?.price ?? defaults.price}
                        />
                        <LimitTradeDetails
                            fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                            balances={selectedTracer?.getBalance() ?? defaults.balances}
                            exposure={order?.exposure ? new BigNumber(order.exposure) : defaults.exposure}
                            nextPosition={order?.nextPosition ?? defaults.balances}
                            orderPrice={order?.price ?? 0}
                            maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                        />
                    </>
                ) : (
                    <>
                        {/* MARKET ORDER */}
                        <Leverage
                            min={new BigNumber(1)}
                            max={selectedTracer?.getMaxLeverage()}
                            leverage={order?.leverage ?? 1}
                            orderDispatch={orderDispatch}
                        />
                        <MarketTradeDetails
                            fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                            balances={selectedTracer?.getBalance() ?? defaults.balances}
                            exposure={order?.exposure ? new BigNumber(order.exposure) : defaults.exposure}
                            nextPosition={order?.nextPosition ?? defaults.balances}
                            tradePrice={order?.marketTradePrice ?? orderDefaults.order.marketTradePrice}
                            slippage={order?.slippage ?? 0}
                            maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                        />
                    </>
                )}

                {/* Place Order */}
                <div className="p-2">
                    <AdvancedOrderButton>Place Order</AdvancedOrderButton>
                </div>
            </Box>
            <SError error={order?.error ?? 'NO_ERROR'} account={account} context={'orders'} />
        </>
    );
})`
    transition: opacity 0.3s 0.1s, height: 0.3s 0.1s, padding 0.1s;
    overflow: auto;
    position: relative;
    border-bottom: none;
    background: #00125D;
    display: block;
    padding: 0;
    height: 100%;
    z-index: 1;
    &.hide {
        height: 0;
        padding: 0;
        opacity: 0;
        border: none;
    }
` as React.FC<TIProps>;
