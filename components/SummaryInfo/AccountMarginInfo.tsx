import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import {
    calcLeverage,
    calcLiquidationPrice,
    calcWithdrawable,
    calcTotalMargin,
    calcMinimumMargin,
} from '@tracer-protocol/tracer-utils';
import { Section } from '@components/General';
import { UserBalance } from 'types';
import { defaults } from '@libs/Tracer';
import { BigNumber } from 'bignumber.js';

interface IProps {
    balance: UserBalance | undefined;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
}

export const AccountMarginInfo: React.FC<IProps> = ({ balance, fairPrice, maxLeverage }: IProps) => {
    const { base, quote, totalLeveragedValue } = balance ?? defaults.balances;

    // const minMargin = calcMinimumMargin(quote, base, fairPrice, maxLeverage);
    // const calcTotalMargin_ = calcTotalMargin(quote, base, fairPrice);
    // const invalid = minMargin > calcTotalMargin_ ? 'text-red-500' : '';
    if (!balance) {
        return <div>Loading</div>;
    } else {
        return (
            <div className="border-t-2 border-gray-100">
                <Section label={'Account Margin'}>{toApproxCurrency(calcTotalMargin(quote, quote, fairPrice))}</Section>
                <Section label={'Minimum Margin'}>
                    {toApproxCurrency(calcMinimumMargin(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Withdrawable'}>
                    {toApproxCurrency(calcWithdrawable(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={'LiquidationPrice'}>
                    {toApproxCurrency(calcLiquidationPrice(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Leverage'}>{`${calcLeverage(quote, base, fairPrice)}`}</Section>
                <Section label={'Borrowed'}>{toApproxCurrency(totalLeveragedValue)}</Section>
            </div>
        );
    }
};
