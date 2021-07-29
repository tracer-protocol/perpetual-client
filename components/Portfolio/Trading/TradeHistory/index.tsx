import React, { FC, useEffect, useState } from 'react';
import { Logo } from '@components/General';
import { Table, TableHeader, TableBody, TableHeading, TableRow, TableCell } from '@components/Table';
import { toApproxCurrency } from '@libs/utils';
import { LabelledOrders, FilledOrder } from '@libs/types/OrderTypes';

interface THProps {
    allFilledOrders: LabelledOrders;
}
const TradeHistory: FC<THProps> = ({ allFilledOrders }: THProps) => {
    const [orderHistory, setOrderHistory] = useState<any>([]);

    useEffect(() => {
        const tempOrders: FilledOrder[] = Object.values(allFilledOrders).reduce(
            (previous, current) => previous.concat(current),
            [],
        );
        tempOrders.sort((order1, order2) => (order1.timestamp < order2.timestamp && 1) || -1);
        setOrderHistory(tempOrders);
    }, [allFilledOrders]);

    return (
        <>
            <Table>
                <TableHeader>
                    {['Date', 'Market', 'Position', 'Exposure', 'Slippage', 'Fees', 'Total Cost', 'Order Type'].map(
                        (heading: string, i: number) => (
                            <TableHeading key={i}>{heading}</TableHeading>
                        ),
                    )}
                </TableHeader>
                <TableBody>
                    {orderHistory?.map((order: any, i: number) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>{String(new Date(parseInt(order?.timestamp)))}</TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker="ETH" />
                                    </div>
                                    <div className="my-auto ml-2">ETH/USDC</div>
                                </div>
                            </TableCell>
                            <TableCell className={order?.position ? 'red' : 'green'}>
                                {order?.position ? 'SHORT' : 'LONG'}
                            </TableCell>
                            <TableCell>{order?.amount.toFixed(2)}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{toApproxCurrency(order?.price)}</TableCell>
                            <TableCell>-</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default TradeHistory;
