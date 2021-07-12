import React from 'react';
import { getPositionText } from '@libs/utils';
import { BigNumber } from 'bignumber.js';
import { UserBalance } from '@libs/types';
import { Content, SPrevious } from '@components/Trade/Advanced/RightPanel/AccountSummary/Position';

interface SProps {
    exposure: number;
    tradePrice: number;
    nextPosition: {
        base: BigNumber;
        quote: BigNumber;
    };
    balances: UserBalance;
}
const Side: React.FC<SProps> = ({ nextPosition, exposure, tradePrice, balances }: SProps) => {
    if (balances.quote.eq(0)) {
        return <>-</>;
    } else if (exposure && tradePrice) {
        return (
            <Content>
                <SPrevious>{getPositionText(balances.base)}</SPrevious>
                {getPositionText(nextPosition.base)}
            </Content>
        );
    } else {
        return <Content>{getPositionText(balances.base)}</Content>;
    }
};

export default Side;
