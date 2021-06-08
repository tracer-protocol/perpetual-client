import { toApproxCurrency } from '@libs/utils';
import React from 'react';
import styled from 'styled-components';

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
    target: number;
    liquidity: number;
    userBalance: number;
    buffer: number;
    className?: string;
}

/**
 * Displays the insurance pool breakdown
 *
 * @requires
 *  liquidity > userBalance
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
    border: 1px solid #fff;
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
        background: #3da8f5;
        width: calc(
            ${(props) => ((props.liquidity - props.userBalance) / denom(props.target, props.liquidity)) * 100}% - 4px
        );
    }
    > .userBalance {
        background: #005ea4;
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
};
const Section: React.FC<SProps> = styled(({ title, percentage, value, target, className }: SProps) => {
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
            <p>{title}</p>
            <span>
                <span>{Number.isNaN(percentage) ? 0 : percentage}%</span>
                <span className="value"> | {toApproxCurrency(value)}</span>
            </span>
        </div>
    );
})`
    font-size: 1rem;
    letter-spacing: -0.32px;
    color: #fff;
    transition: 0.3s;
    min-width: 100px;
    justify-content: space-between;
    > .bar {
        height: 7px;
        width: 100%;
        border-radius: 10px;
        margin-bottom: 0.5rem;
        background: ${(props) => props.color};
    }

    > span .value {
        color: #3da8f5;
    }
`;

type LProps = {
    title: string;
    value: number;
    className?: string;
};
const Label: React.FC<LProps> = styled(({ title, value, className }: LProps) => {
    return (
        <div className={className}>
            <div className="title">{title}</div>
            <div className="value">{toApproxCurrency(value)}</div>
        </div>
    );
})`
    > .title {
        color: #3da8f5;
        font-size: 1rem;
    }
    > .value {
        font-size: 1.25rem;
        letter-spacing: -0.4px;
        color: #fff;
    }
`;
const Breakdown: React.FC<BProps> = styled(({ target, liquidity, userBalance, buffer, className }: BProps) => {
    return (
        <div className={className}>
            <div className="sections">
                <Label title="Current Deposits" value={liquidity} />
                <Label title="Target" value={target} />
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
                />
                <Section
                    title="Public"
                    percentage={parseFloat((((liquidity - userBalance - buffer) / liquidity) * 100).toFixed(3))}
                    value={liquidity}
                    color="#3DA8F5"
                    target="liquidityTarget"
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
})`
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
