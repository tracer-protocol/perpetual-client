import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { InsuranceTransaction } from '@libs/types/InsuranceTypes';
import Web3 from 'web3';
import { DateAndTime } from '@components/General';

interface ADProps {
    parentHeight: number;
    depositHistory: InsuranceTransaction[];
}
const DepositsHistory: FC<ADProps> = ({ parentHeight, depositHistory }: ADProps) => {
    const headings = ['Date', 'Market', 'Amount', 'iTokens Minted', 'Transaction Details'];
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
                    {Object.values(depositHistory).map((transaction, i) => {
                        return (
                            <TableRow key={`table-row-${i}`}>
                                <TableCell>
                                    <DateAndTime timestamp={parseFloat(transaction.timestamp)} />
                                </TableCell>
                                <TableCell>{transaction.tracer.marketId}</TableCell>
                                <TableCell>{Web3.utils.fromWei(transaction.amount.toString())}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>
                                    {transaction.id.slice(0, 8) + '...' + transaction.id.slice(-6, -1)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </ScrollableTable>
        </>
    );
};

export default DepositsHistory;
