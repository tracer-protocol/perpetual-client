import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { Button } from '@components/General';
import { InsurancePoolInfo, InsurancePoolInfo as InsurancePoolInfoType } from '@libs/types';
import { defaults } from '@libs/Tracer/Insurance';
import { InsuranceModal } from '@components/General/TracerModal/InsuranceModal';

interface AWProps {
    parentHeight: number;
    pools: Record<string, InsurancePoolInfoType>;
}
const ActiveWithdrawals: FC<AWProps> = ({ parentHeight, pools }: AWProps) => {
    const headings = ['Market', 'Unrealised Value', 'Status', 'Days Remaining', ''];
    const tableHeader = useRef(null);
    const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
    useEffect(() => {
        // @ts-ignore
        setTableHeaderHeight(tableHeader?.current?.clientHeight);
    }, [tableHeader]);

    const [showModal, setShowModal] = useState(false);
    const [pool, setPool] = useState<InsurancePoolInfo>();

    const handleClick = (popup: boolean, pool: InsurancePoolInfo) => {
        setShowModal(popup);
        setPool(pool);
    };

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
                        return (
                            <TableRow key={`table-row-${i}`}>
                                <TableCell>{pool.market}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleClick(true, pool)}>Claim</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </ScrollableTable>
            <InsuranceModal
                tracer={pool?.tracer}
                poolUserBalance={pool?.userBalance ?? defaults.userBalance}
                show={showModal}
                belowTarget={pool?.liquidity && pool?.target ? pool?.liquidity < pool?.target : false}
                setShow={setShowModal}
                type="Withdraw"
            />
        </>
    );
};

export default ActiveWithdrawals;
