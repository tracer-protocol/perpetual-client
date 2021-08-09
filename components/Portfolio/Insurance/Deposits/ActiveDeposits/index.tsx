import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { Button } from '@components/General';
import Insurance from '@libs/Tracer/Insurance';
import { toPercent } from '@libs/utils';

interface ADProps {
    parentHeight: number;
    insuranceContracts: Insurance[];
}
const ActiveDeposits: FC<ADProps> = ({ parentHeight, insuranceContracts }: ADProps) => {
    const headings = [
        'Market',
        'Realised APY',
        'Pool Ownership',
        'Unrealised Value',
        'Instant Withdrawal Fee',
        'Delayed Withdrawal Fee',
    ];
    const tableHeader = useRef(null);
    const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
    useEffect(() => {
        // @ts-ignore
        setTableHeaderHeight(tableHeader?.current?.clientHeight);
    }, [tableHeader]);

    const [showButton, setShowButton] = useState(-1);
    return (
        <>
            <ScrollableTable bodyHeight={`${parentHeight - tableHeaderHeight}px`}>
                <TableHeader ref={tableHeader}>
                    {headings.map((heading, i) => (
                        <TableHeading key={i}>{heading}</TableHeading>
                    ))}
                </TableHeader>
                <TableBody>
                    {Object.values(insuranceContracts).map((insuranceContract, i) => {
                        const show = showButton === i;
                        return (
                            <TableRow
                                key={`table-row-${i}`}
                                onMouseEnter={() => setShowButton(i)}
                                onMouseLeave={() => setShowButton(-1)}
                            >
                                <TableCell>{insuranceContract.market}</TableCell>
                                <TableCell>{toPercent(insuranceContract.apy.toNumber())}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>
                                    <div className="flex">
                                        -{' '}
                                        <Button height="extra-small" className={show ? 'ml-5' : 'hide'}>
                                            Withdraw
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex">
                                        -{' '}
                                        <Button height="extra-small" className={show ? 'ml-5' : 'hide'}>
                                            Withdraw
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </ScrollableTable>
        </>
    );
};

export default ActiveDeposits;
