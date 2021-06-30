import React from 'react';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';
import { Children } from 'types/General';
import { BigNumber } from 'bignumber.js';

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

// Market select section
export const AmountTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Amount</strong> Amount of {baseTicker} you would like to go long or short on for this order. If you
            have have an open position, your exposure will be updated by this specified amount.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const PriceTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Price</strong> The price of {baseTicker} you would like to go long or short on. The order will
            execute at the specified price or better.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const LeverageTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = (
        <p>
            <strong>Leverage</strong> A multiplier that allows you to increase your buying power and open positions
            larger than your account margin. Leverage will magnify any profits (or losses).
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

// Margin account section
export const EquityTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Equity</strong> The total value of your account. Equity is equal to your net transfers from your
            wallet plus your profit and losses from your {baseTicker} position.
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
            <strong>Buying Power</strong> Your maximum potential exposure to {baseTicker} given your available margin.
            It is equal to your available margin of {availableMargin} multiplied by the maximum leverage of{' '}
            {maxLeverage}.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const AvailableMarginTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = (
        <p>
            <strong>Available Margin</strong> The percentage of margin that can be used or withdrawn without liquidating
            your current position.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

// Insurance pool health section
export const InsurancePoolHealthTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = (
        <p>
            <strong>Insurance Pool Health</strong> The percentage of the pool target that is met by the pool holdings. A
            higher insurance health indicates the pool holdings are approaching the pool target.{' '}
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

export const PoolHoldingsTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Pool Holdings</strong> The current holdings in the the {baseTicker} insurance pool that have been
            accumulated through a combination of deposits and insurance funding rate payments.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const PoolTargetTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Pool Target</strong> The target value for the insurance pool borrowed by leveraged traders in the{' '}
            {baseTicker} market.{' '}
            <a
                onClick={() =>
                    window.open(
                        'https://docs.tracer.finance/products/perpetual-swaps/insurance/insurance-funding-rate#target',
                        '_blank',
                        'noopener',
                    )
                }
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

export const InsuranceFundingRateTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Insurance Funding Rate</strong> A fee that is applied to the borrowings of leveraged traders in the{' '}
            {baseTicker} market to capitalise the {baseTicker} insurance pool. The fee is paid continuously, and is
            updated every 8 hours.{' '}
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

// Account details section
export const RealisedPnLTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Realised PnL</strong> The amount of profit or loss you have realised through partially closing your{' '}
            {baseTicker} position, and/or paying trading fees, funding rate payments, insurance funding rate payments
            and gas costs.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const UnrealisedPnLTip: React.FC<BTProps> = ({ className, baseTicker, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Unrealised PnL</strong> The amount of profit or loss you would realise if you closed your{' '}
            {baseTicker} position at the current mark price.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const ExposureTip: React.FC<BTProps> = ({ className, baseTicker, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Exposure</strong> The size of your {baseTicker} position.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

// LiquidationPriceTipProps
type LPTProps = {
    className?: string;
    quote: BigNumber;
    position: number;
} & TProps;
export const LiquidationPriceTip: React.FC<LPTProps> = ({ className, quote, position, children }: LPTProps) => {
    let tooltip;
    if (quote.eq(0)) {
        tooltip = (
            <p>
                <strong>Liquidation Price</strong> If the mark price falls below this price (for longs) and rises above
                this price (for shorts), your position will be liquidated.
            </p>
        );
    } else if (position === 1) {
        tooltip = (
            <p>
                <strong>Liquidation Price</strong> If the mark price falls below this price, your position will be
                liquidated.
            </p>
        );
    } else if (position === 0) {
        tooltip = (
            <p>
                <strong>Liquidation Price</strong> If the mark price rises above this price, your position will be
                liquidated.
            </p>
        );
    }
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

// Order book section
export const BestTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = (
        <p>
            <strong>Best</strong> The best price offered by the order book. This is the highest bid (for longs), and the
            lowest ask (for shorts).
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

// Insurance pools section
export const CurrentAPYTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = (
        <p>
            <strong>Current APY</strong> The current rewards earned by insurance providers.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const PoolOwnershipTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = (
        <p>
            <strong>Pool Ownership</strong> The amount of insurance pool tokens you hold.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const BufferTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = (
        <p>
            <strong>Buffer</strong> The holdings in the insurance buffer account. The insurance buffer account has
            priority for insurance expenses and provides a layer of protection for depositors.{' '}
            <a
                onClick={() =>
                    window.open(
                        'https://docs.tracer.finance/products/perpetual-swaps/insurance/direct-deposits#insurance-buffer-account',
                        '_blank',
                        'noopener',
                    )
                }
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

export const PublicTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = (
        <p>
            <strong>Public</strong> The holdings in the insurance public account.{' '}
            <a
                onClick={() =>
                    window.open(
                        'https://docs.tracer.finance/products/perpetual-swaps/insurance/direct-deposits#public-insurance-account',
                        '_blank',
                        'noopener',
                    )
                }
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

export const EtherscanLinkTip: React.FC<TProps> = ({ className, children }: TProps) => {
    const tooltip = <p>View on Etherscan</p>;
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

// Insurance modal section
export const TotalReturnTip: React.FC<BTProps> = ({ className, baseTicker, children }: BTProps) => {
    const tooltip = (
        <p>
            <strong>Total Return</strong> The profits from withdrawing your {baseTicker} which will be deposited to your
            connected wallet. Total return takes into consideration the current withdrawal fee, however does not account
            for gas fees.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const AdjustPositionTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            Adjust your position directly by moving the leverage slider. Amount (above) will update to reflect the
            amount of {baseTicker} you need to order to adjust your leverage to the specified value
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};

export const NewOrderTip: React.FC<BTProps> = ({ baseTicker, className, children }: BTProps) => {
    const tooltip = (
        <p>
            Enter the side and amount of {baseTicker} you would like to order. Your existing leverage (below) will be
            updated by this specified amount.
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};
