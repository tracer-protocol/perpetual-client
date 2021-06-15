import React, { useContext } from 'react';
import { OrderContext } from 'context';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { Box, Button } from '@components/General';
import { PlaceOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import Error from '@components/Trade/Error';
import { Closure, Leverage } from './Inputs';
import { OrderAction, OrderState } from '@context/OrderContext';
import PostTradeDetails from './PostTradeDetails';
import { BigNumber } from 'bignumber.js';

type SProps = {
    selected: number;
    setAdjustType: (index: number) => void;
    className?: string;
};

const AdjustTypeSelect: React.FC<SProps> = styled(({ selected, className, setAdjustType }: SProps) => {
    return (
        <SlideSelect
            className={className}
            onClick={(index, _e) => {
                setAdjustType(index);
            }}
            value={selected}
        >
            <Option>Adjust</Option>
            <Option>Close</Option>
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

type CProps = {
    selectedTracer: Tracer | undefined;
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    order: OrderState | undefined;
    className?: string;
};

const Close: React.FC<CProps> = ({ orderDispatch, selectedTracer, order }) => {
    return (
        <>
            <Closure
                orderDispatch={orderDispatch}
                selectedTracer={selectedTracer}
                exposure={order?.exposure ?? defaults.exposure}
            />
        </>
    );
};

type AProps = {
    selectedTracer: Tracer | undefined,
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    order: OrderState | undefined;
    className?: string;
};

const Adjust: React.FC<AProps> = ({ order, orderDispatch, selectedTracer }) => {
    return (
        <Leverage 
            min={selectedTracer?.getBalance().leverage}
            max={selectedTracer?.getMaxLeverage()}
            leverage={order?.leverage ?? 1} 
            orderDispatch={orderDispatch}
        />
    )
};

type TIProps = {
    selectedTracer: Tracer | undefined;
    account: string;
    className?: string;
};

export default styled(({ selectedTracer, className, account }: TIProps) => {
    // switching to Close Position changes their position to the opposite side through OrderContext
    const { order, orderDispatch } = useContext(OrderContext);
    return (
        <>
            <Box className={`${className} ${account === '' ? 'hide' : ''} `}>
                {/* Position select */}
                <AdjustTypeSelect
                    selected={order?.adjustType ?? 0}
                    setAdjustType={(index) => {
                        orderDispatch
                            ? orderDispatch({ type: 'setAdjustType', value: index })
                            : console.error('No dispatch function set');
                    }}
                />

                <div className="pt-3 pb-3">
                    {order?.adjustType !== 0 ? (
                        <Close orderDispatch={orderDispatch} selectedTracer={selectedTracer} order={order} />
                    ) : (
                        <Adjust orderDispatch={orderDispatch} order={order} selectedTracer={selectedTracer} />
                    )}
                </div>

                <PostTradeDetails
                    fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                    balances={selectedTracer?.getBalance() ?? defaults.balances}
                    exposure={order?.exposure ? new BigNumber(order.exposure) : defaults.exposure}
                    position={order?.position ?? 0}
                    slippage={order?.slippage ?? 0}
                    maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                />

                <PlaceOrderButton className="text-center">
                    <Button>{order?.adjustType === 0 ? 'Adjust Order' : 'Close Position'} </Button>
                </PlaceOrderButton>
            </Box>
            <SError error={order?.error ?? -1} account={account} />
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
    &.hide {
        height: 0;
        padding: 0;
        opacity: 0;
        border: none;
    }
` as React.FC<TIProps>;
