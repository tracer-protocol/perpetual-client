import React from 'react';
import { Logo } from '@components/General';
import { TableHead, TableHeadEnd, TableRow, TableCell } from '@components/Portfolio';
import { DateAndTime } from '@components/General';

const WithdrawalHistory: React.FC = () => {
    const headings = ['Date', 'Market', 'Amount', 'Transaction Details'];

    const tracers = [
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            amount: 453,
            details: '0x45...3235',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            amount: 453,
            details: '0x45...3235',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            amount: 453,
            details: '0x45...3235',
        },
    ];

    const tableHeadEnd = {
        width: '500px',
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 3 ? (
                                <TableHeadEnd theme={tableHeadEnd}>{heading}</TableHeadEnd>
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
                                    <div className="my-auto ml-1">Insurance Pool</div>
                                </div>
                            </TableCell>
                            <TableCell>{tracer.amount} iTLA-USDC</TableCell>
                            <TableCell>{tracer.details}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default WithdrawalHistory;
