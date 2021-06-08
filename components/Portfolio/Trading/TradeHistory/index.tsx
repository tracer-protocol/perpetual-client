import React from 'react';
import { Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import { TableHead, TableRow, TableCell } from '@components/Portfolio';
import { DateAndTime } from '@components/General';

const TradeHistory: React.FC = () => {
    const headings = ['Date', 'Market', 'Position', 'Exposure / Price', 'Slippage', 'Fees', 'Total Cost', 'Order Type'];

    const tracers = [
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            exposure: 4.5,
            slippage: 3.23,
            fees: 2.23,
            cost: 453.23,
            type: 'Market',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            exposure: 4.5,
            slippage: 3.23,
            fees: 2.23,
            cost: 453.23,
            type: 'Market',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            exposure: 4.5,
            slippage: 3.23,
            fees: 2.23,
            cost: 453.23,
            type: 'Market',
        },
    ];

    const tableHeadEnd = {
        width: '200px',
        borderBottom: '1px solid #002886',
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 7 ? (
                                <TableHead theme={tableHeadEnd}>{heading}</TableHead>
                            ) : (
                                <TableHead>{heading}</TableHead>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tracers.map((tracer, i) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>
                                <DateAndTime date={tracer.date} time={tracer.time} />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker={tracer.name} />
                                    </div>
                                    <div className="my-auto ml-2">{tracer.market}</div>
                                </div>
                            </TableCell>
                            <TableCell>{tracer.position.toUpperCase()}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.exposure)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.slippage)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.fees)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.cost)}</TableCell>
                            <TableCell>{tracer.type}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default TradeHistory;
