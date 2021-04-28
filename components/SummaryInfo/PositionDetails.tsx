import React from 'react';
import {
    toApproxCurrency,
    calcLiquidationPrice,
    calcLeverage,
    calcNotionalValue,
    calcProfitableLiquidationPrice,
    calcBorrowed,
    calcWithdrawable,
} from '@libs/utils';
import { Section } from './';
import { UserBalance } from '@components/types';
import styled from 'styled-components';

interface IProps {
    balance: UserBalance | undefined;
    fairPrice: number;
    maxLeverage: number;
}

export const PositionDetails: React.FC<IProps> = ({ balance, fairPrice, maxLeverage }: IProps) => {
    const { quote, base, totalLeveragedValue } = balance ?? {
        quote: 0,
        base: 0,
        totalLeveragedValue: 0,
    };
    const l = calcLeverage(base, quote, fairPrice);
    return (
        <div className="flex">
            <div className="w-1/2 p-3">
                <Section label={'Eligible liquidation price (exc. gas)'}>
                    {toApproxCurrency(calcLiquidationPrice(base, quote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Likely Liquidation Price (incl. gas)'}>
                    {toApproxCurrency(calcProfitableLiquidationPrice(base, quote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Positions'} classes={'text-sm'}>
                    {quote}
                </Section>
            </div>
            <div className="w-1/2 p-3">
                <Section label={'Notional Value'}>{toApproxCurrency(calcNotionalValue(quote, fairPrice))}</Section>
                <Section label={'Leverage Multiplier'}>{l > 1 ? `${l}` : '0'}</Section>
                <Section label={'Borrowed Amount'}>{toApproxCurrency(totalLeveragedValue)}</Section>
            </div>
        </div>
    );
};

interface PTDProps {
    balances: UserBalance;
    position: number;
    exposure: number;
    fairPrice: number;
    maxLeverage: number;
    className?: string;
}
export const PostTradeDetails: React.FC<PTDProps> = styled(
    ({ balances, position, exposure, fairPrice, maxLeverage, className }: PTDProps) => {
        const newQuote =
            position === 0
                ? balances.quote - (exposure ?? 0) // short
                : balances.quote + (exposure ?? 0); // long
        const newBase =
            position === 0
                ? balances.base + calcNotionalValue(exposure ?? 0, fairPrice) // short
                : balances.base - calcNotionalValue(exposure ?? 0, fairPrice); // long
        return (
            <div className={className}>
                <h3>Order Summary</h3>
                <Section label={'Liquidation Price'}>
                    {toApproxCurrency(calcLiquidationPrice(balances.base, balances.quote, fairPrice, maxLeverage ?? 1))}
                    {`  -->  `}
                    {toApproxCurrency(calcLiquidationPrice(newBase, newQuote, fairPrice, maxLeverage ?? 1))}
                </Section>
                <Section label={'Borrowed'}>
                    {toApproxCurrency(calcBorrowed(balances.quote, balances.base, fairPrice))}
                    {`  -->  `}
                    {toApproxCurrency(calcBorrowed(newQuote, newBase, fairPrice))}
                </Section>
                <Section label={'Withdrawable'}>
                    {toApproxCurrency(calcWithdrawable(balances.quote, balances.base, fairPrice, maxLeverage ?? 1))}
                    {`  -->  `}
                    {toApproxCurrency(calcWithdrawable(newQuote, newBase, fairPrice, maxLeverage ?? 1))}
                </Section>
                <Section label={'Leverage'}>
                    {calcLeverage(balances.quote, balances.base, fairPrice)}
                    {`  -->  `}
                    {calcLeverage(newQuote, newBase, fairPrice)}
                </Section>
            </div>
        );
    },
)`
    margin: 10px;
    background: #002886;
    border-radius: 10px;
    padding: 10px;

    h3 {
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #ffffff;
        margin-bottom: 20px;
    }
`;
