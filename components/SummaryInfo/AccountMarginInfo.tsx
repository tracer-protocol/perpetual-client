import React from 'react';
import { calcMinimumMargin, calcWithdrawable, toApproxCurrency, calcLiquidationPrice, calcLeverage, totalMargin } from '@libs/utils';
import { Section } from './';
import { UserBalance } from '@components/types';

interface IProps {
    balance: UserBalance | undefined;
    fairPrice: number;
    maxLeverage: number;
}

export const AccountMarginInfo: React.FC<IProps> = ({ balance, fairPrice, maxLeverage }: IProps) => {
    const { quote, base, totalLeveragedValue } = balance ?? {
        quote: 0, base: 0, totalLeveragedValue: 0
    };

    const minMargin = calcMinimumMargin(base, quote, fairPrice, maxLeverage);
    const totalMargin_ = totalMargin(base, quote, fairPrice);
    const invalid = minMargin > totalMargin_ ? 'text-red-500' : ''
    if (!balance) {
        return <div>Loading</div>;
    } else {
        return (
            <div className="border-t-2 border-gray-100">
                <Section label={'Account Margin'} classes={`text-sm ${invalid}`}>
                    {toApproxCurrency(totalMargin(base, quote, fairPrice))}
                </Section>
                <Section label={'Minimum Margin'} classes={`text-sm ${invalid}`}>
                    {toApproxCurrency(calcMinimumMargin(base, quote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Withdrawable'} classes={'text-sm'}>
                    {toApproxCurrency(calcWithdrawable(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={'LiquidationPrice'} classes={'text-sm'}>
                    {toApproxCurrency(calcLiquidationPrice(base, quote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Leverage'} classes={'text-sm'}>
                    {calcLeverage(base, quote, fairPrice)}
                </Section>
                <Section label={'Borrowed'} classes={'text-sm'}>
                    {toApproxCurrency(totalLeveragedValue)}
                </Section>
            </div>
        );
    }
};
