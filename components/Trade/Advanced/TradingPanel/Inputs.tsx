import React from 'react';
import { OrderContext } from 'context';
import { useContext } from 'react';
import SmallInput from '@components/General/Input/SmallInput';
import { calcWithdrawable } from '@tracer-protocol/tracer-utils';
import { Tracer } from 'libs';
import { defaults } from '@libs/Tracer';
interface ISProps {
    selectedTracer: Tracer | undefined;
    amount: number | undefined;
    price: number | undefined;
}

export const Inputs: React.FC<ISProps> = ({ selectedTracer, amount, price }: ISProps) => {
    const { orderDispatch } = useContext(OrderContext);
    const tracerId = selectedTracer?.marketId ?? '';
    const balances = selectedTracer?.balances ?? defaults.balances;
    const fairPrice = selectedTracer?.oraclePrice ?? defaults.oraclePrice;
    const maxMargin = calcWithdrawable(
        balances.base,
        balances.quote,
        fairPrice,
        selectedTracer?.maxLeverage ?? defaults.maxLeverage,
    );
    return (
        <div className="flex flex-wrap text-white">
            <div className="w-full p-3">
                <SmallInput
                    title={'Amount'}
                    onChange={(e) => {
                        orderDispatch
                            ? orderDispatch({ type: 'setAmountToPay', value: parseFloat(e.target.value) })
                            : console.error('No dispatch function set');
                    }}
                    setMax={(e) => {
                        e.preventDefault();
                        orderDispatch
                            ? orderDispatch({ type: 'setAmountToPay', value: maxMargin.toNumber() })
                            : console.error('No dispatch function set');
                    }}
                    unit={tracerId.split('/')[0]}
                    amount={amount}
                />
            </div>
            <div className="w-full p-3">
                <SmallInput
                    title={'Price'}
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
            </div>
        </div>
    );
};

export default Inputs;
