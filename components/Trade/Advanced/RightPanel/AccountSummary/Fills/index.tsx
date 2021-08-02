import React, { memo, useEffect, useRef, useState } from 'react';
import { FilledOrder } from '@libs/types/OrderTypes';
import { timeAgo, toApproxCurrency } from '@libs/utils';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';

const FillsTab: React.FC<{
    filledOrders: FilledOrder[];
    parentHeight: number;
}> = memo(({ filledOrders, parentHeight }) => {
    filledOrders.sort((order1, order2) => (order1.timestamp < order2.timestamp && 1) || -1);

    const tableHeader = useRef(null);
    const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
    useEffect(() => {
        // @ts-ignore
        setTableHeaderHeight(tableHeader?.current?.clientHeight);
    }, [tableHeader]);

    const headings = ['Time', 'Side', 'Price', 'Amount'];

    return (
        <ScrollableTable bodyHeight={`${parentHeight - tableHeaderHeight}px`}>
            <TableHeader ref={tableHeader}>
                {headings.map((heading, i) => (
                    <TableHeading key={i}>{heading}</TableHeading>
                ))}
            </TableHeader>
            <TableBody>
                {filledOrders.map((order, index) => {
                    return (
                        <TableRow key={`filled-order-${index}`}>
                            <TableCell>{timeAgo(Date.now(), parseInt(order.timestamp) * 1000)}</TableCell>
                            <TableCell className={!!order.position ? 'ask' : 'bid'}>
                                {!!order.position ? 'Short' : 'Long'}
                            </TableCell>
                            <TableCell>{toApproxCurrency(order.price)}</TableCell>
                            <TableCell>{order.amount.toFixed(2)}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </ScrollableTable>
    );
});
FillsTab.displayName = 'Fills';

export default FillsTab;
