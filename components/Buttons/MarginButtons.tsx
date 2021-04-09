import React, { useContext, useState } from 'react';
import { TracerContext, AccountContext } from 'context';
import TracerModal, { ModalContent } from '@components/Modals';
import { Section } from '@components/SummaryInfo';
import { Children, TracerInfo } from 'types';

type ButtonType = 'Deposit' | 'Withdraw';

export type ButtonVariant = 'button' | 'secondary-button';

type BProps = {
    type: ButtonType;
    variant?: ButtonVariant;
} & Children;

export const MarginButton: React.FC<BProps> = ({ variant, type, children }: BProps) => {
    const { tracerInfo } = useContext(TracerContext);
    const { balance: tracerBalance, baseTokenBalance } = tracerInfo as TracerInfo;
    const [showModal, setShowModal] = useState(false);
    const balance = type === 'Deposit' ? baseTokenBalance : tracerBalance?.margin;
    const { tracerId } = useContext(TracerContext);

    const { deposit, withdraw } = useContext(AccountContext);

    const submit = (amount: number) => {
        if (type.toLowerCase() === 'withdraw') {
            withdraw ? withdraw(amount) : console.error('Withdraw function not set');
        } else {
            deposit ? deposit(amount) : console.error('Deposit function not set');
        }
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
