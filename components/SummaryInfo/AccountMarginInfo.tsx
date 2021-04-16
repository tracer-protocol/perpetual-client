import React from 'react';
import { calcMinimumMargin, calcWithdrawable, toApproxCurrency, calcLiquidationPrice, calcLeverage } from '@libs/utils';
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
    if (!balance) {
        return <div>Loading</div>;
    } else {
        return (
            <div className="border-t-2 border-gray-100">
                <Section label={'Available Margin'} fontSize={'text-sm'}>
                    {toApproxCurrency(base)}
                </Section>
                <Section label={'Withdrawable'} fontSize={'text-sm'}>
                    {toApproxCurrency(calcWithdrawable(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Minimum Margin'} fontSize={'text-sm'}>
                    {toApproxCurrency(calcMinimumMargin(base, quote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'LiquidationPrice'} fontSize={'text-sm'}>
                    {toApproxCurrency(calcLiquidationPrice(base, quote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Leverage'} fontSize={'text-sm'}>
                    {toApproxCurrency(calcLeverage(base, quote, fairPrice))}
                </Section>
                <Section label={'Borrowed'} fontSize={'text-sm'}>
                    {toApproxCurrency(totalLeveragedValue)}
                </Section>
            </div>
        );
    }
};
