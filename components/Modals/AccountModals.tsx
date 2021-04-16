import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@components/Buttons';
import { NumberSelect } from '@components/Input/NumberSelect';
import { TracerContext } from 'context';
import { Children } from 'types';

type MCProps = {
    type: 'Deposit' | 'Withdraw';
    submit: (amount: number) => void;
    balance: number;
} & Children;

/**
 *
 * @param submit is the function handler called when the bottom modal button is clicked
 * @param type either "Deposit" or "Withdraw"
 * @param balance balance of the respective asset you are either trying to deposit or withdraw
 */
export const ModalContent: React.FC<MCProps> = ({ type, submit, balance, children }: MCProps) => {
    const [valid, setValid] = useState(true);
    const [amount, setAmount] = useState(0); // The amount within the input
    const { tracerId } = useContext(TracerContext);

    useEffect(() => {
        setValid(amount > 0 && amount <= balance);
    }, [balance, amount]);

    return (
        <div className="p-6 flex-auto">
            <NumberSelect
                unit={tracerId?.split('/')[1] ?? 'NO_ID'}
                title={'Amount'}
                amount={amount}
                balance={balance}
                setAmount={setAmount}
            />
            {children}
            <div className="flex items-center justify-center p-6 rounded-b">
                <Button disabled={!valid} onClick={() => submit(amount)}>
                    {type}
                </Button>
            </div>
        </div>
    );
};