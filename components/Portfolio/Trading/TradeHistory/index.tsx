import React, { FC } from 'react';
import { Logo } from '@components/General';
import { TableHeading, TableRow, TableCell, Table } from '@components/Table';
import { timeAgo, toApproxCurrency } from '@libs/utils';

interface THProps {
    allFilledOrders: any;
}
const TradeHistory: FC<THProps> = ({ allFilledOrders }: THProps) => {
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
                    {allFilledOrders?.map((order: any, i: number) => (
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
