import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { activeDeposits } from '@components/Portfolio';

interface ADProps {
    parentHeight: number;
}
const ActiveDeposits: FC<ADProps> = ({ parentHeight }: ADProps) => {
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
    return (
        <>
            <ScrollableTable bodyHeight={`${parentHeight - tableHeaderHeight}px`}>
                <TableHeader ref={tableHeader}>
                    {headings.map((heading, i) => (
                        <TableHeading key={i}>{heading}</TableHeading>
                    ))}
                </TableHeader>
                <TableBody>
                    {Object.values(activeDeposits).map((tracer, i) => {
                        return (
                            <TableRow key={`table-row-${i}`}>
                                <TableCell>{tracer.market}</TableCell>
                                <TableCell>{tracer.realisedAPY}</TableCell>
                                <TableCell>{tracer.ownership}</TableCell>
                                <TableCell>{tracer.unrealisedValue}</TableCell>
                                <TableCell>{tracer.instant}</TableCell>
                                <TableCell>{tracer.delayed}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </ScrollableTable>
        </>
    );
};

export default ActiveDeposits;
