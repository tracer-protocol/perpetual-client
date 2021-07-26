import React from 'react';
import { Button, Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import { TableHeading, TableRow, TableCell } from '@components/Table';
import { StatusIndicator, getStatusColour } from '@components/Portfolio';
import Tooltip from 'antd/lib/tooltip';

const NoLeverageTip = <p>You have no leveraged trades open in this market.</p>;

const MarginAccounts: React.FC = () => {
    const headings = ['Market', 'Equity', 'Maintenance Margin', 'Available Margin', 'Status of Position'];

    const tracers = [
        {
            name: 'TSLA',
            market: 'TSLA-USDC',
            tMargin: 4242,
            mMargin: 2121,
            aMargin: 2121,
            status: 'Open',
        },
        {
            name: 'LINK',
            market: 'LINK-USDC',
            tMargin: 4242,
            mMargin: 2121,
            aMargin: 2121,
            status: 'Eligible for Liquidation',
        },
        {
            name: 'ETH',
            market: 'ETH-USDC',
            tMargin: 4242,
            mMargin: 2121,
            aMargin: 2121,
            status: 'Approaching Liquidation',
        },
    ];

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 4 ? <TableHeading>{heading}</TableHeading> : <TableHeading>{heading}</TableHeading>,
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tracers.map((tracer, i) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>
                                <Tooltip title={NoLeverageTip}>
                                    <div className="flex flex-row">
                                        <div className="my-auto">
                                            <Logo ticker={tracer.name} />
                                        </div>
                                        <div className="my-auto ml-2">{tracer.market}</div>
                                    </div>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{toApproxCurrency(tracer.tMargin)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.mMargin)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.aMargin)}</TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <StatusIndicator
                                        color={getStatusColour(tracer.status)}
                                        className="text-2xl my-auto"
                                    >
                                        &bull;
                                    </StatusIndicator>
                                    <div className="mx-2 my-auto">{tracer.status}</div>
                                    <div className="flex flex-row my-auto ml-auto mr-4">
                                        <Button className="mr-2">Deposit</Button>
                                        <Button>Withdraw</Button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default MarginAccounts;
