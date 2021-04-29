import React, { useContext } from 'react';
import Slider from 'antd/lib/slider';
import { OrderContext } from 'context';
import styled from 'styled-components';

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

    const marks = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
    };
    return (
        <>
            <Slider
                max={10}
                min={1}
                marks={marks}
                defaultValue={0}
                step={1}
                className={className}
                tooltipVisible={false}
                trackStyle={{ backgroundColor: '#3DA8F5' }}
                handleStyle={{ borderColor: '#3DA8F5' }}
                onChange={(num: number) =>
                    orderDispatch
                        ? orderDispatch({ type: 'setLeverage', value: num })
                        : console.error('Dispatch undefined')
                }
                value={leverage}
            />
        </>
    );
})`
    * > .ant-slider {
        color: #3da8f5;
    }
    * > .ant-slider-dot-active {
        border-color: #3da8f5;
    }
    * > .ant-slider-mark-text {
        color: #3da8f5;
    }
`;

/**
 * Wrapped slider with different sizing
 * @param className custom classes
 */
interface LSProps {
    className?: string;
    leverage: number
}

const LeverageSlider: React.FC<LSProps> = styled(({ className, leverage }: LSProps) => {
    return (
        <div className={className}>
            <h3>Leverage</h3>
            <div className="w-full m-auto py-5 px-5">
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
        color: #3DA8F5;
    }
`
export default LeverageSlider;
