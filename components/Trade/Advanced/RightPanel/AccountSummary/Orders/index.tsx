import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
import { TransactionContext } from '@context/TransactionContext';
import { cancelOrder } from '@libs/Ome';
import Web3 from 'web3';
import { calcStatus, toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import { Button } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/Table';

const OrdersTab: React.FC<{
    userOrders: OMEOrder[];
    baseTicker: string;
    refetch: () => void;
    parentHeight: number;
}> = memo(({ userOrders, baseTicker, refetch, parentHeight }) => {
    const { web3, account } = useWeb3();
    const { handleAsync } = useContext(TransactionContext);

    const _cancelOrder = (market: string, orderId: string) => {
        console.debug(`Attempting to cancel order: ${orderId} on market: ${market}`);
        handleAsync
            ? handleAsync(cancelOrder, [web3, account, market, orderId], {
                  statusMessages: {
                      waiting: `Cancelling order`,
                      error: 'Failed to cancel order',
                  },
                  onSuccess: () => refetch(),
                  onError: () => refetch(),
              })
            : console.error('Failed to cancel order: Handle transaction not defined');
    };

    const tableHeader = useRef(null);
    const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
    useEffect(() => {
        // @ts-ignore
        setTableHeaderHeight(tableHeader?.current?.clientHeight);
    }, [tableHeader]);

    const headings = ['Status', 'Side', 'Price', 'Amount', 'Filled', 'Remaining', ''];
    return (
        <ScrollableTable bodyHeight={`${parentHeight - tableHeaderHeight}px`}>
            <TableHeader ref={tableHeader}>
                {headings.map((heading, i) => (
                    <TableHeading key={i}>{heading}</TableHeading>
                ))}
            </TableHeader>
            <TableBody>
                {userOrders?.map((order, index) => {
                    const amount = parseFloat(Web3.utils.fromWei(order?.amount?.toString() ?? '0')),
                        amountLeft = parseFloat(Web3.utils.fromWei(order?.amount_left?.toString() ?? '0')),
                        filled = amount - amountLeft;
                    return (
                        <TableRow key={`open-order-${index}`}>
                            <TableCell>{calcStatus(filled)}</TableCell>
                            <TableCell className={order.side.toLowerCase()}>
                                {order.side === 'Bid' ? 'Long' : 'Short'}
                            </TableCell>
                            <TableCell>
                                {toApproxCurrency(parseFloat(Web3.utils.fromWei(order.price.toString())))}
                            </TableCell>
                            <TableCell>
                                {amount.toFixed(2)} {baseTicker}
                            </TableCell>
                            <TableCell>
                                {filled.toFixed(2)} {baseTicker}
                            </TableCell>
                            <TableCell>
                                {amountLeft.toFixed(2)} {baseTicker}
                            </TableCell>
                            <TableCell>
                                <Cancel onClick={(_e: any) => _cancelOrder(order.target_tracer, order.id)}>
                                    Cancel
                                </Cancel>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </ScrollableTable>
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
