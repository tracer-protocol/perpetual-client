import React from 'react';
import { Children } from 'types';

type NSProps = {
    amount: number;
    setAmount: (number: number) => void;
    unit: string;
    title: string;
    balance?: number;
} & Children;

export const NumberSelect: React.FC<NSProps> = ({ setAmount, amount, unit, title, balance }: NSProps) => {
    return (
        <div className="border-b-2 border-gray-100">
            <h3 className="text-left font-bold text-blue-100 flex">
                {title}
                {balance ? ( // if there is a balance then display it
                    <span className="text-blue-100 ml-auto font-normal">
                        {balance < 0 ? `---` : `Available Balance: ${balance}`}
                    </span>
                ) : (
                    ''
                )}
            </h3>
            <div className={'max-w-32 py-2 flex w-full'}>
                <div className="w-1/2">
                    <input
                        className="appearance-none text-left text-black max-w-full focus:border-none focus:outline-none focus:shadow-none text-5xl"
                        id="username"
                        type="number"
                        placeholder="0.0"
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        value={amount ? amount : ''}
                    />
                </div>
                <div className="ml-auto text-right flex flex-col">
                    <div className="mt-auto flex">
                        <div className="ml-auto flex">
                            {balance ? (
                                <button onClick={() => setAmount(balance)} className="secondary-button">
                                    Max
                                </button>
                            ) : (
                                ''
                            )}
                            <span className="text-lg mt-auto text-gray-200 px-3">{unit}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumberSelect;
