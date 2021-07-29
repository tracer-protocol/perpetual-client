import React from 'react';
import { Button, Logo } from '@components/General';
import { toApproxCurrency, toPercent } from '@libs/utils';
import { TableHeading, TableRow, TableCell, TableLastHeading, TableLastCell, Table, TableBody, TableHeader } from '@components/General/Table';
import { StatusIndicator, calcStatus } from '@components/Portfolio';
import Tooltip from 'antd/lib/tooltip';
import Tracer from '@libs/Tracer';

const NoLeverageTip = <p>You have no leveraged trades open in this market.</p>;

const MarginAccounts: React.FC<{
    tracers: Tracer[];
}> = ({ tracers }) => {
    const headings = ['Market', 'Equity', 'Maintenance Margin', 'Available Margin', 'Status of Position'];

    return (
        <Table>
            <TableHeader>
                <tr>
                    {headings.map((heading, i) =>
                        i !== 4 ? (
                            <TableHeading>{heading}</TableHeading>
                        ) : (
                            <TableLastHeading>{heading}</TableLastHeading>
                        ),
                    )}
                </tr>
            </TableHeader>
            <TableBody>
                {tracers.map((tracer, i) => {
                    const balances = tracer.getBalance();
                    const status = calcStatus(balances.base.toNumber(), balances.availableMarginPercent.toNumber());
                    return (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>
                                <Tooltip title={NoLeverageTip}>
                                    <div className="flex flex-row">
                                        <div className="my-auto">
                                            <Logo ticker={tracer.baseTicker} />
                                        </div>
                                        <div className="my-auto ml-2">{tracer.marketId}</div>
                                    </div>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{toApproxCurrency(balances.totalMargin)}</TableCell>
                            <TableCell>{toApproxCurrency(balances.minimumMargin)}</TableCell>
                            <TableCell>{toPercent(balances.availableMarginPercent.toNumber(), true)}</TableCell>
                            <TableLastCell>
                                <div className="flex flex-row">
                                    <StatusIndicator color={status.color} className="text-2xl my-auto">
                                        &bull;
                                    </StatusIndicator>
                                    <div className="mx-2 my-auto">{status.text}</div>
                                    <div className="flex flex-row my-auto ml-auto mr-4">
                                        <Button className="mr-2">Deposit</Button>
                                        <Button>Withdraw</Button>
                                    </div>
                                </div>
                            </TableLastCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default MarginAccounts;
