import { CloseOutlined } from '@ant-design/icons';
import { Children } from 'types';
import React from 'react';
import styled from 'styled-components';
import TooltipSelector, { TooltipSelectorProps } from '@components/Tooltips/TooltipSelector';

export const DateAndTime = styled(({ className, date, time }) => {
    return (
        <div className={className}>
            {date}
            <div className="secondary">{time}</div>
        </div>
    );
})`
    font-size: var(--font-size-small);

    .secondary {
        color: #005ea4;
    }
`;

export const Box = styled.div`
    display: flex;
    padding: 20px;
`;

export const Button = styled.button`
    transition: 0.3s;
    color: var(--color-primary);
    font-size: var(--font-size-small);
    line-height: 1rem;
    letter-spacing: -0.32px;
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    text-align: center;
    padding: 10px 0;
    width: 160px;
    margin: auto;

    &:focus,
    &:active {
        border: 1px solid var(--color-text);
        outline: 0;
        box-shadow: none;
    }

    &:hover {
        cursor: pointer;
        background: var(--color-primary);
        color: var(--color-text);
    }

    &.primary {
        background: var(--color-primary);
        color: var(--color-text);
    }

    &.primary:hover {
        background: var(--color-background);
        color: var(--color-primary);
    }

    &.disabled {
        &:hover {
            color: var(--color-primary);
            background: none;
        }
    }

    &:disabled,
    &[disabled] {
        opacity: 0.8;
        cursor: not-allowed;
    }

    &.disabled,
    .button-disabled {
        opacity: 0.8;
    }

    &.disabled:hover,
    .button-disabled:hover {
        cursor: not-allowed !important;
    }
`;

export const Card = styled.div`
    background: #011772;
    box-shadow: 0 5px 10px #00000029;
    border-radius: 5px;
    transition: 0.3s;

    h1 {
        font-size: var(--font-size-medium);
        letter-spacing: -0.4px;
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
                <div className={`label`}>{label}</div>
            )}
            <span className={`content`}>{children}</span>
        </div>
    );
})`
    width: 100%;
    display: flex;
    margin: 10px 0;
    font-size: var(--font-size-small);

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
    ETH: '/img/logos/currencies/eth_clear.svg',
    TEST1: '/img/logos/currencies/eth_clear.svg',
};

const logos: Record<string, string> = {
    TSLA: '/img/logos/currencies/tesla.svg',
    ETH: '/img/logos/currencies/eth.svg',
    TEST1: '/img/logos/currencies/eth.svg',
    LINK: '/img/logos/currencies/link.svg',
    DEFAULT: '/img/logos/currencies/tesla.svg',
};

interface LProps {
    className?: string;
    ticker: string;
    clear?: boolean; // true then display outlined image
}

export const Logo: React.FC<LProps> = styled(({ className, ticker, clear }: LProps) => {
    return <img className={className} src={clear ? clearLogos[ticker] : logos[ticker] ?? logos['TSLA']} alt="logo" />;
})`
    width: 30px;
    margin: 5px 0;
`;

export const Previous = styled.span`
    color: #005ea4;
    margin-right: 5px;
    &:after {
        padding-left: 2px;
        content: '>>>';
    }
`;
export const Approx = styled.span`
    color: #005ea4;
    margin-right: 5px;
    &:before {
        padding-left: 2px;
        content: '~';
    }
`;

export const After = styled.span`
    color: #005ea4;
    &:before {
        padding-right: 0.5rem;
        content: '>>>';
    }
`;

export const Close = styled(CloseOutlined)`
    background: var(--color-accent);
    border-radius: 20px;
    width: 58px;
    height: 40px;
    transition: 0.3s;
    display: flex;
    top: 0;
    right: 20px;
    > svg {
        transition: 0.3s;
        margin: auto;
        height: 20px;
        width: 20px;
        color: var(--color-text);
    }
    &:hover {
        cursor: pointer;
        background: var(--color-primary);
    }
    &:hover svg {
    }
`;

type IProps = {
    percent: number;
    className?: string;
};

export const ProgressBar: React.FC<IProps> = styled(({ percent, className }: IProps) => {
    return (
        <div className={className}>
            <div className="progress" />
            <p className="label">{percent}%</p>
        </div>
    );
})`
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
        letter-spacing: -0.32px;
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
export * from './Menu';
export * from './';
