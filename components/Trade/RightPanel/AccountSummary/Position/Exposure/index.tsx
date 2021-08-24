import React from 'react';
import { OrderState } from '@context/OrderContext';
import { LIMIT } from '@libs/types/OrderTypes';
import { UserBalance } from '@libs/types';
import { BigNumber } from 'bignumber.js';
import { toApproxCurrency } from '@libs/utils';
import { Content, SPrevious } from '@components/Trade/RightPanel/AccountSummary/Position';

interface EProps {
    baseTicker: string;
    quoteTicker: string;
    order: OrderState;
    balances: UserBalance;
    fairPrice: BigNumber;
    currency: number;
}
const Exposure: React.FC<EProps> = ({ order, baseTicker, quoteTicker, fairPrice, balances, currency }: EProps) => {
    const { nextPosition, exposure, orderType, price } = order;
    if (balances.quote.eq(0)) {
        return <>-</>;
    } else if (exposure && price) {
        return (
            <Content className="pt-1">
                <SPrevious>
                    {currency === 0
                        ? `${parseFloat(balances.base.abs().toFixed(2))} ${baseTicker}`
                        : `${toApproxCurrency(
                              balances.base.abs().times(orderType === LIMIT ? price : fairPrice),
                          )} ${quoteTicker}`}
                </SPrevious>
                {currency === 0
                    ? `${parseFloat(nextPosition.base.abs().toFixed(2))} ${baseTicker}`
                    : `${toApproxCurrency(
                          nextPosition.base.abs().times(orderType === LIMIT ? price : fairPrice),
                      )} ${quoteTicker}`}
            </Content>
        );
    } else {
        return (
            <Content>
                {currency === 0
                    ? `${parseFloat(balances.base.abs().toFixed(2))} ${baseTicker}`
                    : `${toApproxCurrency(parseFloat(balances.base.abs().times(fairPrice).toFixed(2)))} ${quoteTicker}`}
            </Content>
        );
    }
};

export default Exposure;
