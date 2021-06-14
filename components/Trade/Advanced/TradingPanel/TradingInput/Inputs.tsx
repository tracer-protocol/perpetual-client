import React from 'react';
import SmallInput from '@components/General/Input/SmallInput';
import { Tracer } from 'libs';
import { OrderAction } from '@context/OrderContext';

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