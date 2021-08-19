import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { Button } from '@components/General';
import { toPercent } from '@libs/utils';
import { InsurancePoolInfo as InsurancePoolInfoType } from '@libs/types';

interface ADProps {
    parentHeight: number;
    pools: Record<string, InsurancePoolInfoType>;
}
const ActiveDeposits: FC<ADProps> = ({ parentHeight, pools }: ADProps) => {
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
                    {Object.values(pools).map((pool, i) => {
                        const show = showButton === i;
                        return (
                            <TableRow
                                key={`table-row-${i}`}
                                onMouseEnter={() => setShowButton(i)}
                                onMouseLeave={() => setShowButton(-1)}
                            >
                                <TableCell>{pool.market}</TableCell>
                                <TableCell>{toPercent(pool.apy.toNumber())}</TableCell>
                                <TableCell>{pool.userBalance.toNumber()}</TableCell>
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
