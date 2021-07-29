import React from 'react';
import { Button, Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import { TableHeading, TableRow, TableCell, TableBody, TableHeader, Table } from '@components/General/Table';

const OpenDeposits: React.FC = () => {
    const headings = [
        'Market',
        'APY',
        'Realised APY',
        'Pool Ownership',
        'Unrealised Value',
        'Withdrawal Fee',
        'Unrealised Value',
    ];

    const tracers = [
        {
            name: 'TSLA',
            market: 'TSLA-USDC',
            apy: '0.86%',
            apyR: '86.3%',
            pool: 683,
            urv: 4657.31,
            wf: 0,
        },
        {
            name: 'TSLA',
            market: 'TSLA-USDC',
            apy: '0.86%',
            apyR: '44.2%',
            pool: 683,
            urv: 4657.31,
            wf: 0,
        },
    ];

    const TableHeadEndTheme = {
        minWidth: '300px',
        borderBottom: '1px solid var(--color-accent)',
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 6 ? (
                                <TableHeading theme={TableHeadEndTheme}>{heading}</TableHeading>
                            ) : (
                                <TableHeading>{heading}</TableHeading>
                            ),
                        )}
                    </tr>
                </TableHeader>
                <TableBody>
                    {tracers.map((tracer, i) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker={tracer.name} />
                                    </div>
                                    <div className="my-auto ml-2">{tracer.market}</div>
                                </div>
                            </TableCell>
                            <TableCell>{tracer.apy}</TableCell>
                            <TableCell>{tracer.apyR}</TableCell>
                            <TableCell>{tracer.pool} iTokens</TableCell>
                            <TableCell>{toApproxCurrency(tracer.urv)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.wf)}</TableCell>
                            <TableCell color={tracer.urv < 0 ? '#F15025' : '#21DD53'}>
                                <div className="flex flex-row">
                                    <div className="mr-20 my-auto">{toApproxCurrency(tracer.urv)}</div>
                                    <Button>Withdraw</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default OpenDeposits;
