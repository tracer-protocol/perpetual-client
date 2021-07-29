import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/Table';
import { activeWithdrawals } from '@components/Portfolio';

interface AWProps {
    parentHeight: number;
}
const ActiveWithdrawals: FC<AWProps> = ({ parentHeight }: AWProps) => {
    const headings = ['Market', 'Unrealised Value', 'Status', 'Days Remaining', ''];
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
                    {Object.values(activeWithdrawals).map((tracer, i) => {
                        return (
                            <TableRow key={`table-row-${i}`}>
                                <TableCell>{tracer.market}</TableCell>
                                <TableCell>{tracer.unrealisedValue}</TableCell>
                                <TableCell>{tracer.status}</TableCell>
                                <TableCell>{tracer.daysRemaining}</TableCell>
                                <TableCell />
                            </TableRow>
                        );
                    })}
                </TableBody>
            </ScrollableTable>
        </>
    );
};

export default ActiveWithdrawals;
