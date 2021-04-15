import React, { useContext, useState } from 'react';
import { TracerContext } from '@context/TracerContext';
import { InsuranceContext } from '@context/InsuranceContext';
import TracerModal, { ModalContent } from '@components/Modals';
import { Section } from '@components/SummaryInfo';
import { Children } from 'types';
import { TransactionContext } from '@components/context/TransactionContext';

type BProps = {
    type: 'Deposit' | 'Withdraw';
} & Children;

export const InsuranceButton: React.FC<BProps> = ({ type, children }: BProps) => {
    const { poolInfo, deposit, withdraw } = useContext(InsuranceContext);
    const [loading, setLoading] = useState(false);
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const tracerBalance = selectedTracer?.balances;
    const { handleTransaction } = useContext(TransactionContext);

    const [showModal, setShowModal] = useState(false);

    const balance = type === 'Deposit' ? tracerBalance?.tokenBalance : poolInfo?.userBalance;

    const submit = async (amount: number) => {
        try {
            setLoading(true);
            const callback = () => {
                setLoading(false);
            }
            const t = type.toLowerCase();
            withdraw && deposit && handleTransaction
                ? handleTransaction(t === 'withdraw' ? withdraw : deposit, [amount], callback)
                : console.error(`Failed to ${t} from insurance pool: No deposit function found`);
        } catch (err) {
            console.error(`Failed to deposit into insurance pool: ${err}`);
        }
    }

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
                <ModalContent submit={submit} type={type} balance={balance ?? 0}>
                    {children}
                </ModalContent>
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
                <div className="">
                    <h3 className="mt-10 text-left text-blue-100 text-lg">Insurance pool deposit summary</h3>
                    <div>
                        <Section label={`My Shares`}>24 USDC {'->'} 30 USDC</Section>
                        <Section label={`Anticipated rewards`}>X% {'->'} X%</Section>
                        <Section label={`Expiry`}>September 11 2020</Section>
                    </div>
                </div>
            </InsuranceButton>
            <InsuranceButton type="Withdraw">
                <div className="">
                    <h3 className="mt-10 text-left text-blue-100 text-lg">Insurance pool withdraw summary</h3>
                    <div>
                        <Section label={`My Shares`}>24 USDC {'->'} 30 USDC</Section>
                        <Section label={`Anticipated rewards`}>X% {'->'} X%</Section>
                    </div>
                </div>
            </InsuranceButton>
        </div>
    );
};
