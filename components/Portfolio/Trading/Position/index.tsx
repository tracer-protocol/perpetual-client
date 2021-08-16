import React, { useState } from 'react';
import { Button, Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import { StatusIndicator, calcStatus } from '@components/Portfolio';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeading,
    TableLastHeading,
    TableRow,
    TableCell,
    TableLastCell,
} from '@components/General/Table';
import { calcLiquidationPrice, calcUnrealised } from '@tracer-protocol/tracer-utils';
import { LabelledOrders } from 'libs/types/OrderTypes';
import { LabelledTracers } from 'libs/types/TracerTypes';
import { CloseOrderButton } from '@components/OrderButtons';

const Position: React.FC<{
    tracers: LabelledTracers;
    allFilledOrders: LabelledOrders;
}> = ({ tracers, allFilledOrders }) => {
    const [show, setShow] = useState(false);
    const headings = [
        'Market',
        'Side',
        'Exposure',
        'Liquidation / Last Price',
        'Break Even Price',
        'Unrealised P&L',
        'Realised P&L',
        'Status',
    ];

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setShow(!show);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    {headings.map((heading, i) =>
                        i !== 7 ? (
                            <TableHeading key={i}>{heading}</TableHeading>
                        ) : (
                            <TableLastHeading key={i}>{heading}</TableLastHeading>
                        ),
                    )}
                </TableHeader>
                <TableBody>
                    {Object.values(tracers).map((tracer, i) => {
                        const balances = tracer.getBalance();
                        const name = tracer.baseTicker;
                        const status = calcStatus(balances.base.toNumber(), balances.availableMarginPercent.toNumber());
                        const { quote, base, totalMargin } = tracer.balances;
                        // TODO: calculate realisedPNL
                        const realisedPNL = 0;
                        const unrealisedPNL = calcUnrealised(
                            base,
                            tracer.oraclePrice,
                            allFilledOrders[tracer.address] ?? [],
                        );
                        return (
                            <TableRow
                                key={`table-row-${i}`}
                                className={status.text === 'Closed' && !show ? 'hide' : ''}
                            >
                                <TableCell>
                                    <div className="flex flex-row">
                                        <div className="my-auto">
                                            <Logo ticker={name} />
                                        </div>
                                        <div className="my-auto ml-2">{tracer.marketId}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{base.eq(0) ? 'NO POSITION' : base.lt(0) ? 'SHORT' : 'LONG'}</TableCell>
                                <TableCell>
                                    {base.abs().toNumber()} {name}
                                </TableCell>
                                <TableCell>
                                    {toApproxCurrency(
                                        calcLiquidationPrice(quote, base, tracer.oraclePrice, tracer.maxLeverage),
                                    )}
                                    <span className="secondary"> / {toApproxCurrency(tracer.oraclePrice)}</span>
                                </TableCell>
                                <TableCell>{toApproxCurrency(totalMargin)}</TableCell>
                                <TableCell color={unrealisedPNL.toNumber() < 0 ? '#F15025' : '#21DD53'}>
                                    {toApproxCurrency(unrealisedPNL)}
                                </TableCell>
                                <TableCell color={realisedPNL < 0 ? '#F15025' : '#21DD53'}>
                                    {toApproxCurrency(realisedPNL)}
                                </TableCell>
                                <TableLastCell>
                                    <div className="flex flex-row">
                                        <StatusIndicator color={status.color} className="text-2xl my-auto">
                                            &bull;
                                        </StatusIndicator>
                                        <div className="mx-2 my-auto">{status.text}</div>
                                        <div className="my-auto ml-auto">
                                            <CloseOrderButton />
                                        </div>
                                    </div>
                                </TableLastCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <div className="flex mt-8 justify-center">
                <Button height="medium" onClick={(e: any) => onClick(e)}>
                    {show ? 'Hide Closed Positions' : 'Show Closed Positions'}
                </Button>
            </div>
        </>
    );
};
export default Position;
