import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import {TableHead, TableHeadEnd, TableRow, TableCell, SecondaryCell, DateAndTime} from '@components/Portfolio';

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

    const tableHeadEnd = {
        width: '700px',
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
                            <DateAndTime
                                date={tracer.date}
                                time={tracer.time}
                                borderRight={true}
                                borderBottom={true}
                                color="#005ea4"
                            />
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
