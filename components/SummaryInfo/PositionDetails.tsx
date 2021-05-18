import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import {
    calcBorrowed,
    calcLeverage,
    calcLiquidationPrice,
    calcWithdrawable,
    calcProfitableLiquidationPrice,
    calcNotionalValue,
} from '@tracer-protocol/tracer-utils';
import { Section } from './';
import { UserBalance } from '@components/types';
import styled from 'styled-components';

interface IProps {
    balance: UserBalance | undefined;
    fairPrice: number;
    maxLeverage: number;
}

export const PositionDetails: React.FC<IProps> = ({ balance, fairPrice, maxLeverage }: IProps) => {
    const { base, quote, totalLeveragedValue } = balance ?? {
        base: 0,
        quote: 0,
        totalLeveragedValue: 0,
    };
    const l = calcLeverage(quote, base, fairPrice);
    return (
        <div className="flex">
            <div className="w-1/2 p-3">
                <Section label={'Eligible liquidation price (exc. gas)'}>
                    {toApproxCurrency(calcLiquidationPrice(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Likely Liquidation Price (incl. gas)'}>
                    {toApproxCurrency(calcProfitableLiquidationPrice(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Positions'}>{base}</Section>
            </div>
            <div className="w-1/2 p-3">
                <Section label={'Notional Value'}>{toApproxCurrency(calcNotionalValue(base, fairPrice))}</Section>
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
        const newBase =
            position === 0
                ? balances.base - (exposure ?? 0) // short
                : balances.base + (exposure ?? 0); // long
        const newQuote =
            position === 0
                ? balances.quote + calcNotionalValue(exposure ?? 0, fairPrice) // short
                : balances.quote - calcNotionalValue(exposure ?? 0, fairPrice); // long
        return (
            <div className={className}>
                <h3>Order Summary</h3>
                <Section label={'Liquidation Price'}>
                    {toApproxCurrency(calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage ?? 1))}
                    {`  -->  `}
                    {toApproxCurrency(calcLiquidationPrice(newQuote, newBase, fairPrice, maxLeverage ?? 1))}
                </Section>
                <Section label={'Borrowed'}>
                    {toApproxCurrency(calcBorrowed(balances.base, balances.quote, fairPrice))}
                    {`  -->  `}
                    {toApproxCurrency(calcBorrowed(newBase, newQuote, fairPrice))}
                </Section>
                <Section label={'Withdrawable'}>
                    {toApproxCurrency(calcWithdrawable(balances.base, balances.quote, fairPrice, maxLeverage ?? 1))}
                    {`  -->  `}
                    {toApproxCurrency(calcWithdrawable(newBase, newQuote, fairPrice, maxLeverage ?? 1))}
                </Section>
                <Section label={'Leverage'}>
                    {calcLeverage(balances.base, balances.quote, fairPrice)}
                    {`  -->  `}
                    {calcLeverage(newBase, newQuote, fairPrice)}
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
