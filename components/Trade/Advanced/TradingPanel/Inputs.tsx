import React from 'react';
import { OrderContext } from 'context';
import { useContext } from 'react';
import SmallInput from '@components/Input/SmallInput';
interface ISProps {
    tracerId: string;
    amount: number;
    price: number;
}

export const Inputs: React.FC<ISProps> = ({ tracerId, amount, price }: ISProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <div className="flex flex-wrap">
            <div className="w-1/2 p-3">
                <SmallInput
                    title={'Amount'}
                    onChange={(e) =>
                        orderDispatch
                            ? orderDispatch({ type: 'setRMargin', value: parseFloat(e.target.value) })
                            : console.error('No dispatch function set')
                    }
                    unit={tracerId.split('/')[0]}
                    amount={amount > 0 ? amount : 0}
                />
            </div>
            <div className="w-1/2 p-3">
                <SmallInput
                    title={'Price'}
                    onChange={(e) =>
                        orderDispatch
                            ? orderDispatch({ type: 'setPrice', value: parseFloat(e.target.value) })
                            : console.error('No dispatch function set')
                    }
                    unit={tracerId.split('/')[1]}
                    amount={price > 0 ? price : 0}
                />
            </div>
        </div>
    );
};

export default Inputs;
