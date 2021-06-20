import React, { useContext } from 'react';
import { OrderContext } from 'context';
import { orderDefaults } from '@context/OrderContext';
import Tracer, { defaults } from '@libs/Tracer';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { Box } from '@components/General';
import { AdvancedOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import PostTradeDetails from './PostTradeDetails';
import Error from '@components/General/Error';
import { toApproxCurrency } from '@libs/utils';
import { Approx } from '@components/General';
import { Exposure, Price, Leverage } from './Inputs';

type SProps = {
    selected: number;
    className?: string;
};

const SSlideSelect = styled(SlideSelect)`
    height: 32px;
    width: 70%;
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
            <Option>Long</Option>
            <Option>Short</Option>
        </SSlideSelect>
    );
};

const OrderTypeSelect: React.FC<SProps> = styled(({ selected, className }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SlideSelect
            className={className}
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
            <Option>Limit</Option>
            <Option>Market</Option>
        </SlideSelect>
    );
})`
    border-radius: 0;
    border-bottom: 1px solid #002886;
    border-top: 0;
    border-right: 0;
    border-left: 0;
    height: 50px;

    > .bg-slider {
        background: #002886;
        border-radius: 0;
    }
`;

const SError = styled(Error)<{ account: string }>`
    position: relative;
    transform: translateY(-100%);
    display: ${(props) => (props.account === '' ? 'none' : 'block')};
    &.show {
        transform: translateY(0);
    }
`;

const Details = styled.span`
    font-size: 16px;
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
                <div className="flex flex-wrap">
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
                    <Price
                        orderDispatch={orderDispatch}
                        selectedTracer={selectedTracer}
                        price={order?.price ?? defaults.price}
                    />
                </div>

                <Leverage
                    min={selectedTracer?.getBalance().leverage}
                    max={selectedTracer?.getMaxLeverage()}
                    leverage={order?.leverage ?? 1}
                    orderDispatch={orderDispatch}
                />

                <PostTradeDetails
                    fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                    balances={selectedTracer?.getBalance() ?? defaults.balances}
                    exposure={order?.exposure ? new BigNumber(order.exposure) : defaults.exposure}
                    nextPosition={order?.nextPosition ?? defaults.balances}
                    slippage={order?.slippage ?? 0}
                    maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                />

                {/* Place Order */}
                <div className="p-2">
                    <AdvancedOrderButton />
                </div>
            </Box>
            <SError error={order?.error ?? 'NO_ERROR'} account={account} />
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
