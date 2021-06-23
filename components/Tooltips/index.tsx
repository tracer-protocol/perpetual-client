import React from 'react';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';
import { Children } from 'types/General';

export const StyledTooltip = styled(Tooltip)`
    color: inherit;

    &:hover {
        cursor: pointer;
    }
`;

// TooltipProps
type TProps = {
    className?: string;
} & Children;

// BaseTickerProps
type BTProps = {
    baseTicker: string;
} & TProps;

export const AmountTip: React.FC<BTProps> = ({
    baseTicker,
    className,
    children,
}: BTProps) => {
    const tooltip = (
        <p>
            <strong>Amount</strong> Amount of {baseTicker} you would like to go
            long or short on for this order. If you have have an open position,
            your exposure will be updated by this specified amount.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const PriceTip: React.FC<BTProps> = ({
    baseTicker,
    className,
    children,
}: BTProps) => {
    const tooltip = (
        <p>
            <strong>Price</strong> The price of {baseTicker} you would like to
            go long or short on. The order will execute at the specified price
            or better.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const LeverageTip: React.FC<TProps> = ({
    className,
    children,
}: TProps) => {
    const tooltip = (
        <p>
            <strong>Leverage</strong> A multiplier that allows you to increase
            your buying power and open positions larger than your account
            margin. Leverage will magnify any profits (or losses).
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const TotalMarginTip: React.FC<BTProps> = ({
    baseTicker,
    className,
    children,
}: BTProps) => {
    const tooltip = (
        <p>
            <strong>Total Margin</strong> The total value of your account. Total
            margin is equal to your net transfers from your wallet plus your
            profit and losses from your {baseTicker} position.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

// BuyingPowerTipProps
type BPTProps = {
    availableMargin: number;
    maxLeverage: number;
} & BTProps;
export const BuyingPowerTip: React.FC<BPTProps> = ({
    baseTicker,
    availableMargin,
    maxLeverage,
    className,
    children,
}: BPTProps) => {
    const tooltip = (
        <p>
            <strong>Buying Power</strong> Your maximum potential exposure to{' '}
            {baseTicker} given your available margin. It is equal to your
            available margin of {availableMargin} multiplied by the maximum
            leverage of {maxLeverage}.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const AvailableMarginTip: React.FC<TProps> = ({
    className,
    children,
}: TProps) => {
    const tooltip = (
        <p>
            <strong>Available Margin</strong> The percentage of margin that can
            be used or withdrawn without liquidating your current position.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const InsurancePoolHealthTip: React.FC<TProps> = ({
    className,
    children,
}: TProps) => {
    const tooltip = (
        <p>
            <strong>Insurance Pool Health</strong> The percentage of the pool
            target that is met by the pool holdings. A higher insurance health
            indicates the pool holdings are approaching the pool target.{' '}
            <a
                href="https://docs.tracer.finance/products/perpetual-swaps/insurance/insurance-funding-rate"
                target="_blank"
                rel="noreferrer"
            >
                Learn more.
            </a>
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const PoolHoldingsTip: React.FC<BTProps> = ({
    baseTicker,
    className,
    children,
}: BTProps) => {
    const tooltip = (
        <p>
            <strong>Pool Holdings</strong> The current holdings in the the{' '}
            {baseTicker} insurance pool that have been accumulated through a
            combination of deposits and insurance funding rate payments.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const PoolTargetTip: React.FC<BTProps> = ({
    baseTicker,
    className,
    children,
}: BTProps) => {
    const tooltip = (
        <p>
            <strong>Pool Target</strong> The target value for the insurance pool
            borrowed by leveraged traders in the {baseTicker} market.{' '}
            <a
                href="https://docs.tracer.finance/products/perpetual-swaps/insurance/insurance-funding-rate#target"
                target="_blank"
                rel="noreferrer"
            >
                Learn more.
            </a>
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const InsuranceFundingRateTip: React.FC<BTProps> = ({
    baseTicker,
    className,
    children,
}: BTProps) => {
    const tooltip = (
        <p>
            <strong>Insurance Funding Rate</strong> A fee that is applied to the
            borrowings of leveraged traders in the {baseTicker} market to
            capitalise the {baseTicker} insurance pool. The fee is applied is
            continuously paid and updated every 8 hours.{' '}
            <a
                href="https://docs.tracer.finance/products/perpetual-swaps/insurance/insurance-funding-rate#insurance-funding-rate"
                target="_blank"
                rel="noreferrer"
            >
                Learn more.
            </a>
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const RealisedPnLTip: React.FC<BTProps> = ({
    baseTicker,
    className,
    children,
}: BTProps) => {
    const tooltip = (
        <p>
            <strong>Realised PnL</strong> The amount of profit or loss you have
            realised through partially closing your {baseTicker} position,
            and/or paying trading fees, funding rate payments, insurance funding
            rate payments and gas costs.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const UnrealisedPnLTip: React.FC<BTProps> = ({
    className,
    baseTicker,
    children,
}: BTProps) => {
    const tooltip = (
        <p>
            <strong>Unrealised PnL</strong> The amount of profit or loss you
            would realise if you closed your {baseTicker} position at the
            current mark price.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};
