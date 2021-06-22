import React from 'react';
import SmallInput from '@components/General/Input/SmallInput';
import { Tracer } from 'libs';
import { LIMIT, OrderAction, OrderState } from '@context/OrderContext';
import DefaultSlider from '@components/General/Slider';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import TooltipSelector from '@components/Tooltips/TooltipSelector';

export const Exposure: React.FC<{
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    selectedTracer: Tracer | undefined;
    order: OrderState;
    closeInput?: boolean; // optional boolean if it is for closing defaults to false
    className?: string;
}> = ({ selectedTracer, orderDispatch, order, closeInput, className }) => {
    return (
        <>
            <SmallInput
                title={'Amount'}
                tooltip={{
                    key: 'amount',
                    props: {
                        baseTicker: selectedTracer?.baseTicker ?? '',
                    },
                }}
                className={className ?? ''}
                onChange={(e) => {
                    orderDispatch
                        ? orderDispatch({ type: 'setExposure', value: parseFloat(e.target.value) })
                        : console.error('No dispatch function set');
                }}
                setMax={(e) => {
                    e.preventDefault();
                    orderDispatch
                        ? orderDispatch({ type: closeInput ? 'setMaxClosure' : 'setMaxExposure' })
                        : console.error('No dispatch function set');
                }}
                unit={selectedTracer?.baseTicker ?? ''}
                amount={order.exposure}
            />
        </>
    );
};

export const Price: React.FC<{
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    selectedTracer: Tracer | undefined;
    price: number;
    className?: string;
}> = ({ selectedTracer, orderDispatch, price, className }) => {
    return (
        <>
            <SmallInput
                title={'Price'}
                tooltip={{
                    key: 'price',
                    props: {
                        baseTicker: selectedTracer?.baseTicker ?? '',
                    },
                }}
                className={className ?? ''}
                setMax={(e) => {
                    e.preventDefault();
                    orderDispatch ? orderDispatch({ type: 'setBestPrice' }) : console.error('No dispatch function set');
                }}
                maxText={'Best'}
                onChange={(e) => {
                    if (orderDispatch) {
                        orderDispatch({ type: 'setPrice', value: parseFloat(e.target.value) });
                        orderDispatch({ type: 'setOrderType', value: LIMIT });
                    } else {
                        console.error('No dispatch function set');
                    }
                }}
                unit={selectedTracer?.quoteTicker ?? ''}
                amount={price}
            />
        </>
    );
};

export const Closure: React.FC<{
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    selectedTracer: Tracer | undefined;
    exposure: number;
    className?: string;
}> = ({ selectedTracer, orderDispatch, exposure, className }) => {
    return (
        <SmallInput
            title={'Amount'}
            className={className ?? ''}
            onChange={(e) => {
                orderDispatch
                    ? orderDispatch({ type: 'setExposure', value: parseFloat(e.target.value) })
                    : console.error('No dispatch function set');
            }}
            setMax={(e) => {
                e.preventDefault();
                orderDispatch ? orderDispatch({ type: 'setMaxClosure' }) : console.error('No dispatch function set');
            }}
            unit={selectedTracer?.baseTicker ?? ''}
            amount={exposure}
        />
    );
};

type LProps = {
    leverage: number;
    className?: string;
    adjustLeverage?: boolean; // boolean to tell if it is the adjust order leverage slider
    min?: BigNumber;
    max?: BigNumber;
    orderDispatch: React.Dispatch<OrderAction> | undefined;
};

export const Leverage: React.FC<LProps> = styled(
    ({ leverage, orderDispatch, adjustLeverage, className, min, max }: LProps) => {
        return (
            <div className={`${className} m-3`}>
                <TooltipSelector tooltip={{ key: 'leverage' }}>Leverage</TooltipSelector>
                <div className="w-3/4 pl-4 pr-6 pb-4 mt-2">
                    <DefaultSlider
                        min={Math.ceil(min?.toNumber() ?? 1)}
                        max={max?.toNumber() ?? defaults.maxLeverage.toNumber()}
                        value={leverage}
                        handleChange={(num) => {
                            orderDispatch
                                ? orderDispatch({
                                      type: adjustLeverage ? 'setAdjustLeverage' : 'setLeverage',
                                      value: num,
                                  })
                                : console.error('Order dispatch not set');
                        }}
                    />
                </div>
            </div>
        );
    },
)`
    display: flex;

    > .label {
        margin: 5px auto 35px 0;
        font-size: var(--font-size-small);
        letter-spacing: -0.32px;
        color: var(--color-primary);
    }
`;
