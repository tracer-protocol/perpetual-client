import React, { useContext, useEffect, useState } from 'react';
import { TracerContext, AccountContext } from 'context';
import TracerModal from '@components/Modals';
import { Section } from '@components/General';
import { Children } from 'types';
import { TransactionContext } from '@context/TransactionContext';
import NumberSelect from '../General/Input/NumberSelect';
import { Button } from '.';
import {
    calcBorrowed,
    calcLeverage,
    calcLiquidationPrice,
    calcWithdrawable,
    calcTotalMargin,
} from '@tracer-protocol/tracer-utils';

import { toApproxCurrency } from 'libs/utils';
import { defaults } from '@libs/Tracer';

type ButtonType = 'Deposit' | 'Withdraw';

export type ButtonVariant = 'button' | 'secondary-button';

type BProps = {
    type: ButtonType;
} & Children;

export const MarginButton: React.FC<BProps> = ({ type, children }: BProps) => {
    const [showModal, setShowModal] = useState(false);
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const { base, quote, tokenBalance } = selectedTracer?.balances ?? defaults.balances;
    const fairPrice = selectedTracer?.oraclePrice ?? defaults.oraclePrice;
    const maxLeverage = selectedTracer?.maxLeverage ?? defaults.maxLeverage;
    const balance = type === 'Deposit' ? tokenBalance : calcWithdrawable(quote, base, fairPrice, maxLeverage);

    const { deposit, withdraw } = useContext(AccountContext);
    const { handleTransaction } = useContext(TransactionContext);

    const [valid, setValid] = useState(true);
    const [amount, setAmount] = useState(0);

    // add or subtract amount from the quote
    const newQuote = quote + (type === 'Deposit' ? 1 : -1) * (Number.isNaN(amount) ? 0 : amount);
    useEffect(() => {
        setValid(amount > 0 && amount <= (balance ?? 0));
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
                                <Section label={`Account Margin`}>
                                    {toApproxCurrency(calcTotalMargin(base, quote, fairPrice))}
                                    {'  ->  '}
                                    {toApproxCurrency(calcTotalMargin(base, newQuote, fairPrice))}
                                </Section>
                                <Section label={`Liquidation Price`}>
                                    {toApproxCurrency(calcLiquidationPrice(quote, base, fairPrice, maxLeverage))}
                                    {'  ->  '}
                                    {toApproxCurrency(calcLiquidationPrice(newQuote, base, fairPrice, maxLeverage))}
                                </Section>
                                <Section label={`Leverage`}>
                                    {`${calcLeverage(quote, base, fairPrice)}`}
                                    {'  ->  '}
                                    {`${calcLeverage(quote, base, fairPrice)}`}
                                </Section>
                                <Section label={`Borrowed`}>
                                    {toApproxCurrency(calcBorrowed(quote, base, fairPrice))}
                                    {'  ->  '}
                                    {toApproxCurrency(calcBorrowed(newQuote, base, fairPrice))}
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
            <div onClick={() => setShowModal(true)}>{children}</div>
        </>
    );
};

/**
 *  This is seperated such that it can be used from the deposit page with the Button variant passed in
 */
export const MarginDeposit: React.FC = () => {
    return <MarginButton type="Deposit"></MarginButton>;
};

export const MarginButtons: React.FC = () => {
    return (
        <div className="mt-auto flex w-full">
            <MarginDeposit />

            <MarginButton type="Withdraw" />
        </div>
    );
};
