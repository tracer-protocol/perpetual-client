import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/Table';
import { withdrawalsHistory } from '@components/Portfolio';

interface ADProps {
    parentHeight: number;
}
const WithdrawalsHistory: FC<ADProps> = ({ parentHeight }: ADProps) => {
    const headings = ['Date', 'Market', 'Type', 'Amount', 'Fees', 'Transaction Details'];
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
                    {Object.values(withdrawalsHistory).map((tracer, i) => {
                        return (
                            <TableRow key={`table-row-${i}`}>
                                <TableCell>{tracer.date}</TableCell>
                                <TableCell>{tracer.market}</TableCell>
                                <TableCell>{tracer.type}</TableCell>
                                <TableCell>{tracer.amount}</TableCell>
                                <TableCell>{tracer.fees}</TableCell>
                                <TableCell>{tracer.details}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </ScrollableTable>
        </>
    );
};

export default WithdrawalsHistory;
