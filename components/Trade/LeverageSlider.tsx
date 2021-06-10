import React, { useEffect, useRef } from 'react';
import Slider from 'antd/lib/slider';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';

const LeverageTip = (
    <p>
        <strong>Increase Exposure</strong> allows you to finance your investment through a combination of borrowed funds
        and margin. Increasing leverage will increase your exposure to ETH, at a risk.{' '}
        <a className="underline">Learn more</a>.
    </p>
);

type SProps = {
    leverage: number;
    className?: string;
    onChange: (val: number) => any;
    id: string
}

/**
 * Basic slider with no styling
 * @param leverage
 */
export const DefaultSlider: React.FC<SProps> = styled(({ leverage, className, onChange, id }: SProps) => {
    const handleRef = useRef<HTMLParagraphElement>()
    useEffect(() => {
        const slider = document.getElementById(id);
        if (slider) {
            const handle = slider.getElementsByClassName('ant-slider-handle')[0];
            if (handle) {
                const value = document.createElement('p');
                handleRef.current = value;
                value.setAttribute('type', 'number');
                value.setAttribute('id', 'slider-value');
                value.classList.add('slider-value');
                value.innerHTML = '1x';
                handle.appendChild(value);
            }
        }
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
                    onChange(num);
                    if (handleRef.current) {
                        handleRef.current.innerHTML = `${num} x`;
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
        color: #005ea4;
        margin-top: 18px;
    }

    * > .ant-slider-mark-text {
        color: #005ea4;
    }

    .ant-slider-step {
        width: 106%;
        height: 10px;
        margin-top: -5px;
        margin-left: -2px;
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
 *  also allows for having multiple leverage sliders on the same page
 * @param className custom classes
 */

type LSProps = SProps
const LeverageSlider: React.FC<LSProps> = styled(({ 
    className, 
    leverage,
    onChange,
    id
}: SProps) => {
    return (
        <div className={className} id={id}>
            <h3>
                <Tooltip title={LeverageTip}>Increase Exposure</Tooltip>
            </h3>
            <div className="w-full m-auto py-5 pl-1 pr-4">
                <DefaultSlider id={id} className="slider" leverage={leverage ?? 1} onChange={onChange} />
            </div>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;

    .slider > .ant-slider-step {
        margin-left: -10px;
    }

    h3 {
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
    }
`;

export default LeverageSlider;
