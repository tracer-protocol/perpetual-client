import React, { useMemo } from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { calcLeverage } from '@tracer-protocol/tracer-utils';
import { OrderAction } from '@context/OrderContext';
import { UserBalance } from 'libs/types';
import BigNumber from 'bignumber.js';

const DEFAULT_MIN = -12.5;
const DEFAULT_MAX = 12.5;

type DSProps = {
    className?: string;
    value?: number;
    min?: number;
    max?: number;
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    fairPrice: BigNumber;
    balances: UserBalance;
};
export default styled(
    ({
        className,
        value,
        min,
        max,
        orderDispatch = () => console.error('Order dispatch not set'),
        fairPrice,
        balances,
    }: DSProps) => {
        const handleChange = (num: number) => {
            orderDispatch({
                type: 'setExposureFromLeverage',
                leverage: num,
            });
            orderDispatch({
                type: 'setLeverage',
                value: num,
            });
        };

        useMemo(() => {
            if (!balances?.base.eq(0)) {
                let leverage = calcLeverage(balances.quote, balances.base, fairPrice);
                if (balances?.base.lt(0)) {
                    leverage = leverage.negated();
                }
                console.info('Setting leverage', leverage.toNumber());
                orderDispatch({
                    type: 'setLeverage',
                    value: parseFloat(leverage.toNumber().toFixed(2)),
                });
            }
        }, [balances]);

        const min_ = min ?? DEFAULT_MIN;
        const max_ = max ?? DEFAULT_MAX;
        return (
            <div className={className}>
                <Slider
                    defaultValue={0}
                    value={value}
                    min={min_}
                    max={max_}
                    step={0.1}
                    marks={createMarks(min_, max_)}
                    railStyle={railStyle}
                    trackStyle={trackStyle}
                    handleStyle={handleStyle}
                    handle={CustomHandle}
                    onChange={handleChange}
                />
            </div>
        );
    },
)`
    margin-bottom: 3.5rem;
    position: relative;
    .rc-slider-dot {
        display: none;
    }
` as React.FC<DSProps>;

const Label = styled(({ className, val, long }: { className?: string; val: number; long: boolean }) => (
    <p className={className}>
        <span className={long ? 'green' : 'red'}>{long ? 'LONG' : 'SHORT'}</span> <br />
        {`${Math.abs(val)}x`}
    </p>
))`
    margin-left: ${(props) => (props.long ? '-3rem' : '3rem')};
    text-align: ${(props) => (props.long ? 'right' : 'left')};
    font-size: var(--font-size-small);
    line-height: var(--font-size-small);
    margin-top: 0.5rem;
    color: var(--color-secondary);
`;

const middleMark = {
    marginTop: 'calc(0.5rem + var(--font-size-small))',
    color: 'var(--color-secondary)',
    fontSize: 'var(--font-size-small)',
    lineHeight: 'var(--font-size-small',
};
const createMarks = (min: number, max: number) => ({
    [min]: {
        label: <Label val={min} long={false} />,
    },
    [0]: {
        style: middleMark,
        label: `${0}x`,
    },
    [max]: {
        label: <Label val={max} long={true} />,
    },
});

const railStyle = {
    backgroundImage: 'linear-gradient(to right, #F15025 , #05CB3A)',
    height: 10,
};
const trackStyle = {
    background: 'transparent',
    height: 10,
};

const handleStyle = {
    width: '50px',
    height: '30px',
    lineHeight: '26px',
    background: 'var(--color-primary)',
    borderRadius: '20px',
    marginTop: '-11px',
};

const { Handle } = Slider;
const HandleValue = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: var(--font-size-small);
    z-index: 2;
`;
const CustomHandle = (e: any) => {
    const { value } = e;
    return (
        <Handle {...e}>
            <HandleValue>{Math.abs(value)}x</HandleValue>
        </Handle>
    );
};
