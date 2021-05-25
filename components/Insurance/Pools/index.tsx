import React, { useContext, useEffect, useState } from 'react';
import { TracerContext, InsuranceContext } from 'context';
import { useRouter } from 'next/router';
import { InsurancePoolInfo, InsurancePoolInfo as InsurancePoolInfoType } from 'types';
import styled from 'styled-components';
import { ProgressBar } from '@components/General';
import { Button, Logo } from '@components/General';
import { CaretDownFilled } from '@ant-design/icons';
import Breakdown from '../PoolHealth/Breakdown';
import { InsuranceModal } from '@components/Modals/InsuranceModal';
import { defaults } from '@context/InsuranceContext';

const TableHead = styled.th`
    color: #3da8f5;
    padding: 1rem;
    font-size: 1rem;
    letter-spacing: -0.32px;
`;

const TableCell = styled.td`
    transition: 1s;
    padding: 1rem;
    border: 1px solid #002886;
`;

const TableRow = styled.tr`
    &.selected {
        background: #002886;
    }
    &: hover {
        background: #002886;
        cursor: pointer;
    }
`;

const Teaser = styled.div`
    font-size: 1.3rem;
    color: #fff;
    display: flex;
    margin-bottom: 1rem;
`;
const Hidden = styled.div`
    font-size: 1rem;
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

const Collapsible = styled.div`
    transition: 0.3s;
    height: 2rem;
    overflow: hidden;
    .selected &,
    &.show {
        // to options
        height: 250px;
    }
`;

type CProps = {
    pool: InsurancePoolInfo;
    className?: string;
};

const SProgressBar = styled(ProgressBar)`
    border: 1px solid #3da8f5;
    min-width: 250px;
    width: 100%;
`;
const HealthCell: React.FC<CProps> = ({ pool }: CProps) => {
    return (
        <Collapsible>
            <Teaser>
                <SProgressBar percent={pool?.health.toNumber()} />
            </Teaser>
            <Hidden>
                <Breakdown
                    target={pool.target.toNumber()}
                    userBalance={pool.userBalance.toNumber()}
                    liquidity={pool.liquidity.toNumber()}
                    buffer={pool.buffer.toNumber()}
                />
            </Hidden>
        </Collapsible>
    );
};

const ButtonContainer = styled.div`
    display: flex;
`;

const SDownCaret = styled(CaretDownFilled)`
    opacity: 0;
    transition: 0.3s;
    margin: auto 0;
    transform: rotate(-180deg);
    .selected & {
        opacity: 1;
        transform: rotate(0);
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
        <Collapsible className={className}>
            <Teaser>
                <span>{pool?.userBalance.toNumber() ?? defaults.userBalance.toNumber()} iTokens</span>
                <span className="percent">{pool.userBalance.div(pool.liquidity).precision(5).toNumber() * 100}%</span>
            </Teaser>
            <Hidden>
                <ButtonContainer>
                    <Button className="primary mr-3" onClick={(_e: any) => openModal('Deposit')}>
                        Deposit
                    </Button>
                    <Button onClick={(_e: any) => openModal('Withdraw')}>Withdraw</Button>
                    <InsuranceModal show={show} setShow={setShow} type={type as 'Deposit' | 'Withdraw'} />
                </ButtonContainer>
            </Hidden>
        </Collapsible>
    );
})`
    > * .percent {
        color: #3da8f5;
        margin-left: 20px;
    }
`;

interface IPTProps {
    handleClick: (tracerId: string) => void;
    pools: Record<string, InsurancePoolInfoType>;
    className?: string;
}
const InsurancePoolsTable: React.FC<IPTProps> = styled(({ pools, className }: IPTProps) => {
    const headings = ['Market', 'APY', 'Health', 'Pool Ownership'];
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
    return (
        <table id="pools-table" className={className}>
            <thead>
                <tr>
                    {headings.map((heading, i) => (
                        <TableHead key={`insurance-head-${i}`}>{heading}</TableHead>
                    ))}
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
                            <TableCell className="w-1/6">
                                <Collapsible>
                                    <Teaser>
                                        <SDownCaret />
                                        <Logo className="ml-2" ticker="ETH" />
                                        <span className="ml-2 my-auto">{pool.market}</span>
                                    </Teaser>
                                    <Hidden>Protects borrowers in the {pool.market} market.</Hidden>
                                </Collapsible>
                            </TableCell>
                            <TableCell className="w-1/6">
                                <Collapsible>
                                    <Teaser>{pool.apy.toNumber()}</Teaser>
                                    <Hidden className={`${show ? 'show' : ''}`}>
                                        30 day average realised/net APY.
                                    </Hidden>
                                </Collapsible>
                            </TableCell>
                            <TableCell>
                                <HealthCell pool={pool} />
                            </TableCell>
                            <TableCell>
                                <OwnershipCell pool={pool} />
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
    // const { insurancePools } = useAllPools();

    // console.debug(insurancePools, 'Insurance Graph data');

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
