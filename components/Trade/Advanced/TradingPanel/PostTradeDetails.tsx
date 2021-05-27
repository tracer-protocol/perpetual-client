import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import {
    calcBorrowed,
    calcLeverage,
    calcLiquidationPrice,
    calcWithdrawable,
    calcNotionalValue,
} from '@tracer-protocol/tracer-utils';
import { Previous, Section } from '@components/General';
import { UserBalance } from 'types';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';

interface PTDProps {
    balances: UserBalance;
    position: number;
    exposure: BigNumber;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
    className?: string;
}
const PostTradeDetails: React.FC<PTDProps> = styled(
    ({ balances, position, exposure, fairPrice, maxLeverage, className }: PTDProps) => {
        const newBase =
            position === 0
                ? balances.base.minus(exposure) // short
                : balances.base.plus(exposure); // long
        const newQuote =
            position === 0
                ? balances.quote.plus(calcNotionalValue(exposure, fairPrice)) // short
                : balances.quote.minus(calcNotionalValue(exposure, fairPrice)); // long
        return (
            <div className={className}>
                <h3>Order Summary</h3>
                <Section label={'Liquidation Price'}>
                    <Previous>
                        {toApproxCurrency(calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage))}
                    </Previous>
                    {toApproxCurrency(calcLiquidationPrice(newQuote, newBase, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Borrowed'}>
                    <Previous>{toApproxCurrency(calcBorrowed(balances.quote, balances.base, fairPrice))}</Previous>
                    {toApproxCurrency(calcBorrowed(newQuote, newBase, fairPrice))}
                </Section>
                <Section label={'Withdrawable'}>
                    <Previous>
                        {toApproxCurrency(calcWithdrawable(balances.quote, balances.base, fairPrice, maxLeverage))}
                    </Previous>
                    {toApproxCurrency(calcWithdrawable(newQuote, newBase, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Leverage'}>
                    <Previous>{calcLeverage(balances.quote, balances.base, fairPrice).toPrecision(3)}</Previous>
                    {calcLeverage(newQuote, newBase, fairPrice).toPrecision(3)}
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

export default PostTradeDetails;
