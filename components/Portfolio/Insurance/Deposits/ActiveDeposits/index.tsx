import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollableTable, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { Button } from '@components/General';
import { toPercent } from '@libs/utils';
import { InsurancePoolInfo, InsurancePoolInfo as InsurancePoolInfoType } from '@libs/types';
import { InsuranceModal } from '@components/General/TracerModal/InsuranceModal';
import { defaults } from '@libs/Tracer/Insurance';

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
                                        <Button
                                            height="extra-small"
                                            className={show ? 'ml-5' : 'hide'}
                                            onClick={() => handleClick(true, pool)}
                                        >
                                            Withdraw
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex">
                                        -{' '}
                                        <Button
                                            height="extra-small"
                                            className={show ? 'ml-5' : 'hide'}
                                            onClick={() => handleClick(true, pool)}
                                        >
                                            Withdraw
                                        </Button>
                                    </div>
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

export default ActiveDeposits;
