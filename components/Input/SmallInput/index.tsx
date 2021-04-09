import React, { ChangeEvent } from 'react';
import { Children } from '@components/types';

type SIProps = {
    amount: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    unit: string;
    title: string;
} & Children;

const SmallInput: React.FC<SIProps> = ({ title, amount, onChange, unit }) => (
    <div className="border-b-2 flex border-gray-100 text-blue-100">
        <a className="text-blue-100">{title}</a>
        <input
            className="w-full appearance-none inline max-w-full text-black focus:border-none focus:outline-none focus:shadow-none text-md text-right"
            id="margin"
            type="number"
            placeholder="0.0"
            onChange={onChange}
            value={amount > 0 ? amount : ''}
        />
        <a className="px-1 opacity-25">{unit}</a>
    </div>
);

export default SmallInput;
