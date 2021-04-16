import React, { useContext } from 'react';
import Slider from 'antd/lib/slider';
import { OrderContext } from '../../context';

/**
 * Basic slider with no styling
 * @param leverage
 */
export const DefaultSlider: React.FC<DSProps> = ({ leverage }: DSProps) => {
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
                tooltipVisible={false}
                trackStyle={{ backgroundColor: '#0000bd' }}
                handleStyle={{ borderColor: '#0000bd' }}
                onChange={(num: number) =>
                    orderDispatch
                        ? orderDispatch({ type: 'setLeverage', value: num })
                        : console.error('Dispatch undefined')
                }
                value={leverage}
            />
            <style>{`
            .ant-slider-dot-active {
                border-color: #0000bd;
            }
        `}</style>
        </>
    );
};

/**
 * Wrapped slider with different sizing
 * @param className custom classes
 */
const LeverageSlider: React.FC<{ className?: string, leverage: number }> = ({ 
    className, leverage 
}) => {
    return (
        <div className={'flex flex-col px-5 ' + className}>
            <div className="mr-auto px-3 text-blue-100 font-bold">LEVERAGE</div>
            <div className="w-full m-auto py-5 px-5">
                <DefaultSlider leverage={leverage ?? 1} />
            </div>
        </div>
    );
};

interface DSProps {
    leverage: number;
}

export default LeverageSlider;
