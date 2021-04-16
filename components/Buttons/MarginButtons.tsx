import React, { useContext, useState } from 'react';
import { TracerContext, AccountContext } from 'context';
import TracerModal, { ModalContent } from '@components/Modals';
import { Section } from '@components/SummaryInfo';
import { Children } from 'types';
import { TransactionContext } from '@components/context/TransactionContext';

type ButtonType = 'Deposit' | 'Withdraw';

export type ButtonVariant = 'button' | 'secondary-button';

type BProps = {
    type: ButtonType;
    variant?: ButtonVariant;
} & Children;

export const MarginButton: React.FC<BProps> = ({ variant, type, children }: BProps) => {
    const [showModal, setShowModal] = useState(false);
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const balance = type === 'Deposit' ? selectedTracer?.balances?.tokenBalance : selectedTracer?.balances?.base;
    const { deposit, withdraw } = useContext(AccountContext);
    const { handleTransaction } = useContext(TransactionContext);

    const submit = async (amount: number) => {
        const t = type.toLowerCase();
        withdraw && deposit && handleTransaction
            ? handleTransaction(t === 'withdraw' ? withdraw : deposit, [amount])
            : console.error(
                  `Failed to ${
                      t === 'withdraw' ? 'withdraw from' : 'deposit into'
                  } insurance pool: No ${t} function found`,
              );
        setShowModal(false);
    };

    return (
        <>
            <TracerModal
                loading={false}
                show={showModal}
                onClose={() => setShowModal(false)}
                title={type}
                subTitle={`${type === 'Deposit' ? `Deposit into` : `Withdraw from`} your ${tracerId} margin account`}
            >
                <ModalContent submit={submit} type={type} balance={balance ?? 0}>
                    {children}
                </ModalContent>
            </TracerModal>
            <div className="min-w-1/2 flex" onClick={() => setShowModal(true)}>
                <button className={`w-3/4 m-auto ${variant ? variant : 'button'}`}>{type}</button>
            </div>
        </>
    );
};

export const MarginDeposit: React.FC<{ variant?: ButtonVariant }> = ({ variant }: { variant?: ButtonVariant }) => {
    return (
        <MarginButton variant={variant} type="Deposit">
            <div>
                <h3 className="mt-10 text-left text-blue-100 text-lg">Margin Deposit Summary</h3>
                <div>
                    <Section label={`My Shares`}>24 USDC {'->'} 30 USDC</Section>
                    <Section label={`Anticipated rewards`}>X% {'->'} X%</Section>
                </div>
            </div>
        </MarginButton>
    );
};

export const MarginButtons: React.FC = () => {
    return (
        <div className="mt-auto flex w-full">
            <MarginDeposit />
            <MarginButton type="Withdraw">
                <div>
                    <h3 className="mt-10 text-left text-blue-100 text-lg">Margin Deposit Summary</h3>
                    <div>
                        <Section label={`My Shares`}>24 USDC {'->'} 30 USDC</Section>
                        <Section label={`Anticipated rewards`}>X% {'->'} X%</Section>
                    </div>
                </div>
            </MarginButton>
        </div>
    );
};
