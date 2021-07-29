import React, { memo, useContext } from 'react';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
import { TransactionContext } from '@context/TransactionContext';
import { cancelOrder } from '@libs/Ome';
import Web3 from 'web3';
import { TData, TRow } from '@components/General/Table/AccountTable';
import { calcStatus, toApproxCurrency } from '@libs/utils';
import { STable } from '@components/Trade/Advanced/RightPanel/AccountSummary';
import styled from 'styled-components';
import { Button } from '@components/General';

const OrdersTab: React.FC<{
    userOrders: OMEOrder[];
    baseTicker: string;
    refetch: () => void;
}> = memo(({ userOrders, baseTicker, refetch }) => {
    console.log(userOrders)
    
    const { handleAsync } = useContext(TransactionContext);
    const _cancelOrder = (market: string, orderId: string) => {
        console.info(`Attempting to cancel order: ${orderId} on market: ${market}`);
        handleAsync
            ? handleAsync(cancelOrder, [market, orderId], {
                  statusMessages: {
                      waiting: `Cancelling order: ${orderId} on market ${market} `,
                  },
                  onSuccess: () => refetch(),
              })
            : console.error('Failed to cancel order: Handle transaction not defined');
    };
    return (
        <STable headings={['Status', 'Side', 'Price', 'Amount', 'Filled', 'Remaining', '']}>
            <tbody>
                {userOrders?.map((order, index) => {
                    const amount = parseFloat(Web3.utils.fromWei(order?.amount?.toString() ?? '0')),
                        amountLeft = parseFloat(Web3.utils.fromWei(order?.amount_left?.toString() ?? '0')),
                        filled = amount - amountLeft;
                    return (
                        <TRow key={`open-order-${index}`}>
                            <TData>{calcStatus(filled)}</TData>
                            <TData className={order.side.toLowerCase() /** This will be the global .bid or .ask */}>
                                {order.side === 'Bid' ? 'Long' : 'Short'}
                            </TData>
                            <TData>{toApproxCurrency(parseFloat(Web3.utils.fromWei(order.price.toString())))}</TData>
                            <TData>
                                {parseFloat(amount.toFixed(2))} {baseTicker}
                            </TData>
                            <TData>
                                {parseFloat(filled.toFixed(2))} {baseTicker}
                            </TData>
                            <TData>
                                {parseFloat(amountLeft.toFixed(2))} {baseTicker}
                            </TData>
                            <TData>
                                <Cancel onClick={(_e) => _cancelOrder(order.target_tracer, order.id)}>Cancel</Cancel>
                            </TData>
                        </TRow>
                    );
                })}
            </tbody>
        </STable>
    );
});
OrdersTab.displayName = 'OpenOrders';

export default OrdersTab;

const Cancel = styled(Button)`
    height: 28px;
    opacity: 0.8;
    width: auto;
    padding: 0 5px;
    max-width: 80px;
    margin: auto;
    line-height: 25px;

    &:hover {
        opacity: 1;
    }
`;
