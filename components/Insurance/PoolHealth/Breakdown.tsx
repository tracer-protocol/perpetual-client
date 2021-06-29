import { toApproxCurrency } from '@libs/utils';
import React from 'react';
import styled from 'styled-components';
import TooltipSelector, { TooltipSelectorProps } from '@components/Tooltips/TooltipSelector';

const calcRemainder = (target: number, liquidity: number, buffer: number) => {
    const total = liquidity - buffer - target;
    if (liquidity > target) {
        console.log('no remainder');
        return 0;
    } else {
        return total / target;
    }
};

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
        width: ${(props) => (props.buffer / props.target) * 100}%;
        min-width: ${(props) => (props.buffer ? '20px' : '0')};
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        margin-left: 0;
    }
    > .liquidity {
        background: var(--color-primary);
        border-top-left-radius: ${(props) => (!props.buffer ? '20px' : '0px')};
        border-bottom-left-radius: ${(props) => (!props.buffer ? '20px' : '0px')};
        min-width: ${(props) => (props.liquidity ? '20px' : '0')};
        border-top-right-radius: ${(props) => (props.liquidity >= props.target && props.target !== 0 ? '20px' : '0px')};
        border-bottom-right-radius: ${(props) =>
            props.liquidity >= props.target && props.target !== 0 ? '20px' : '0px'};
        width: calc(${(props) => ((Math.min(props.liquidity, props.target) - props.buffer) / props.target) * 100}%);
    }
    > .remainder {
        background: transparent;
        width: ${(props) => calcRemainder(props.target, props.liquidity, props.buffer) * 100}%;
        min-width: ${(props) => (!calcRemainder(props.target, props.liquidity, props.buffer) ? '0px' : '20px')};
    }
`;

type SProps = {
    title: string;
    percentage: number;
    value: number;
    color: string;
    target: 'excessTarget' | 'bufferTarget' | 'liquidityTarget';
    className?: string;
    tooltip?: TooltipSelectorProps;
};
const Section = styled(({ className, title, percentage, value, target, tooltip }: SProps) => {
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
                <span>{Number.isNaN(percentage) ? 0 : !Number.isFinite(percentage) ? 100 : percentage}%</span>
                <span className="value"> | {toApproxCurrency(value)}</span>
            </span>
        </div>
    );
})<SProps>`
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
                        value={parseFloat(liquidity.toFixed(2))}
                        tooltip={{ key: `pool-holdings`, props: { baseTicker: baseTicker } }}
                    />
                    <Label
                        title="Target"
                        value={parseFloat(target.toFixed(2))}
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
                        percentage={parseFloat(((buffer / target) * 100).toFixed(2))}
                        value={parseFloat(buffer.toFixed(2))}
                        color="#011772"
                        target="bufferTarget"
                        tooltip={{ key: 'buffer' }}
                    />
                    <Section
                        title="Public"
                        percentage={parseFloat((((Math.min(liquidity, target) - buffer) / target) * 100).toFixed(2))}
                        value={parseFloat(liquidity.toFixed(2))}
                        color="var(--color-primary)"
                        target="liquidityTarget"
                        tooltip={{ key: 'public' }}
                    />
                    {liquidity - target > 0 ? (
                        <Section
                            title="Excess"
                            percentage={parseFloat((((liquidity - target) / target) * 100).toFixed(2))}
                            value={parseFloat((liquidity - target).toFixed(2))}
                            color="#21DD53"
                            target="excessTarget"
                        />
                    ) : null}
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

    > .sections ${Section}:nth-child(2) {
        // middle child
        margin-right: auto;
        margin-left: ${(props) => (props.liquidity - props.target > 0 ? 'auto' : '1rem')};
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
