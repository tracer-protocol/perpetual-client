import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

export const ReactTooltipStyled = styled(ReactTooltip)`
    width: 12rem !important;
    color: #005ea4 !important;
    opacity: 1 !important;

    strong {
        color: #3da8f5 !important;
    }

    &.type-dark.place-top {
        background-color: #002886 !important;
        padding: 0.5rem 0.2rem 0.5rem 0.5rem !important;

        &:after {
            border-top-color: #002886 !important;
        }
    }
`;

type TProps = {
    className?: string;
    market?: any;
    availableMargin?: any;
};

export const AmountTip: React.FC<TProps> = styled(({ className, market }: TProps) => {
    return (
        <ReactTooltipStyled id="amount" className={className} effect="solid">
            <strong>Amount</strong> Amount of {market} you would like to go long or short on for this order. If you have
            have an open position, your exposure will be updated by this specified amount.
        </ReactTooltipStyled>
    );
})``;

export const PriceTip: React.FC<TProps> = styled(({ className, market }: TProps) => {
    return (
        <ReactTooltipStyled id="price" className={className} effect="solid">
            <strong>Price</strong> The price of {market} you would like to go long or short on. The order will execute
            at the specified price or better.
        </ReactTooltipStyled>
    );
})``;

export const LeverageTip: React.FC<TProps> = styled(({ className }: TProps) => {
    return (
        <ReactTooltipStyled id="leverage" className={className} effect="solid">
            <strong>Leverage</strong> A multiplier that allows you to increase your buying power and open positions
            larger than your account margin. Leverage will magnify any profits (or losses).
        </ReactTooltipStyled>
    );
})``;

export const TotalMarginTip: React.FC<TProps> = styled(({ className, market }: TProps) => {
    return (
        <ReactTooltipStyled id="total-margin" className={className} effect="solid">
            <strong>Total Margin</strong> The total value of your account. Total margin is equal to your net transfers
            from your wallet plus your profit and losses from your {market} position.
        </ReactTooltipStyled>
    );
})``;

export const BuyingPowerTip: React.FC<TProps> = styled(({ className, market, availableMargin }: TProps) => {
    return (
        <ReactTooltipStyled id="buying-power" className={className} effect="solid">
            <strong>Buying Power</strong> Your maximum potential exposure to {market} given your available margin. It is
            equal to your available margin of {availableMargin} multiplied by the maximum leverage of [insert maximum
            maximum leverage].
        </ReactTooltipStyled>
    );
})``;

export const AvailableMarginTip: React.FC<TProps> = styled(({ className }: TProps) => {
    return (
        <ReactTooltipStyled id="available-margin" className={className} effect="solid">
            <strong>Available Margin</strong> The percentage of margin that can be used or withdrawn without liquidating
            your current position.
        </ReactTooltipStyled>
    );
})``;


