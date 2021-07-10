import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import { TableHeading, TableRow, TableCell, SecondaryCell } from '@components/Portfolio';
import { DateAndTime } from '@components/General';

const Transfers: React.FC = () => {
    const headings = ['Date', 'Type', 'Amount / Currency', 'Transaction Details'];

    const tracers = [
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            type: 'Deposit',
            amount: 4562,
            currency: 'DAI',
            details: '0x75...423',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            type: 'Deposit',
            amount: 4562,
            currency: 'DAI',
            details: '0x75...423',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            type: 'Deposit',
            amount: 4562,
            currency: 'DAI',
            details: '0x75...423',
        },
    ];

    const TableHeadEndTheme = {
        minWidth: '700px',
        borderBottom: '1px solid var(--color-accent)',
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 3 ? (
                                <TableHeading theme={TableHeadEndTheme} key={i}>{heading}</TableHeading>
                            ) : (
                                <TableHeading key={i}>{heading}</TableHeading>
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
                            <TableCell>{tracer.type}</TableCell>
                            <TableCell>
                                {toApproxCurrency(tracer.amount)}
                                <SecondaryCell>{tracer.currency}</SecondaryCell>
                            </TableCell>
                            <TableCell>{tracer.details}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Transfers;
