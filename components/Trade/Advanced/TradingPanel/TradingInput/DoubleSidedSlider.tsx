import React, { useMemo } from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { calcLeverage } from '@tracer-protocol/tracer-utils';
import { OrderAction } from '@context/OrderContext';
import { UserBalance } from 'types';
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
                type: 'setAdjustLeverage',
                value: num,
            });
        };

        useMemo(() => {
            if (!balances?.base.eq(0)) {
                const leverage = calcLeverage(balances.quote, balances.base, fairPrice);
                console.info('Setting leverage', leverage.toNumber());
                orderDispatch({
                    type: 'setAdjustLeverage',
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
    margin-bottom: 5rem;
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
`;

const markStyle = {
    marginTop: '0.5rem',
    color: '#005EA4',
    fontSize: '1rem',
};
const createMarks = (min: number, max: number) => ({
    [min]: {
        style: markStyle,
        label: <Label val={min} long={false} />,
    },
    [0]: {
        style: markStyle,
        label: `${0}x`,
    },
    [max]: {
        style: markStyle,
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
    background: 'var(--color-primary)',
    borderRadius: '20px',
    marginTop: '-11px',
};

const { Handle } = Slider;
const CustomHandle = (e: any) => {
    const HandleValue = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: var(--font-size-small);
        z-index: 2;
    `;
    const { value } = e;
    return (
        <Handle {...e}>
            <HandleValue>{Math.abs(value)}x</HandleValue>
        </Handle>
    );
};
