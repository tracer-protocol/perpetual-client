import { toApproxCurrency } from '@libs/utils';
import React from 'react';
import styled from 'styled-components';
import TooltipSelector, { TooltipSelectorProps } from '@components/Tooltips/TooltipSelector';

const calcRemainder = (target: number, liquidity: number, userBalance: number, buffer: number) => {
    const total = liquidity - userBalance - buffer;
    if (liquidity > target) {
        return 0;
    } else {
        return total / target;
    }
};

const hasFullOwnership = (liquidity: number, userBalance: number) => liquidity === userBalance;

const denom = (target: number, liquidity: number) => (target < liquidity ? target : liquidity);

interface BProps {
    baseTicker?: string;
    target: number;
    liquidity: number;
    userBalance: number;
    buffer: number;
    className?: string;
}

/**
 * Displays the insurance pool breakdown
 *
 * @requires liquidity > userBalance
 *
 */
const BreakdownBar: React.FC<BProps> = styled(({ className }: BProps) => {
    return (
        <div className={className}>
            <div className="buffer" id="bufferTarget" />
            <div className="liquidity" id="liquidityTarget" />
            <div className="userBalance" id="userBalanceTarget" />
            <div className="remainder" />
        </div>
    );
})`
    height: 32px;
    border: 1px solid var(--color-text);
    border-radius: 20px;
    display: flex;
    margin: 20px 0;
    > * {
        transition: 0.3s;
    }
    > .buffer {
        background: #011772;
        width: ${(props) => (props.buffer / denom(props.target, props.liquidity)) * 100}%;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        margin-left: 0;
    }
    > .liquidity {
        background: var(--color-primary);
        border-top-left-radius: ${(props) => !props.buffer ? '20px' : '0px'};
        border-bottom-left-radius: ${(props) => !props.buffer ? '20px' : '0px'};
        border-top-right-radius: ${(props) => !props.userBalance ? '20px' : '0px'};
        border-bottom-right-radius: ${(props) => !props.userBalance ? '20px' : '0px'};
        width: calc(
            ${(props) => ((props.liquidity - props.userBalance) / denom(props.target, props.liquidity)) * 100}% - 4px
        );
        border-radius: 20px;
    }
    > .userBalance {
        background: var(--color-secondary);
        width: ${(props) => (props.userBalance / denom(props.target, props.liquidity)) * 100}%;
        border-top-right-radius: ${(props) =>
            calcRemainder(props.target, props.liquidity, props.userBalance, props.buffer) === 0 ? '20px' : ''};
        border-bottom-right-radius: ${(props) =>
            calcRemainder(props.target, props.liquidity, props.userBalance, props.buffer) === 0 ? '20px' : ''};
        border-top-left-radius: ${(props) => (hasFullOwnership(props.liquidity, props.userBalance) ? '20px' : '')};
        border-bottom-left-radius: ${(props) => (hasFullOwnership(props.liquidity, props.userBalance) ? '20px' : '')};
    }
    > .remainder {
        background: transparent;
        width: ${(props) => calcRemainder(props.target, props.liquidity, props.userBalance, props.buffer) * 100}%;
    }
`;

type SProps = {
    title: string;
    percentage: number;
    value: number;
    color: string;
    target: 'userBalanceTarget' | 'bufferTarget' | 'liquidityTarget';
    className?: string;
    tooltip?: TooltipSelectorProps;
};
const Section: React.FC<SProps> = styled(({ className, title, percentage, value, target, tooltip }: SProps) => {
    return (
        <div
            className={className}
            onMouseEnter={() => {
                document.getElementById(target)?.classList.add('visible');
            }}
            onMouseLeave={() => {
                document.getElementById(target)?.classList.remove('visible');
            }}
        >
            <div className="bar" />
            {tooltip ? (
                <TooltipSelector tooltip={tooltip}>
                    <p>{title}</p>
                </TooltipSelector>
            ) : (
                <p>{title}</p>
            )}
            <span>
                <span>{Number.isNaN(percentage) ? 0 : percentage}%</span>
                <span className="value"> | {toApproxCurrency(value)}</span>
            </span>
        </div>
    );
})`
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: var(--color-text);
    transition: 0.3s;
    min-width: 100px;
    justify-content: space-between;
    cursor: pointer;

    > .bar {
        height: 7px;
        width: 100%;
        border-radius: 10px;
        margin-bottom: 0.5rem;
        background: ${(props) => props.color};
    }

    > span .value {
        color: var(--color-primary);
    }
`;

type LProps = {
    title: string;
    value: number;
    className?: string;
    tooltip?: TooltipSelectorProps;
};
const Label: React.FC<LProps> = styled(({ title, value, tooltip, className }: LProps) => {
    return (
        <div className={className}>
            {tooltip ? (
                <TooltipSelector tooltip={tooltip}>
                    <div className="title">{title}</div>
                </TooltipSelector>
            ) : (
                <div className="title">{title}</div>
            )}
            <div className="value">{toApproxCurrency(value)}</div>
        </div>
    );
})`
    > .title {
        color: var(--color-primary);
        font-size: var(--font-size-small);
    }
    > .value {
        font-size: var(--font-size-medium);
        letter-spacing: -0.4px;
        color: var(--color-text);
    }
`;
const Breakdown: React.FC<BProps> = styled(
    ({ baseTicker, target, liquidity, userBalance, buffer, className }: BProps) => {
        return (
            <div className={className}>
                <div className="sections">
                    <Label
                        title="Holdings"
                        value={liquidity}
                        tooltip={{ key: `pool-holdings`, props: { baseTicker: baseTicker } }}
                    />
                    <Label
                        title="Target"
                        value={target}
                        tooltip={{ key: `pool-target`, props: { baseTicker: baseTicker } }}
                    />
                </div>
                <BreakdownBar
                    target={target}
                    liquidity={liquidity}
                    userBalance={userBalance}
                    buffer={buffer}
                    className="bar"
                />
                <div className="sections hoverHide">
                    <Section
                        title="Buffer"
                        percentage={parseFloat(((buffer / liquidity) * 100).toFixed(3))}
                        value={buffer}
                        color="#011772"
                        target="bufferTarget"
                        tooltip={{ key: 'buffer' }}
                    />
                    <Section
                        title="Public"
                        percentage={parseFloat((((liquidity - userBalance - buffer) / liquidity) * 100).toFixed(3))}
                        value={liquidity}
                        color="var(--color-primary)"
                        target="liquidityTarget"
                        tooltip={{ key: 'public' }}
                    />
                    <Section
                        title="My Shares"
                        percentage={parseFloat(((userBalance / liquidity) * 100).toFixed(3))}
                        value={userBalance}
                        color="#005EA4"
                        target="userBalanceTarget"
                    />
                </div>
            </div>
        );
    },
)`
    margin-top: 1rem;

    > .sections {
        display: flex;
        justify-content: space-between;
    }

    &:hover > .hoverHide > *,
    &:hover .bar > * {
        opacity: 0.5;
    }

    &:hover > .hoverHide > *:hover {
        opacity: 1;
    }
    .visible {
        opacity: 1 !important;
    }
`;

export default Breakdown;
