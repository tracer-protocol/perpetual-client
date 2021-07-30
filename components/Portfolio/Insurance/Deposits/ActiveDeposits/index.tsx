import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { activeDeposits } from '@components/Portfolio';
import { Button } from '@components/General';

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
                    {Object.values(activeDeposits).map((tracer, i) => {
                        const show = showButton === i;
                        return (
                            <TableRow
                                key={`table-row-${i}`}
                                onMouseEnter={() => setShowButton(i)}
                                onMouseLeave={() => setShowButton(-1)}
                            >
                                <TableCell>{tracer.market}</TableCell>
                                <TableCell>{tracer.realisedAPY}</TableCell>
                                <TableCell>{tracer.ownership}</TableCell>
                                <TableCell>{tracer.unrealisedValue}</TableCell>
                                <TableCell>
                                    <div className="flex">
                                        {tracer.instant} <Button className={show ? 'ml-5' : 'hide'}>Withdraw</Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex">
                                        {tracer.delayed} <Button className={show ? 'ml-5' : 'hide'}>Withdraw</Button>
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
