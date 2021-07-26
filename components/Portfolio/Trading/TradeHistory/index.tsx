import React, { FC, useEffect, useState } from 'react';
import { Logo } from '@components/General';
import { TableHeading, TableRow, TableCell, Table } from '@components/Table';
import { timeAgo, toApproxCurrency } from '@libs/utils';
import { LabelledOrders } from '@libs/types/OrderTypes';

interface THProps {
    fetchedTracers: any;
    allFilledOrders: LabelledOrders;
}
const TradeHistory: FC<THProps> = ({ fetchedTracers, allFilledOrders }: THProps) => {
    const [orderHistory, setOrderHistory] = useState<any>([]);

    useEffect(() => {
        const tempOrders: any[] = [];
        fetchedTracers.map((tracer: any) => {
            if (allFilledOrders[tracer.address] !== []) {
                tempOrders.push(allFilledOrders[tracer.address]);
            }
        });
        tempOrders.sort((order1, order2) => (order1.timestamp < order2.timestamp && 1) || -1);
        setOrderHistory(tempOrders);
    }, [fetchedTracers]);

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        {['Date', 'Market', 'Position', 'Exposure', 'Slippage', 'Fees', 'Total Cost', 'Order Type'].map(
                            (heading: string, i: number) => (
                                <TableHeading key={i}>{heading}</TableHeading>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {orderHistory?.map((order: any, i: number) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>{timeAgo(Date.now(), parseInt(order?.timestamp) * 1000)}</TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker="ETH" />
                                    </div>
                                    <div className="my-auto ml-2">ETH/USDC</div>
                                </div>
                            </TableCell>
                            <TableCell className={order?.position ? 'red' : 'green'}>
                                {order?.position ? 'Short' : 'Long'}
                            </TableCell>
                            <TableCell>{order?.amount.toFixed(2)}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{toApproxCurrency(order?.price)}</TableCell>
                            <TableCell>-</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default TradeHistory;
