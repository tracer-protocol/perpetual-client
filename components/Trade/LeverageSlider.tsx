import React, { useContext, useEffect } from 'react';
import Slider from 'antd/lib/slider';
import { OrderContext } from 'context';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';

const LeverageTip = (
    <p>
        <strong>Increase Exposure</strong> allows you to finance your investment through a combination of borrowed funds
        and margin. Increasing leverage will increase your exposure to ETH, at a risk.{' '}
        <a className="underline">Learn more</a>.
    </p>
);

interface DSProps {
    leverage: number;
    className?: string;
}

/**
 * Basic slider with no styling
 * @param leverage
 */
export const DefaultSlider: React.FC<DSProps> = styled(({ leverage, className }: DSProps) => {
    const { orderDispatch } = useContext(OrderContext); // TODO update to generic onChange

    useEffect(() => {
        const handle = document.getElementsByClassName('ant-slider-handle')[0];
        const value = document.createElement('p');
        value.setAttribute('type', 'number');
        value.setAttribute('id', 'slider-value');
        value.classList.add('slider-value');
        value.innerHTML = '1x';
        handle.appendChild(value);
    }, []);

    const marks = {
        1: '1x',
        50: '50x',
        100: '100x',
    };
    return (
        <>
            <Slider
                max={100}
                min={1}
                marks={marks}
                defaultValue={0}
                step={1}
                className={className}
                tooltipVisible={false}
                trackStyle={{ backgroundColor: '#3da8f5' }}
                handleStyle={{
                    width: '60px',
                    height: '36px',
                    background: '#3DA8F5',
                    borderRadius: '20px',
                    marginTop: '-18px',
                    display: 'flex',
                }}
                onChange={(num: number) => {
                    orderDispatch
                        ? orderDispatch({ type: 'setLeverage', value: num })
                        : console.error('Dispatch undefined');
                    const val = document.getElementById('slider-value');
                    if (val) {
                        val.innerHTML = `${num} x`;
                    }
                }}
                value={leverage}
            />
        </>
    );
})`
    * > .ant-slider {
        color: #3da8f5;
    }

    * > .ant-slider-dot {
        display: none;
    }

    * > .ant-slider-dot-active {
        border-color: #3da8f5;
    }

    .ant-slider-mark {
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #005ea4;
        margin-top: 18px;
    }

    * > .ant-slider-mark-text {
        color: #005ea4;
    }

    .ant-slider-step {
        width: 104%;
        height: 10px;
        margin-top: -5px;
        margin-left: -10px;
        background: #002886;
        border-radius: 10px;
    }

    .slider-value {
        margin: auto;
        color: #fff;
        font-size: 16px;
        letter-spacing: -0.32px;
    }
`;

/**
 * Wrapped slider with different sizing
 * @param className custom classes
 */
interface LSProps {
    className?: string;
    leverage: number;
}

const LeverageSlider: React.FC<LSProps> = styled(({ className, leverage }: LSProps) => {
    return (
        <div className={className}>
            <h3>
                <Tooltip title={LeverageTip}>Increase Exposure</Tooltip>
            </h3>
            <div className="w-full m-auto py-5 px-1">
                <DefaultSlider leverage={leverage ?? 1} />
            </div>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;

    h3 {
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
    }
`;

export default LeverageSlider;
