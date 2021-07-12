import React from 'react';
import { BigNumber } from 'bignumber.js';
import { calcLeverage } from '@tracer-protocol/tracer-utils';
import { LIMIT } from '@context/OrderContext';
import { Content, SPrevious } from '@components/Trade/Advanced/RightPanel/AccountSummary/Position';
import { UserBalance } from '@libs/types';

interface LProps {
    exposure: number;
    tradePrice: number;
    nextPosition: {
        base: BigNumber;
        quote: BigNumber;
    };
    balances: UserBalance;
    orderType: number;
    fairPrice: BigNumber;
}
const Leverage: React.FC<LProps> = ({ nextPosition, exposure, tradePrice, orderType, fairPrice, balances }: LProps) => {
    const l = calcLeverage(balances.quote, balances.base, fairPrice);
    if (balances.quote.eq(0)) {
        return <>-</>;
    } else if (exposure && tradePrice) {
        return (
            <Content>
                <SPrevious>{`${l.toFixed(2)}x`}</SPrevious>
                {`${calcLeverage(
                    nextPosition.quote,
                    nextPosition.base,
                    orderType === LIMIT ? new BigNumber(tradePrice) : fairPrice,
                ).toFixed(2)}x`}
            </Content>
        );
    } else {
        return <Content>{`${l.toPrecision(3)}x`}</Content>;
    }
};

export default Leverage;
