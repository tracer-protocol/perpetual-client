import React from 'react';
import SmallInput from '@components/General/Input/SmallInput';
import { Tracer } from 'libs';
import { OrderAction } from '@context/OrderContext';
import { DefaultSlider } from '@components/Trade/LeverageSlider';
import styled from 'styled-components';

export const Exposure:React.FC<{
	orderDispatch: React.Dispatch<OrderAction> | undefined,
	selectedTracer: Tracer | undefined,
	exposure: number,
	className?: string,
}> = ({ selectedTracer, orderDispatch, exposure, className }) => {
    const tracerId = selectedTracer?.marketId ?? '';
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
				orderDispatch
					? orderDispatch({ type: 'setMaxExposure' })
					: console.error('No dispatch function set');
			}}
			unit={tracerId.split('/')[0]}
			amount={exposure}
		/>
	)
}

export const Price: React.FC<{
	orderDispatch: React.Dispatch<OrderAction> | undefined,
	selectedTracer: Tracer | undefined,
	price: number,
	className?: string,
}> = ({ selectedTracer, orderDispatch, price, className }) => {
    const tracerId = selectedTracer?.marketId ?? '';
	return (
		<SmallInput
			title={'Price'}
			className={className ?? ''}
			onChange={(e) => {
				if (orderDispatch) {
					orderDispatch({ type: 'setPrice', value: parseFloat(e.target.value) });
					orderDispatch({ type: 'setOrderType', value: 1 });
				} else {
					console.error('No dispatch function set');
				}
			}}
			unit={tracerId.split('/')[1]}
			amount={price}
		/>
	)
}

type LProps = {
    leverage: number;
    className?: string;
};

export const Leverage: React.FC<LProps> = styled(({ leverage, className }: LProps) => {
    return (
        <div className={`${className} m-3`}>
            <a className="label">Leverage</a>
            <div className="w-3/4 px-4 pb-4">
                <DefaultSlider leverage={leverage} />
            </div>
        </div>
    );
})`
    display: flex;

    > .label {
        margin: 5px auto 35px 0;
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
    }
`;