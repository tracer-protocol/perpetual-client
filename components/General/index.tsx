import { CloseOutlined } from '@ant-design/icons';
import { Children } from 'types';
import Tooltip from 'antd/lib/tooltip';
import React from 'react';
import styled from 'styled-components';

export const Box: React.FC<{ className?: string }> = styled.div`
    border: 1px solid #0c3586;
    display: flex;
    padding: 20px;
`;

export const Button = styled.div`
    transition: 0.3s;
    color: #3da8f5;
    font-size: 1rem;
    line-height: 1rem;
    letter-spacing: -0.32px;
    border: 1px solid #3da8f5;
    border-radius: 20px;
    text-align: center;
    padding: 10px 0;
    width: 160px;

    &:hover {
        cursor: pointer;
        background: #3da8f5;
        color: #fff;
    }

    &.primary {
        background: #3da8f5;
        color: #fff;
    }

    &.primary:hover {
        background: #03065e;
        color: #3da8f5;
    }

    &.disabled {
        opacity: 0.8;
    }

    &.disabled:hover {
        cursor: not-allowed;
    }
`;

export const Card = styled.div`
    background: #011772;
    box-shadow: 0 5px 10px #00000029;
    border-radius: 5px;
    transition: 0.3s;

    h1 {
        font-size: 20px;
        letter-spacing: -0.4px;
        color: #ffffff;
    }
`;

type SProps = {
    label: string;
    className?: string;
    tooltip?: React.ReactChild;
} & Children;

export const Section: React.FC<SProps> = styled(({ label, children, className, tooltip }: SProps) => {
    return tooltip ? (
        <Tooltip title={tooltip} placement="right">
            <div className={`${className}`}>
                <span className={`label`}>{label}</span>
                <span className={`content`}>{children}</span>
            </div>
        </Tooltip>
    ) : (
        <div className={`${className}`}>
            <span className={`label`}>{label}</span>
            <span className={`content`}>{children}</span>
        </div>
    );
})`
    width: 100%;
    display: flex;
    margin: 10px 0;
    font-size: 16px;
    letter-spacing: -0.32px;
    border-bottom: 1px solid #011772;
    > .label {
        text-align: left;
        white-space: nowrap;
        color: #3da8f5;
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
};

const logos: Record<string, string> = {
    TSLA: '/img/logos/currencies/tesla.svg',
    ETH: '/img/logos/currencies/eth.svg',
    LINK: '/img/logos/currencies/link.svg',
};

type Ticker = 'TSLA' | 'ETH' | 'LINK';

interface LProps {
    className?: string;
    ticker: Ticker;
    clear?: boolean; // true then display outlined image
}

export const Logo: React.FC<LProps> = styled(({ className, ticker, clear }: LProps) => {
    return <img className={className} src={clear ? clearLogos[ticker] : logos[ticker]} alt="logo" />;
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

export const After = styled.span`
    color: #005ea4;
    &:before {
        padding-right: 0.5rem;
        content: '>>>';
    }
`;

export const Close = styled(CloseOutlined)`
    background: #002886;
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
        color: #fff;
    }
    &:hover {
        cursor: pointer;
        background: #3da8f5;
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
    background: #002886;
    position: relative;
    height: 32px;
    border-radius: 20px;

    > .progress {
        transition: 0.3s;
        background: #3da8f5;
        height: 100%;
        width: ${(props) => `${props.percent}%`};
        border-radius: 20px;
        max-width: 100%;
    }

    > .label {
        letter-spacing: -0.32px;
        font-size: 16px;
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
