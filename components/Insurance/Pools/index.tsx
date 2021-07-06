import React, { useContext, useEffect, useState } from 'react';
import { TracerContext, InsuranceContext } from 'context';
import { defaults } from 'libs/Tracer/Insurance';
import { useRouter } from 'next/router';
import { InsurancePoolInfo, InsurancePoolInfo as InsurancePoolInfoType } from 'types';
import styled from 'styled-components';
import { ProgressBar } from '@components/General';
import { Button, Logo } from '@components/General';
import { CaretDownFilled, LinkOutlined } from '@ant-design/icons';
import Breakdown from '../PoolHealth';
import { InsuranceModal } from '../InsuranceModal';
import { TableHeading, TableRow, TableCell, SecondaryCell } from '@components/Portfolio';
import { toPercent } from '@libs/utils';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import Icon from '@ant-design/icons';
// @ts-ignore
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import BigNumber from 'bignumber.js';

const Hidden = styled.div`
    color: var(--color-primary);
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
    border: 1px solid var(--color-primary);
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
            <SProgressBar percent={pool.health ? parseFloat(pool.health.toFixed(2)) : defaults.health.toFixed(2)} />
            <Hidden>
                <Breakdown
                    baseTicker={pool.market.split('/')[0]}
                    target={pool.target?.toNumber() ?? defaults.target.toNumber()}
                    userBalance={pool.userBalance?.toNumber() ?? defaults.userBalance.toNumber()}
                    liquidity={pool.liquidity?.toNumber() ?? defaults.liquidity.toNumber()}
                    buffer={pool.buffer?.toNumber() ?? defaults.buffer.toNumber()}
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
    color: var(--color-accent);

    .selected & {
        transform: rotate(0);
        color: white;
    }
`;

const StyledLinkOutlined = styled(LinkOutlined)`
    vertical-align: 0.125rem;
    margin-left: 0.5rem;
`;

const OwnershipCell: React.FC<CProps> = ({ pool, className }: CProps) => {
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
            <TooltipSelector tooltip={{ key: 'etherscan-link' }}>
                <StyledLinkOutlined onClick={() => window.open(pool.iPoolTokenURL, '_blank', 'noopener')} />
            </TooltipSelector>
            <SecondaryCell>{toPercent(pool.userBalance.div(pool.liquidity).toNumber())}</SecondaryCell>
            <Hidden>
                <ButtonContainer>
                    <Button className="primary mr-3" onClick={(_e: any) => openModal('Deposit')}>
                        Deposit
                    </Button>
                    <Button onClick={(_e: any) => openModal('Withdraw')}>Withdraw</Button>
                    <InsuranceModal
                        tracer={pool.tracer}
                        poolUserBalance={pool.userBalance}
                        show={show}
                        setShow={setShow}
                        type={type as 'Deposit' | 'Withdraw'}
                    />
                </ButtonContainer>
            </Hidden>
        </div>
    );
};

const Collapsible = styled.div`
    transition: 0.3s;
    height: 3.6rem;
    overflow: hidden;
    padding-top: 0.6rem;

    font-size: var(--font-size-small);

    .selected &,
    &.show {
        height: 16rem;
    }
`;

const MarketNameContainer = styled.div`
    display: flex;
    align-items: center;
`;

const StyledIcon = styled(Icon)`
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    border-bottom: 1px solid var(--color-accent);
    border-left: 1px solid var(--color-accent);
    border-right: 1px solid var(--color-accent);
`;
interface IPTProps {
    handleClick: (tracerId: string) => void;
    pools: Record<string, InsurancePoolInfoType>;
    className?: string;
}

const InsurancePoolsTable: React.FC<IPTProps> = styled(({ pools, className }: IPTProps) => {
    const [expanded, setExpanded] = useState(-1);

    useEffect(() => {
        document.addEventListener('click', (e) => {
            const table = document.getElementById('pools-table');
            const modal = document.getElementById('insurance-modal');
            const button = document.getElementById('insurance-submit');
            let target = e.target;
            do {
                // @ts-ignore
                if (target === table || target === modal || target === button) {
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
                <TableHeading>Market</TableHeading>
                <TableHeading>
                    <TooltipSelector tooltip={{ key: 'current-apy' }}>Current APY</TooltipSelector>
                </TableHeading>
                <TableHeading className="w-1/5 xl:w-1/4">
                    <TooltipSelector tooltip={{ key: 'insurance-pool-health' }}>Health</TooltipSelector>
                </TableHeading>
                <TableHeading className="w-2/5 xl:w-1/2">
                    <TooltipSelector tooltip={{ key: 'pool-ownership' }}>Pool Ownership</TooltipSelector>
                </TableHeading>
            </thead>
            <tbody>
                {Object.values(pools).map((pool, i) => {
                    // replace with check against selectedTracer
                    const show = expanded === i;
                    if (!pool.tracer) {
                        return <StyledIcon component={TracerLoading} className="tracer-loading" />;
                    }
                    return (
                        <TableRow
                            key={`insurance-row-${i}`}
                            className={show ? 'selected' : ''}
                            onClick={(e) => onClick(e, i)}
                            theme={expanded ? '' : {}}
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
                            <TableCell className="pt-4">
                                <Collapsible>{toPercent((pool?.apy ?? new BigNumber(0)).toNumber())}</Collapsible>
                            </TableCell>
                            <TableCell className="pt-2">
                                <Collapsible>
                                    <HealthCell pool={pool} />
                                </Collapsible>
                            </TableCell>
                            <TableCell>
                                <Collapsible>
                                    <OwnershipCell pool={pool} />
                                </Collapsible>
                            </TableCell>
                        </TableRow>
                    );
                })}
                {!Object.values(pools).length ? (
                    <StyledIcon component={TracerLoading} className="tracer-loading" />
                ) : null}
            </tbody>
        </table>
    );
})`
    color: var(--color-text);
    position: relative;
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
