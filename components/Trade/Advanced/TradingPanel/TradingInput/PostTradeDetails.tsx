import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import { calcLiquidationPrice } from '@tracer-protocol/tracer-utils';
import { HiddenExpand, Previous, Section } from '@components/General';
import { UserBalance } from 'types';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';

const SHiddenExpand = styled(HiddenExpand)`
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
interface MTDProps {
    balances: UserBalance;
    nextPosition: {
        quote: BigNumber;
        base: BigNumber;
    };
    exposure: BigNumber;
    fairPrice: BigNumber;
    slippage: number;
    maxLeverage: BigNumber;
    tradePrice: BigNumber;
    className?: string;
}
export const MarketTradeDetails: React.FC<MTDProps> = ({
    balances,
    nextPosition,
    exposure,
    fairPrice,
    maxLeverage,
    slippage,
    tradePrice,
    className,
}: MTDProps) => {
    return (
        <SHiddenExpand open={!!exposure.toNumber()} defaultHeight={0} className={className}>
            <h3>Order Summary</h3>
            <Section label={'Liquidation Price'}>
                <Previous>
                    {toApproxCurrency(calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage))}
                </Previous>
                {toApproxCurrency(calcLiquidationPrice(nextPosition.quote, nextPosition.base, fairPrice, maxLeverage))}
            </Section>
            <Section label={'Trade Price'}>{toApproxCurrency(tradePrice)}</Section>
            <Section label={'Slippage'}>{slippage.toFixed(3)}%</Section>
        </SHiddenExpand>
    );
};

interface LTDProps {
    balances: UserBalance;
    nextPosition: {
        quote: BigNumber;
        base: BigNumber;
    };
    exposure: BigNumber;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
    orderPrice: number;
    className?: string;
}
export const LimitTradeDetails: React.FC<LTDProps> = ({
    balances,
    nextPosition,
    exposure,
    fairPrice,
    maxLeverage,
    orderPrice,
    className,
}: LTDProps) => {
    return (
        <SHiddenExpand open={!!exposure.toNumber()} defaultHeight={0} className={className}>
            <h3>Order Summary</h3>
            <Section label={'Liquidation Price'}>
                <Previous>
                    {toApproxCurrency(calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage))}
                </Previous>
                {toApproxCurrency(calcLiquidationPrice(nextPosition.quote, nextPosition.base, fairPrice, maxLeverage))}
            </Section>
            <Section label={'Trade Price'}>{toApproxCurrency(orderPrice)}</Section>
        </SHiddenExpand>
    );
};

interface ASProps {
    balances: UserBalance;
    nextPosition: {
        quote: BigNumber;
        base: BigNumber;
    };
    exposure: BigNumber;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
    baseTicker: string;
    className?: string;
}
export const AdjustSummary: React.FC<ASProps> = ({
    balances,
    nextPosition,
    exposure,
    fairPrice,
    maxLeverage,
    baseTicker,
    className,
}: ASProps) => {
    return (
        <SHiddenExpand open={!!exposure.toNumber()} defaultHeight={0} className={className}>
            <h3>Order Adjust Summary</h3>
            <Section label={'Exposure'}>{`${exposure.toFixed(3)} ${baseTicker}`}</Section>
            <Section label={'Liquidation Price'}>
                <Previous>
                    {toApproxCurrency(calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage))}
                </Previous>
                {toApproxCurrency(calcLiquidationPrice(nextPosition.quote, nextPosition.base, fairPrice, maxLeverage))}
            </Section>
            <Section label={'Trade Price'}>{toApproxCurrency(fairPrice)}</Section>
        </SHiddenExpand>
    );
};
