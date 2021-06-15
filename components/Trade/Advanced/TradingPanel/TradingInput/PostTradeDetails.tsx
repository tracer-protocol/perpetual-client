import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import { calcLiquidationPrice, calcNotionalValue } from '@tracer-protocol/tracer-utils';
import { HiddenExpand, Previous, Section, Approx } from '@components/General';
import { UserBalance } from 'types';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';

interface PTDProps {
    balances: UserBalance;
    position: number;
    exposure: BigNumber;
    fairPrice: BigNumber;
    slippage: number;
    maxLeverage: BigNumber;
    className?: string;
}
const PostTradeDetails: React.FC<PTDProps> = styled(
    ({ balances, position, exposure, fairPrice, maxLeverage, slippage, className }: PTDProps) => {
        const newBase =
            position === 0
                ? balances.base.minus(exposure) // short
                : balances.base.plus(exposure); // long
        const newQuote =
            position === 0
                ? balances.quote.plus(calcNotionalValue(exposure, fairPrice)) // short
                : balances.quote.minus(calcNotionalValue(exposure, fairPrice)); // long
        return (
            <HiddenExpand open={!!exposure.toNumber()} defaultHeight={0} className={className}>
                <h3>Order Summary</h3>
                <Section label={'Liquidation Price'}>
                    <Previous>
                        {toApproxCurrency(calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage))}
                    </Previous>
                    {toApproxCurrency(calcLiquidationPrice(newQuote, newBase, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Last Price'}>{toApproxCurrency(0)}</Section>
                <Section label={'Slippage & Fees'}>
                    {slippage}% <Approx>$0.00</Approx>
                </Section>
            </HiddenExpand>
        );
    },
)`
    margin: 10px;
    background: #002886;
    border-radius: 10px;

    h3 {
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #ffffff;
        margin-bottom: 20px;
    }
`;

export default PostTradeDetails;
