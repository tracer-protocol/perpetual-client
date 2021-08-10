import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { InsuranceTransaction } from '@libs/types/InsuranceTypes';
import { DateAndTime } from '@components/General';
import Web3 from 'web3';

interface ADProps {
    parentHeight: number;
    withdrawalHistory: InsuranceTransaction[];
}
const WithdrawalsHistory: FC<ADProps> = ({ parentHeight, withdrawalHistory }: ADProps) => {
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
                    {Object.values(withdrawalHistory).map((transaction, i) => {
                        return (
                            <TableRow key={`table-row-${i}`}>
                                <TableCell>
                                    <DateAndTime timestamp={parseFloat(transaction.timestamp)} />
                                </TableCell>
                                <TableCell>{transaction.tracer.marketId}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>{Web3.utils.fromWei(transaction.amount.toString())}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>
                                    {transaction.id.slice(0, 7) + '...' + transaction.id.slice(-6, -1)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </ScrollableTable>
        </>
    );
};

export default WithdrawalsHistory;
