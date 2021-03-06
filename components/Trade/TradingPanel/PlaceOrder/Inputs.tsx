import React, { FC, Dispatch } from 'react';
import SmallInput, { InputContainer } from '@components/General/Input/SmallInput';
import Tracer from '@libs/Tracer';
import { OrderAction, OrderState } from '@context/OrderContext';
import DefaultSlider from '@components/General/Slider';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import { Inc, Dec } from '@components/General/Input/NumberInput';
import { MARKET, LONG, SHORT } from '@libs/types/OrderTypes';

export const Exposure: FC<{
    orderDispatch: Dispatch<OrderAction> | undefined;
    selectedTracer: Tracer | undefined;
    order: OrderState;
    closeInput?: boolean; // optional boolean if it is for closing defaults to false
    className?: string;
}> = ({ selectedTracer, orderDispatch, order, className }) => {
    return (
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
                if (orderDispatch) {
                    orderDispatch({ type: 'setExposure', value: parseFloat(e.target.value) });
                    if (order.orderType === MARKET) {
                        orderDispatch({ type: 'setLeverageFromExposure', amount: parseFloat(e.target.value) });
                    }
                } else {
                    console.error('No dispatch function set');
                }
            }}
            unit={selectedTracer?.baseTicker ?? ''}
            amount={parseFloat(order.exposure.toFixed(8))}
        />
    );
};

export const Price: FC<{
    orderDispatch: Dispatch<OrderAction> | undefined;
    selectedTracer: Tracer | undefined;
    price: number;
    className?: string;
}> = ({ selectedTracer, orderDispatch, price, className }) => {
    return (
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
                orderDispatch ? orderDispatch({ type: 'setBestPrice' }) : console.error('Order dispatch not set');
            }}
            maxText={'Best'}
            onChange={(e) => {
                if (orderDispatch) {
                    orderDispatch({ type: 'setPrice', value: parseFloat(e.target.value) });
                } else {
                    console.error('Order dispatch not set');
                }
            }}
            unit={selectedTracer?.quoteTicker ?? ''}
            amount={price}
        />
    );
};

export const LeverageInput: FC<{
    orderDispatch: Dispatch<OrderAction> | undefined;
    position: typeof LONG | typeof SHORT;
    selectedTracer: Tracer | undefined;
    leverage: number;
    className?: string;
}> = ({ selectedTracer, orderDispatch, position, leverage, className }) => {
    return (
        <StyledSmallInput
            title={'Leverage'}
            tooltip={{ key: 'leverage' }}
            className={className ?? ''}
            onChange={(e) => {
                if (orderDispatch) {
                    const leverage = parseFloat(e.target.value) * (position === LONG ? 1 : -1);

                    if (Number.isNaN(leverage)) {
                        orderDispatch({ type: 'setLeverage', value: leverage });
                        orderDispatch({ type: 'setExposure', value: NaN });
                    } else if (
                        Math.abs(leverage) <= (selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage).toNumber()
                    ) {
                        orderDispatch({
                            type: 'setExposureFromLeverage',
                            leverage: leverage,
                        });
                        orderDispatch({ type: 'setLeverage', value: leverage });
                    }
                } else {
                    console.error('No dispatch function set');
                }
            }}
            amount={parseFloat(leverage.toFixed(1))}
        />
    );
};

type LProps = {
    leverage: number;
    className?: string;
    min?: BigNumber;
    max?: BigNumber;
    orderDispatch: Dispatch<OrderAction> | undefined;
};

export const Leverage: FC<LProps> = styled(({ orderDispatch, leverage, className, min, max }: LProps) => {
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
                                  type: 'setLeverage',
                                  value: num,
                              })
                            : console.error('Order dispatch not set');
                    }}
                />
            </div>
        </div>
    );
})`
    display: flex;

    > .label {
        margin: 5px auto 35px 0;
        font-size: var(--font-size-small);
        letter-spacing: var(--letter-spacing-small);
        color: var(--color-primary);
    }
`;

const StyledSmallInput = styled(SmallInput)`
    justify-content: flex-start;
    ${InputContainer} {
        margin-left: 1rem;
        width: 80px;
    }
    * ${Inc}, * ${Dec} {
        display: none;
    }

    > * input {
        text-align: center;
        padding-left: 0;
    }
`;
