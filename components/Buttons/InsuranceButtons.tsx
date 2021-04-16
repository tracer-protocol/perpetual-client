import React, { useContext, useEffect, useState } from 'react';
import { TracerContext } from '@context/TracerContext';
import { InsuranceContext } from '@context/InsuranceContext';
import TracerModal from '@components/Modals';
import { Section } from '@components/SummaryInfo';
import { Children } from 'types';
import { TransactionContext } from '@components/context/TransactionContext';
import { Button } from '.';
import NumberSelect from '../Input/NumberSelect';
import { toApproxCurrency } from '@components/libs/utils';
import { calcInsurancePoolHealth } from '@components/libs/utils/InsuranceCalcs';

type BProps = {
    type: 'Deposit' | 'Withdraw';
} & Children;

export const InsuranceButton: React.FC<BProps> = ({ type }: BProps) => {
    const { poolInfo, deposit, withdraw } = useContext(InsuranceContext);
    const [loading, setLoading] = useState(false);
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const tracerBalance = selectedTracer?.balances;
    const { handleTransaction } = useContext(TransactionContext);

    const [showModal, setShowModal] = useState(false);

    const poolBalance = poolInfo?.userBalance ?? 0;
    const balance = type === 'Deposit' ? tracerBalance?.tokenBalance : poolBalance; 
    const [valid, setValid] = useState(true);
    const [amount, setAmount] = useState(0); // The amount within the input

    const amount_ = !Number.isNaN(amount) ? amount : 0
    const newBalance = type === 'Deposit' 
        ? poolBalance + amount_
        : poolBalance - amount_

    useEffect(() => {
        setValid(amount > 0 && amount <= (balance ?? 0));
    }, [balance, amount]);

    const submit = async (amount: number) => {
        try {
            setLoading(true);
            const callback = () => {
                setLoading(false);
            };
            const t = type.toLowerCase();
            withdraw && deposit && handleTransaction
                ? handleTransaction(t === 'withdraw' ? withdraw : deposit, [amount], callback)
                : console.error(`Failed to ${t} from insurance pool: No deposit function found`);
        } catch (err) {
            console.error(`Failed to deposit into insurance pool: ${err}`);
        }
    };

    return (
        <>
            <TracerModal
                loading={loading}
                show={showModal}
                onClose={() => setShowModal(false)}
                title={type === 'Deposit' ? 'Add Insurance' : 'Withdraw Insurance'}
                subTitle={
                    type === 'Deposit'
                        ? `Add insurance to the ${tracerId} insurance pool for a specified period of time.`
                        : `Withdraw from the ${tracerId} insurance pool`
                }
            >
                <div className="p-6 flex-auto">
                    <NumberSelect
                        unit={tracerId?.split('/')[1] ?? 'NO_ID'}
                        title={'Amount'}
                        amount={amount}
                        balance={balance}
                        setAmount={setAmount}
                    />
                    <div className="">
                        <h3 className="mt-10 text-left text-blue-100 text-lg">Insurance Pool {type} Summary</h3>
                        <div>
                            <Section label={`Your Share`}>
                                {`${toApproxCurrency(poolBalance)}`}
                                {'  ->  '}
                                {`${toApproxCurrency(newBalance)}`}
                            </Section>
                            <Section label={`Insurance Pool Health`}>
                                {`${calcInsurancePoolHealth(poolInfo?.target, poolInfo?.liquidity) * 100}%`}
                                {'  ->  '}
                                {`${(poolInfo?.target, (poolInfo?.liquidity ?? 0 - amount_)) * 100}%`}
                            </Section>
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-6 rounded-b">
                        <Button disabled={!valid} onClick={() => submit(amount)}>
                            {type}
                        </Button>
                    </div>
                </div>
            </TracerModal>
            <div className="min-w-1/2 flex" onClick={() => setShowModal(true)}>
                <button className={`w-3/4 m-auto button`}>{type}</button>
            </div>
        </>
    );
};

export const InsuranceButtons: React.FC = () => {
    return (
        <div className="mt-auto flex w-full">
            <InsuranceButton type="Deposit">
            </InsuranceButton>
            <InsuranceButton type="Withdraw">
                <div className="">
                    <h3 className="mt-10 text-left text-blue-100 text-lg">Insurance pool withdraw summary</h3>
                    <div>
                        <Section label={`My Shares`}>

                            {'  ->  '} 
                            30 USDC
                        </Section>
                        <Section label={`Anticipated rewards`}>X% {'->'} X%</Section>
                    </div>
                </div>
            </InsuranceButton>
        </div>
    );
};
