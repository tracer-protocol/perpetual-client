import React, { useContext } from 'react';
import { Logo } from '@components/General';
import { TableHeading, TableRow, TableCell, Table } from '@components/Portfolio';
import { OMEContext } from '@context/OMEContext';
import { timeAgo, toApproxCurrency } from '@libs/utils';

const TradeHistory: React.FC = () => {
    const { filledOrders } = useContext(OMEContext);
    filledOrders?.sort((order1, order2) => (order1.timestamp < order2.timestamp && 1) || -1);

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
                    {filledOrders?.map((order, i) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>{timeAgo(Date.now(), parseInt(order.timestamp) * 1000)}</TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker="ETH" />
                                    </div>
                                    <div className="my-auto ml-2">ETH/USDC</div>
                                </div>
                            </TableCell>
                            <TableCell className={order.position ? 'red' : 'green'}>
                                {order.position ? 'Short' : 'Long'}
                            </TableCell>
                            <TableCell>{order.amount.toFixed(2)}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{toApproxCurrency(order.price)}</TableCell>
                            <TableCell>-</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default TradeHistory;
