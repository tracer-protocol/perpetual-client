import React, { useContext, useEffect, useState } from 'react';
import { TracerContext, AccountContext } from 'context';
import TracerModal from '@components/Modals';
import { Section } from '@components/SummaryInfo';
import { Children } from 'types';
import { TransactionContext } from '@components/context/TransactionContext';
import NumberSelect from '../Input/NumberSelect';
import { Button } from '.';
import { calcBorrowed, calcLeverage, calcLiquidationPrice, calcMinimumMargin, calcWithdrawable, toApproxCurrency, totalMargin } from '@components/libs/utils';

type ButtonType = 'Deposit' | 'Withdraw';

export type ButtonVariant = 'button' | 'secondary-button';

type BProps = {
    type: ButtonType;
    variant?: ButtonVariant;
} & Children;

export const MarginButton: React.FC<BProps> = ({ variant, type }: BProps) => {
    const [showModal, setShowModal] = useState(false);
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const { quote, base, tokenBalance } = selectedTracer?.balances ?? {
        quote: 0, base: 0, tokenBalance: 0
    };
    const fairPrice = (selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0)
    const maxLeverage = selectedTracer?.maxLeverage ?? 1;
    const balance = type === 'Deposit' ? tokenBalance : calcWithdrawable(quote, base, fairPrice, maxLeverage);

    const { deposit, withdraw } = useContext(AccountContext);
    const { handleTransaction } = useContext(TransactionContext);

    const [valid, setValid] = useState(true);
    const [amount, setAmount] = useState(0);

    // add or subtract amount from the base
    const newBase = base + ((type === 'Deposit' ? 1 : -1) * (Number.isNaN(amount) ? 0 : amount))
    useEffect(() => {
        setValid(amount > 0 && amount <= ( balance ?? 0));
    }, [balance, amount]);

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
                <div>
                    <div className="p-6 flex-auto">
                        <NumberSelect
                            unit={tracerId?.split('/')[1] ?? 'NO_ID'}
                            title={'Amount'}
                            amount={amount}
                            balance={balance}
                            setAmount={setAmount}
                        />
                        <div>
                            <h3 className="mt-10 text-left text-blue-100 text-lg">Margin {type} Summary</h3>
                            <div>
                                <Section label={`Account Margin`} 
                                    classes={calcMinimumMargin(base, quote, fairPrice, maxLeverage) > totalMargin(newBase, quote, fairPrice) ? 'text-red-500' : ''}
                                >
                                    {toApproxCurrency(totalMargin(quote, base, fairPrice))}
                                    {'  ->  '} 
                                    {toApproxCurrency(totalMargin(quote, newBase, fairPrice))}
                                </Section>
                                <Section label={`Liquidation Price`}>
                                    {toApproxCurrency(calcLiquidationPrice(base, quote, fairPrice, maxLeverage))}
                                    {'  ->  '}
                                    {toApproxCurrency(calcLiquidationPrice(newBase, quote, fairPrice, maxLeverage))}
                                </Section>
                                <Section label={`Leverage`}>
                                    {calcLeverage(base, quote, fairPrice).toFixed(3)} 
                                    {'  ->  '} 
                                    {calcLeverage(newBase, quote, fairPrice).toFixed(3)} 
                                </Section>
                                <Section label={`Borrowed`}>
                                    {toApproxCurrency(calcBorrowed(base, quote, fairPrice))}
                                    {'  ->  '}
                                    {toApproxCurrency(calcBorrowed(newBase, quote, fairPrice))}
                                </Section>
                            </div>
                        </div>
                        <div className="flex items-center justify-center p-6 rounded-b">
                            <Button disabled={!valid} onClick={() => submit(amount)}>
                                {type}
                            </Button>
                        </div>
                    </div>
                </div>
            </TracerModal>
            <div className="min-w-1/2 flex" onClick={() => setShowModal(true)}>
                <button className={`w-3/4 m-auto ${variant ? variant : 'button'}`}>{type}</button>
            </div>
        </>
    );
};


/**
 *  This is seperated such that it can be used from the deposit page with the Button variant passed in
 */
export const MarginDeposit: React.FC<{ variant?: ButtonVariant }> = ({ variant }: { variant?: ButtonVariant }) => {
    return (
        <MarginButton variant={variant} type="Deposit">
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
