import { Children } from 'libs/types';
import React, { FC } from 'react';
import styled from 'styled-components';
import TooltipSelector, { TooltipSelectorProps } from '@components/Tooltips/TooltipSelector';
import { toDate, toTime } from '@libs/utils';

interface DTProps {
    className?: string;
    timestamp: number;
}
export const DateAndTime: FC<DTProps> = styled(({ className, timestamp }: DTProps) => {
    const date = toDate(timestamp);
    const time = toTime(timestamp);
    return (
        <div className={className}>
            {date}
            <span>{time}</span>
        </div>
    );
})`
    > span {
        color: var(--color-secondary);
        margin-left: 0.5rem;
    }
`;

export const Box = styled.div`
    display: flex;
    padding: 12px;
`;

export const Button = styled.button<{ height?: 'medium' | 'small' | 'extra-small' }>`
    width: 160px;
    border-radius: 20px;
    transition: 0.3s;
    border: 1px solid var(--color-primary);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: var(--color-primary);
    height: var(--height-${(props) => props.height as string}-button);
    cursor: pointer;

    &.hide {
        display: none;
    }

    &:hover {
        background: var(--color-primary);
        color: var(--color-text);
    }

    &:focus,
    &:active {
        outline: none;
        border: 1px solid var(--color-primary);
        border-radius: 20px;
    }

    &.primary {
        background: var(--color-primary);
        color: var(--color-text);
    }

    &.primary:hover {
        background: var(--color-background);
        color: var(--color-primary);
    }

    &:disabled,
    &[disabled],
    .button-disabled {
        opacity: 0.5;
        cursor: not-allowed;

        &:hover {
            background: none;
            color: var(--color-primary);
        }
    }
`;

export const Card = styled.div`
    background: #011772;
    box-shadow: 0 5px 10px #00000029;
    border-radius: 5px;
    transition: 0.3s;

    h1 {
        font-size: var(--font-size-medium);
        letter-spacing: var(--letter-spacing-extra-small);
        color: #ffffff;
    }
`;

type SProps = {
    className?: string;
    label: string;
    tooltip?: TooltipSelectorProps;
} & Children;
export const Section: React.FC<SProps> = styled(({ className, children, label, tooltip }: SProps) => {
    return (
        <div className={`${className}`}>
            {tooltip ? (
                <TooltipSelector tooltip={tooltip}>{label}</TooltipSelector>
            ) : (
                <div className={'label'}>{label}</div>
            )}
            <span className={'content'}>{children}</span>
        </div>
    );
})`
    width: 100%;
    display: flex;
    padding-bottom: 0.3rem;
    &:last-child {
        padding-bottom: 0;
    }
    font-size: var(--font-size-small);
    box-sizing: border-box;

    > .label {
        text-align: left;
        white-space: nowrap;
        color: var(--color-primary);
        text-transform: capitalize;
    }

    > .content {
        text-align: right;
        width: 100%;
        padding-left: 0.25rem;
    }
`;

const clearLogos: Record<string, string> = {
    TSLA: '/img/logos/currencies/tesla_clear.svg',
    ETH: '/img/logos/currencies/eth_clear.svg',
    LINK: '/img/logos/currencies/link_clear.svg',
};

const logos: Record<string, string> = {
    TSLA: '/img/logos/currencies/tesla.svg',
    ETH: '/img/logos/currencies/eth.svg',
    LINK: '/img/logos/currencies/link.svg',
};

const tickerTypes: string[] = ['TSLA', 'ETH', 'LINK'];
const isOfTickerType = (ticker: string) => tickerTypes.includes(ticker);
interface LProps {
    className?: string;
    ticker: string | undefined;
    clear?: boolean; // true then display outlined image
}
export const Logo: React.FC<LProps> = styled(({ className, ticker, clear }: LProps) => {
    return (
        <>
            { ticker !== undefined && isOfTickerType(ticker) ? (
                <img className={className} src={clear ? clearLogos[ticker] : logos[ticker]} alt="logo" />
            ) : null}
        </>
    );
})`
    width: 30px;
    margin: 5px 0;
`;

export const Previous = styled.span`
    color: var(--color-secondary);
    margin-right: 5px;
    &:after {
        padding-left: 2px;
        content: '>>>';
    }
`;
export const Approx = styled.span`
    color: var(--color-secondary);
    margin-right: 5px;
    &:before {
        padding-left: 2px;
        content: '~';
    }
`;

export const After = styled.span`
    color: var(--color-secondary);
    &:before {
        padding-right: 0.5rem;
        content: '>>>';
    }
`;

export const Close = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 28px;
    border: 1px solid var(--color-primary);
    border-radius: 50px;
    background-image: url('/img/general/close.svg');
    background-position: center center;
    background-size: 17px 17px;
    background-repeat: no-repeat;
    transition: background-color 0.5s ease;
    backface-visibility: hidden;

    &:hover {
        cursor: pointer;
        background-color: var(--color-primary);
        background-image: url('/img/general/close-white.svg');
    }
`;

type IProps = {
    percent: number;
    className?: string;
};

export const ProgressBar = styled(({ percent, className }: IProps) => {
    return (
        <div className={className}>
            <div className="progress" />
            <p className="label">{percent}%</p>
        </div>
    );
})<IProps>`
    background: var(--color-accent);
    position: relative;
    height: 32px;
    border-radius: 20px;

    > .progress {
        transition: 0.3s;
        background: var(--color-primary);
        height: 100%;
        width: ${(props) => `${props.percent}%`};
        border-radius: 20px;
        max-width: 100%;
    }

    > .label {
        letter-spacing: var(--letter-spacing-small);
        font-size: var(--font-size-small);
        position: absolute;
        height: fit-content;
        width: fit-content;
        top: 0;
        bottom: 0;
        left: ${(props) => (props.percent !== 0 && props.percent < 100 ? 'auto' : '0')};
        right: ${(props) => (props.percent !== 0 && props.percent < 100 ? 'auto' : '0')};
        left: ${(props) =>
            `${props.percent !== 0 && props.percent < 100 ? `calc(${props.percent / 2}% - 16px)` : '0'}`};
        margin: auto;
    }
`;

export * from './Dropdown';
export * from './Input';
export * from './Notification';
export * from './';
