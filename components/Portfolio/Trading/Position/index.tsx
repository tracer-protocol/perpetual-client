import React, { useState } from 'react';
import { Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import {
    TableHead,
    TableHeadEnd,
    TableRow,
    TableCell,
    SecondaryCell,
    Button,
    StatusIndicator,
    getStatusColour,
} from '@components/Portfolio';

const Position: React.FC = () => {
    const [show, setShow] = useState(false);

    const headings = [
        'Market',
        'Position',
        'Unrealised P&L',
        'Realised P&L',
        'Margin Used',
        'Exposure',
        'Liquidation Price/ Mark Price',
        'Status',
    ];

    const tracers = [
        {
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            unrealisedPL: 453.23,
            realisedPL: -4.5,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            markP: 4255.2,
            status: 'Open',
        },
        {
            name: 'LINK',
            market: 'LINK-USDC',
            position: 'long',
            unrealisedPL: 453.23,
            realisedPL: 3.1,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            markP: 4255.2,
            status: 'Eligible for Liquidation',
        },
        {
            name: 'ETH',
            market: 'ETH-USDC',
            position: 'short',
            unrealisedPL: -453.23,
            realisedPL: 4.5,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            markP: 4255.2,
            status: 'Approaching Liquidation',
        },
        {
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            unrealisedPL: 453.23,
            realisedPL: -4.5,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            markP: 4255.2,
            status: 'Closed',
        },
        {
            name: 'LINK',
            market: 'LINK-USDC',
            position: 'long',
            unrealisedPL: 453.23,
            realisedPL: 3.1,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            markP: 4255.2,
            status: 'Closed',
        },
    ];

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setShow(!show);
    };

    const activeButton = {
        width: '100px',
        hoverFG: '#fff',
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    };

    const inactiveButton = {
        width: '100px',
    };

    const largeButton = {
        width: '250px',
        hoverFG: '#fff',
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    };

    const openRow = {
        display: 'normal',
        color: '#fff',
        opacity: 1,
        hoverBG: '#002886',
        hoverCursor: 'pointer',
    };

    const showClosedRow = {
        display: 'normal',
        color: '##00000029',
        opacity: 0.5,
    };

    const hideClosedRow = {
        display: 'none',
    };

    const getRowStatus = (status: string, show: boolean) => {
        if (status !== 'Closed') {
            return openRow;
        } else {
            if (show) {
                return showClosedRow;
            } else {
                return hideClosedRow;
            }
        }
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 7 ? <TableHeadEnd>{heading}</TableHeadEnd> : <TableHead>{heading}</TableHead>,
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tracers.map((tracer, i) => (
                        <TableRow key={`table-row-${i}`} theme={getRowStatus(tracer.status, show)}>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker={tracer.name} />
                                    </div>
                                    <div className="my-auto ml-2">{tracer.market}</div>
                                </div>
                            </TableCell>
                            <TableCell>{tracer.position.toUpperCase()}</TableCell>
                            <TableCell color={tracer.unrealisedPL < 0 ? '#F15025' : '#21DD53'}>
                                {toApproxCurrency(tracer.unrealisedPL)}
                            </TableCell>
                            <TableCell color={tracer.realisedPL < 0 ? '#F15025' : '#21DD53'}>
                                {toApproxCurrency(tracer.realisedPL)}
                            </TableCell>
                            <TableCell>{toApproxCurrency(tracer.marginUsed)}</TableCell>
                            <TableCell>
                                {tracer.exposure} {tracer.name}
                            </TableCell>
                            <TableCell>
                                {toApproxCurrency(tracer.liquidationP)}
                                <SecondaryCell>{toApproxCurrency(tracer.markP)}</SecondaryCell>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <StatusIndicator
                                        color={getStatusColour(tracer.status)}
                                        className="text-2xl my-auto"
                                    >
                                        &bull;
                                    </StatusIndicator>
                                    <div className="mx-2 my-auto">{tracer.status}</div>
                                    <div className="my-auto ml-auto">
                                        <Button theme={tracer.status !== 'Closed' ? activeButton : inactiveButton}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
            <div className="flex mt-8 justify-center">
                <Button theme={largeButton} onClick={(e) => onClick(e)}>
                    {show ? 'Hide Closed Positions' : 'Show Closed Positions'}
                </Button>
            </div>
        </>
    );
};

export default Position;
