import React from 'react';
import { toApproxCurrency, calcLiquidationPrice, calcLeverage, calcNotionalValue, calcProfitableLiquidationPrice } from '@libs/utils';
import { Section } from './';
import { UserBalance } from '@components/types';

interface IProps {
    balance: UserBalance | undefined;
    fairPrice: number;
    maxLeverage: number;
}

export const PositionDetails: React.FC<IProps> = ({ balance, fairPrice, maxLeverage }: IProps) => {
    const { quote, base, totalLeveragedValue } = balance ?? {
        quote: 0, base: 0, totalLeveragedValue: 0
    };
    const l = calcLeverage(base, quote, fairPrice);
    if (!balance) {
        return <div>Loading</div>;
    } else {
        return (
            <div className="mx-2 my-4 bg-blue-300 rounded-lg p-2">
                <Section label={'Eligible Liquidation Price'} classes={'text-sm border-b-2 border-blue-200'}>
                    {toApproxCurrency(calcLiquidationPrice(base, quote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Rational Liquidation Price'} classes={'text-sm border-b-2 border-blue-200'}>
                    {toApproxCurrency(calcProfitableLiquidationPrice(base, quote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Positions'}classes={'text-sm border-b-2 border-blue-200'}>
                    {quote}
                </Section>
                <Section label={'Position Notional Value'}classes={'text-sm border-b-2 border-blue-200'}>
                    {toApproxCurrency(calcNotionalValue(quote, fairPrice))}
                </Section>
                <Section label={'Leverage Multiplier'}classes={'text-sm border-b-2 border-blue-200'}>
                    {l > 1 ? `${l}` : '0'}
                </Section>
                <Section label={'Borrowed Amount'}classes={'text-sm border-b-2 border-blue-200'}>
                    {toApproxCurrency(totalLeveragedValue)}
                </Section>
            </div>
        );
    }
};
