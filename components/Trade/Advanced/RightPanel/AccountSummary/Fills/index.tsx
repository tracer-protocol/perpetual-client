import React, { memo } from 'react';
import { FilledOrder } from '@libs/types/OrderTypes';
import { TData, TRow } from '@components/General/Table/AccountTable';
import { timeAgo, toApproxCurrency } from '@libs/utils';
import { STable } from '@components/Trade/Advanced/RightPanel/AccountSummary';

const FillsTab: React.FC<{
    filledOrders: FilledOrder[];
}> = memo(({ filledOrders }) => {
    filledOrders.sort((order1, order2) => (order1.timestamp < order2.timestamp && 1) || -1);
    return (
        <STable headings={['Time', 'Side', 'Price', 'Amount']}>
            <tbody>
                {filledOrders.map((order, index) => {
                    return (
                        <TRow key={`filled-order-${index}`}>
                            <TData>{timeAgo(Date.now(), parseInt(order.timestamp) * 1000)}</TData>
                            <TData className={!!order.position ? 'ask' : 'bid'}>
                                {!!order.position ? 'Short' : 'Long'}
                            </TData>
                            <TData>{toApproxCurrency(order.price)}</TData>
                            <TData>{parseFloat(order.amount.toFixed(2))}</TData>
                        </TRow>
                    );
                })}
            </tbody>
        </STable>
    );
});
FillsTab.displayName = 'Fills';

export default FillsTab;
