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
import { Section } from '@components/General';
import { UserBalance } from 'types';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';

interface IProps {
    balance: UserBalance;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
}

export const PositionDetails: React.FC<IProps> = ({ balance, fairPrice, maxLeverage }: IProps) => {
    const { base, quote, totalLeveragedValue } = balance;
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
                <Section label={'Positions'}>{base.toNumber()}</Section>
            </div>
            <div className="w-1/2 p-3">
                <Section label={'Notional Value'}>{toApproxCurrency(calcNotionalValue(base, fairPrice))}</Section>
                <Section label={'Leverage Multiplier'}>{l.gt(1) ? `${l.toNumber()}` : '0'}</Section>
                <Section label={'Borrowed Amount'}>{toApproxCurrency(totalLeveragedValue)}</Section>
            </div>
        </div>
    );
};

interface PTDProps {
    balances: UserBalance;
    position: number;
    exposure: BigNumber;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
    className?: string;
}
export const PostTradeDetails: React.FC<PTDProps> = styled(
    ({ balances, position, exposure, fairPrice, maxLeverage, className }: PTDProps) => {
        const newBase =
            position === 0
                ? balances.base.minus(exposure) // short
                : balances.base .plus(exposure); // long
        const newQuote =
            position === 0
                ? balances.quote.plus(calcNotionalValue(exposure, fairPrice)) // short
                : balances.quote.minus(calcNotionalValue(exposure, fairPrice)); // long
        return (
            <div className={className}>
                <h3>Order Summary</h3>
                <Section label={'Liquidation Price'}>
                    {toApproxCurrency(calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage))}
                    {`  -->  `}
                    {toApproxCurrency(calcLiquidationPrice(newQuote, newBase, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Borrowed'}>
                    {toApproxCurrency(calcBorrowed(balances.base, balances.quote, fairPrice))}
                    {`  -->  `}
                    {toApproxCurrency(calcBorrowed(newBase, newQuote, fairPrice))}
                </Section>
                <Section label={'Withdrawable'}>
                    {toApproxCurrency(calcWithdrawable(balances.base, balances.quote, fairPrice, maxLeverage))}
                    {`  -->  `}
                    {toApproxCurrency(calcWithdrawable(newBase, newQuote, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Leverage'}>
                    {calcLeverage(balances.base, balances.quote, fairPrice).toNumber()}
                    {`  -->  `}
                    {calcLeverage(newBase, newQuote, fairPrice).toNumber()}
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
