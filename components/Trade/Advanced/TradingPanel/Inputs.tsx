import React from 'react';
import { OrderContext } from 'context';
import { useContext } from 'react';
import SmallInput from '@components/Input/SmallInput';
import { calcWithdrawable } from '@components/libs/utils';
import { Tracer } from '@components/libs';
interface ISProps {
    selectedTracer: Tracer | undefined;
    amount: number;
    price: number;
}

export const Inputs: React.FC<ISProps> = ({ selectedTracer, amount, price }: ISProps) => {
    const { orderDispatch } = useContext(OrderContext);
    const tracerId = selectedTracer?.marketId ?? '';
    const balances = selectedTracer?.balances;
    const fairPrice = (selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0);
    const maxMargin = calcWithdrawable(
        balances?.base ?? 0,
        balances?.quote ?? 0,
        fairPrice,
        selectedTracer?.maxLeverage ?? 1,
    );
    return (
        <div className="flex flex-wrap text-white">
            <div className="w-full p-3">
                <SmallInput
                    title={'Amount'}
                    onChange={(e) =>
                        orderDispatch
                            ? orderDispatch({ type: 'setRMargin', value: parseFloat(e.target.value) })
                            : console.error('No dispatch function set')
                    }
                    setMax={(e) => {
                        e.preventDefault();
                        orderDispatch
                            ? orderDispatch({ type: 'setRMargin', value: maxMargin })
                            : console.error('No dispatch function set');
                    }}
                    unit={tracerId.split('/')[0]}
                    amount={amount}
                />
            </div>
            <div className="w-full p-3">
                <SmallInput
                    title={'Price'}
                    onChange={(e) =>
                        orderDispatch
                            ? orderDispatch({ type: 'setPrice', value: parseFloat(e.target.value) })
                            : console.error('No dispatch function set')
                    }
                    unit={tracerId.split('/')[1]}
                    amount={price}
                />
            </div>
        </div>
    );
};

export default Inputs;
