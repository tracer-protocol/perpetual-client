import React, { useContext, useEffect, useState } from 'react';
import { TracerContext, InsuranceContext } from 'context';
import { useRouter } from 'next/router';
import { InsurancePoolInfo, InsurancePoolInfo as InsurancePoolInfoType } from 'types';
import styled from 'styled-components';
import { ProgressBar } from '@components/General';
import { Button, Logo } from '@components/General';
import { CaretDownFilled, LinkOutlined } from '@ant-design/icons';
import Breakdown from '../PoolHealth/Breakdown';
import { InsuranceModal } from '../InsuranceModal';
import { TableHead, TableRow, TableCell, SecondaryCell } from '@components/Portfolio';
import { toPercent } from '@libs/utils';
import Link from 'next/link';
import { StyledTooltip } from '@components/Tooltips';

const Hidden = styled.div`
    color: #3da8f5;
    opacity: 0;
    transition: 0.3s;
    transition-delay: 0s;

    .selected &,
    .show &,
    &.show {
        opacity: 1;
        transition-delay: 0.15s;
    }
`;

const SProgressBar = styled(ProgressBar)`
    border: 1px solid #3da8f5;
    min-width: 250px;
    width: 100%;
`;

type CProps = {
    pool: InsurancePoolInfo;
    className?: string;
};
const HealthCell: React.FC<CProps> = styled(({ pool, className }: CProps) => {
    return (
        <div className={className}>
            <SProgressBar percent={pool?.health.toNumber()} />
            <Hidden>
                <Breakdown
                    target={pool.target.toNumber()}
                    userBalance={pool.userBalance.toNumber()}
                    liquidity={pool.liquidity.toNumber()}
                    buffer={pool.buffer.toNumber()}
                />
            </Hidden>
        </div>
    );
})``;

const ButtonContainer = styled.div`
    margin-top: 5rem;
`;

const SDownCaret = styled(CaretDownFilled)`
    transition: 0.3s;
    margin: auto 0;
    transform: rotate(-90deg);
    color: #002886;

    .selected & {
        transform: rotate(0);
        color: white;
    }
`;

const OwnershipCell: React.FC<CProps> = styled(({ pool, className }: CProps) => {
    const [show, setShow] = useState(false);
    const [type, setType] = useState('Deposit');
    const openModal: (type: 'Deposit' | 'Withdraw') => void = (type: 'Deposit' | 'Withdraw') => {
        setType(type);
        setShow(true);
    };
    return (
        <div className={className}>
            <span>
                {pool.userBalance.toNumber()} {pool.iPoolTokenName}
            </span>
            <Link href={pool.iPoolTokenURL}>
                <StyledTooltip title="View on Etherscan">
                    <LinkOutlined style={{ margin: '5px', marginBottom: '2px' }} />
                </StyledTooltip>
            </Link>
            <SecondaryCell>{pool.userBalance.div(pool.liquidity).precision(5).toNumber() * 100}%</SecondaryCell>
            <Hidden>
                <ButtonContainer>
                    <Button className="primary mr-3" onClick={(_e: any) => openModal('Deposit')}>
                        Deposit
                    </Button>
                    <Button onClick={(_e: any) => openModal('Withdraw')}>Withdraw</Button>
                    <InsuranceModal show={show} setShow={setShow} type={type as 'Deposit' | 'Withdraw'} />
                </ButtonContainer>
            </Hidden>
        </div>
    );
})``;

const Collapsible = styled.div`
    transition: 0.3s;
    height: 3rem;
    overflow: hidden;

    .selected &,
    &.show {
        height: 16rem;
    }
`;

const MarketNameContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface IPTProps {
    handleClick: (tracerId: string) => void;
    pools: Record<string, InsurancePoolInfoType>;
    className?: string;
}

const InsurancePoolsTable: React.FC<IPTProps> = styled(({ pools, className }: IPTProps) => {
    const headings = ['Market', 'Current APY', 'Health', 'Pool Ownership'];
    const [expanded, setExpanded] = useState(-1);

    useEffect(() => {
        document.addEventListener('click', (e) => {
            const table = document.getElementById('pools-table');
            const modal = document.getElementById('insurance-modal');
            let target = e.target;
            do {
                // @ts-ignore
                if (target === table || target === modal || target?.id === 'insurance-submit') {
                    // dont exit if its a modal click
                    return;
                }
                // @ts-ignore
                target = target?.parentNode;
            } while (target);
            setExpanded(-1);
        });
    }, []);

    const onClick = (e: any, index: number) => {
        e.preventDefault();
        setExpanded(index);
    };

    const TableHeadEndTheme = {
        minWidth: '700px',
        borderRight: '1px solid #002886',
        borderBottom: '1px solid #002886',
    };

    return (
        <table id="pools-table" className={className}>
            <thead>
                <tr>
                    {headings.map((heading, i) =>
                        i === 3 ? (
                            <TableHead theme={TableHeadEndTheme}>{heading}</TableHead>
                        ) : (
                            <TableHead>{heading}</TableHead>
                        ),
                    )}
                </tr>
            </thead>
            <tbody>
                {Object.values(pools).map((pool, i) => {
                    // replace with check against selectedTracer
                    const show = expanded === i;
                    return (
                        <TableRow
                            key={`insurance-row-${i}`}
                            className={show ? 'selected' : ''}
                            onClick={(e) => onClick(e, i)}
                        >
                            <TableCell>
                                <Collapsible>
                                    <MarketNameContainer>
                                        <SDownCaret />
                                        <Logo className="ml-2" ticker="ETH" />
                                        <span className="ml-2">{pool.market}</span>
                                    </MarketNameContainer>
                                </Collapsible>
                            </TableCell>
                            <TableCell>
                                <Collapsible className="pt-2">{toPercent(pool.apy.toNumber())}</Collapsible>
                            </TableCell>
                            <TableCell>
                                <Collapsible className="pt-2">
                                    <HealthCell pool={pool} />
                                </Collapsible>
                            </TableCell>
                            <TableCell>
                                <Collapsible className="pt-1">
                                    <OwnershipCell pool={pool} />
                                </Collapsible>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </tbody>
        </table>
    );
})`
    color: #fff;
`;

/**
 * Even though this data could come from props, the user needs to ensure all data
 *  is loaded on this page as if they reload or specifically come to this page to check on their assets/pool
 *
 */
const Insurance: React.FC = () => {
    const { setTracerId } = useContext(TracerContext);
    const { pools } = useContext(InsuranceContext);

    const router = useRouter();
    const query = router.query;

    const handleClick = (tracerId: string) => {
        router.push({
            pathname: '/insurance',
            query: { tracer: tracerId.split('/').join('-') },
        });
    };

    useEffect(() => {
        if (query.tracer) {
            setTracerId
                ? setTracerId(query.tracer.toString().split('-').join('/'))
                : console.error('setTracerId not set');
        } else {
            setTracerId ? setTracerId('') : console.error('setTracerId not set');
        }
    }, [query]);

    return (
        <div className="h-full w-full flex flex-col">
            <InsurancePoolsTable pools={pools ?? {}} handleClick={handleClick} />
        </div>
    );
};

export default Insurance;
